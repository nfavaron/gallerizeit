import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { ImageModel } from './image.model';
import { SiteModel } from '../../core/site/site.model';
import { HttpDownloaderService } from '../../core/http/http-downloader.service';
import { CensorshipKeyword } from '../../shared/censorship/censorship-keyword';
import { extractListImageLink } from './extract/extract-list-image-link';
import { extractListImage } from './extract/extract-list-image';
import { extractPatternImageLink } from './extract/extract-pattern-image-link';
import { regExpEscape } from '../../shared/regexp/regexp-escape';
import { extractPatternImageSrc } from './extract/extract-pattern-image-src';
import { extractPatternPageLink } from './extract/extract-pattern-page-link';
import { extractTitle } from './extract/extract-title';

@Injectable()
export class ImageService {

  /**
   * Observable of loaded image
   */
  public image$: Observable<ImageModel>;
  private image: Subject<ImageModel>;

  /**
   * Observable of loaded site
   */
  public site$: Observable<SiteModel>;
  private site: Subject<SiteModel>;

  /**
   * Added site model as source
   */
  private siteModels: SiteModel[] = [];

  /**
   * Loaded image "src" values
   */
  private srcLoaded: { [key: string]: boolean } = {};

  /**
   *
   * @param httpDownloaderService
   * @param censorshipKeyword
   */
  constructor(private httpDownloaderService: HttpDownloaderService,
              private censorshipKeyword: CensorshipKeyword) {

    this.image = new Subject<ImageModel>();
    this.image$ = this.image.asObservable();

    this.site = new Subject<SiteModel>();
    this.site$ = this.site.asObservable();
  }

  /**
   * Reset the service
   */
  reset(): void {

    this.siteModels = [];
    this.srcLoaded = {};
  }

  /**
   * Add a site URL
   */
  addSite(site: SiteModel): void {

    this.siteModels.push(site);
  }

  /**
   * Returns an observable of image, loaded from all added sites
   *
   * TODO: breakdown / simplify this function
   */
  loadImages(): Observable<ImageModel> {

    // Only consider sites that are not loading and that have more pages to load
    const sites = this.siteModels.filter(site => !site.isLoading && site.hasMorePages);

    sites.forEach(site => {

      // Set site as loading
      site.isLoading = true;

      // Default URL to download content from
      let url: string = site.getUrlParser().getUrl();

      // Site is initialized
      if (site.isInitialized === true) {

        // Increment page number
        site.page++;

        // Use page pattern to set next page URL
        url = site.pageLinkPattern.replace(/@page@/gi, String(site.page));
      }

      // Download content
      this
        .httpDownloaderService
        .getContent(url)
        .then((content: string) => {

          // Set site as not loading
          site.isLoading = false;

          // Extract links
          const links = extractListImageLink(site, content);

          // Extract images
          const images = extractListImage(site, links);

          // Site not initialized
          if (site.isInitialized === false) {

            // Extract image link pattern
            const imageLinkPattern = extractPatternImageLink(images);
            site.imageLinkPattern = this.patternToRegExp(imageLinkPattern);

            // Extract image src pattern
            const imageSrcPattern = extractPatternImageSrc(images);
            site.imageSrcPattern = this.patternToRegExp(imageSrcPattern);

            // Extract page link pattern
            site.pageLinkPattern = extractPatternPageLink(links, imageLinkPattern);

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
              // Apply censorshipKeyword
              .filter(image => this.censorshipKeyword.isSafe(image.getImageLink().getHtml()))
              // Match image link pattern
              .filter(image => {

                const linkMatch = image.getImageLink().getUrl().match(site.imageLinkPattern);
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
                  site.title = extractTitle(site, content);

                  // Site loaded
                  this.site.next(site);
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

    return this.siteModels.some(site => site.hasMorePages);
  }

  /**
   * Converts a string URL pattern to a RegExp
   *
   * @param pattern
   */
  private patternToRegExp(pattern: string): RegExp {

    pattern = regExpEscape(pattern, '/')
      .replace(/@subdomain@/gi, '[a-z0-9]+')
      .replace(/@number@/gi, '[0-9]+')
      .replace(/@file@/gi, '[^\?]+')
      .replace(/@params@/gi, '.*')
    ;

    return new RegExp('^' + pattern + '$');
  }
}
