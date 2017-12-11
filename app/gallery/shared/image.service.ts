import { Injectable } from '@angular/core';
import { GalleryImageModel } from './image.model';
import { CoreHttpDownloaderFirebase } from '../../core/http/downloader/firebase';
import { CoreContentCensorshipWordService } from '../../core/content/censorship/word.service';
import { GallerySiteModel } from './site.model';
import { GalleryExtractorImageService } from './extractor/image.service';
import { GalleryExtractorLinkService } from './extractor/link.service';
import { GalleryExtractorImageLinkPatternService } from './extractor/image-link-pattern.service';
import { GalleryExtractorPageLinkPatternService } from './extractor/page-link-pattern.service';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { CoreUtilRegExp } from '../../core/util/reg-exp';
import { GalleryExtractorImageSrcPatternService } from './extractor/image-src-pattern.service';
import { GallerySiteService } from './site.service';
import { GalleryExtractorTitleService } from './extractor/title.service';

@Injectable()
export class GalleryImageService {

  public image$: Observable<GalleryImageModel>;
  private image: Subject<GalleryImageModel>;
  private site: GallerySiteModel[] = [];
  private srcLoaded: { [key: string]: boolean } = {};

  /**
   *
   * @param downloader
   * @param censorship
   * @param siteService
   * @param imageExtractor
   * @param linkExtractor
   * @param titleExtractor
   * @param imageLinkPatternExtractor
   * @param pageLinkPatternExtractor
   * @param imageSrcPatternExtractor
   */
  constructor(private downloader: CoreHttpDownloaderFirebase,
              private censorship: CoreContentCensorshipWordService,
              private siteService: GallerySiteService,
              private imageExtractor: GalleryExtractorImageService,
              private linkExtractor: GalleryExtractorLinkService,
              private titleExtractor: GalleryExtractorTitleService,
              private imageLinkPatternExtractor: GalleryExtractorImageLinkPatternService,
              private pageLinkPatternExtractor: GalleryExtractorPageLinkPatternService,
              private imageSrcPatternExtractor: GalleryExtractorImageSrcPatternService) {

    this.image = new Subject<GalleryImageModel>();
    this.image$ = this.image.asObservable();
  }

  /**
   * Reset the service
   */
  reset(): void {

    this.site = [];
    this.srcLoaded = {};
  }

  /**
   * Add a site URL
   */
  addSite(site: GallerySiteModel): void {

    this.site.push(site);
  }

  /**
   * Returns an observable of image, loaded from all added sites
   */
  loadImages(): Observable<GalleryImageModel> {

    // Only consider sites that are not loading and that have more pages to load
    const sites = this.site.filter(site => !site.isLoading && site.hasMorePages);

    sites.forEach(site => {

      // Set site as loading
      site.isLoading = true;

      // Default URL to download content from
      let url: string = site.getHttpUrl().getUrl();

      // Site is initialized
      if (site.isInitialized === true) {

        // Increment page number
        site.page++;

        // Use page pattern to set next page URL
        url = site.pageLinkPattern.replace(/@page@/gi, String(site.page));
      }

      // Download content
      this
        .downloader
        .getContent(url)
        .then((content: string) => {

          // Set site as not loading
          site.isLoading = false;

          // Extract links
          const links = this.linkExtractor.extract(site, content);

          // Extract images
          const images = this.imageExtractor.extract(site, links);

          // Site not initialized
          if (site.isInitialized === false) {

            // Extract image link pattern
            const imageLinkPattern = this.imageLinkPatternExtractor.extract(images);
            site.imageLinkPattern = this.patternToRegExp(imageLinkPattern);

            // Extract image src pattern
            const imageSrcPattern = this.imageSrcPatternExtractor.extract(images);
            site.imageSrcPattern = this.patternToRegExp(imageSrcPattern);

            // Extract page link pattern
            site.pageLinkPattern = this.pageLinkPatternExtractor.extract(links, imageLinkPattern);

            if (site.pageLinkPattern === '') {

              site.hasMorePages = false;
              return;
            }

            // Extract current page number
            let currentPagePattern = site.pageLinkPattern.replace(/@page@/gi, '([0-9]+)');
            currentPagePattern = '^' + currentPagePattern + '$';

            if (url.match(currentPagePattern)) {

              site.page = parseInt(url.replace(new RegExp(currentPagePattern), '$1'), 10);
            }

            // Set site as initialized
            site.isInitialized = true;
          }

          // Images found
          if (images.length > 0 && site.pageLinkPattern) {

            images
              // Prevent duplicated src
              .filter(image => !this.srcLoaded[image.getSrc()])
              // Apply censorship
              .filter(image => this.censorship.isSafe(image.getLink().getHtml()))
              // Match image link pattern
              .filter(image => {

                const linkMatch = image.getLink().getUrl().match(site.imageLinkPattern);
                const srcMatch = image.getSrc().match(site.imageSrcPattern);

                return linkMatch || srcMatch;
              })
              // Keep image
              .forEach(image => {

                // Site not loaded yet
                if (!site.isLoaded) {

                  // Set site as loaded
                  site.isLoaded = true;

                  // Set cover URL
                  site.coverUrl = image.getSrc();

                  // Set title
                  site.title = this.titleExtractor.extract(site, content);

                  // Load from DB
                  const subscription = this
                    .siteService
                    .getSite(site.getId())
                    .first()
                    .subscribe(
                      (siteDb: GallerySiteModel) => {

                        // Is the site considered updated ?
                        const updated = siteDb.coverUrl !== site.coverUrl;

                        // Update existing cover URL
                        siteDb.coverUrl = site.coverUrl;

                        // Update existing title
                        siteDb.title = site.title;

                        // Update load count
                        siteDb.loadCount++;

                        // Update in DB
                        this
                          .siteService
                          .updateSite(siteDb, updated)
                        ;
                      },
                      () => {

                        // Set load count
                        site.loadCount = 1;

                        // Add in DB
                        this
                          .siteService
                          .addSite(site)
                        ;
                      }
                    )
                  ;
                }

                // Keep src as loaded
                this.srcLoaded[image.getSrc()] = true;

                // Image loaded
                this.image.next(image);
              })
            ;
          } else {

            // Prevent more image loadings
            site.hasMorePages = false;
          }
        })
        .catch(e => {

          // Set site as not loading
          site.isLoading = false;
        })
      ;
    });

    return this.image$;
  }

  /**
   * Has more images to load ?
   *
   * @returns {boolean}
   */
  hasMoreImages(): boolean {

    return this.site.some(site => site.hasMorePages);
  }

  /**
   * Converts a string URL pattern to a RegExp
   *
   * @param pattern
   */
  private patternToRegExp(pattern: string): RegExp {

    pattern = CoreUtilRegExp
      .escape(pattern, '/')
      .replace(/@subdomain@/gi, '[a-z0-9]+')
      .replace(/@number@/gi, '[0-9]+')
      .replace(/@file@/gi, '[^\?]+')
      .replace(/@params@/gi, '.*')
    ;

    return new RegExp('^' + pattern + '$');
  }
}
