import { Injectable } from '@angular/core';
import { GalleryImageModel } from './image.model';
import { CoreHttpDownloaderFirebase } from '../../core/http/downloader/firebase';
import { CoreContentCensorshipWordService } from '../../core/content/censorship/word.service';
import { SourceModel } from './source.model';
import { GalleryExtractorImageService } from './extractor/image.service';
import { GalleryExtractorLinkService } from './extractor/link.service';
import { GalleryExtractorImageLinkPatternService } from './extractor/image-link-pattern.service';
import { GalleryExtractorPageLinkPatternService } from './extractor/page-link-pattern.service';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { CoreUtilRegExp } from '../../core/util/reg-exp';
import { GalleryExtractorImageSrcPatternService } from './extractor/image-src-pattern.service';

@Injectable()
export class GalleryImageService {

  public image$: Observable<GalleryImageModel>;
  private image: Subject<GalleryImageModel>;
  private source: SourceModel[] = [];
  private srcLoaded: { [key: string]: boolean } = {};

  /**
   *
   * @param downloader
   * @param censorship
   * @param imageExtractor
   * @param linkExtractor
   * @param imageLinkPatternExtractor
   * @param pageLinkPatternExtractor
   * @param imageSrcPatternExtractor
   */
  constructor(private downloader: CoreHttpDownloaderFirebase,
              private censorship: CoreContentCensorshipWordService,
              private imageExtractor: GalleryExtractorImageService,
              private linkExtractor: GalleryExtractorLinkService,
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

    this.source = [];
    this.srcLoaded = {};
  }

  /**
   * Add a source URL
   */
  addSource(source: SourceModel): void {

    this.source.push(source);
  }

  /**
   * Returns an observable of image, loaded from all added sources
   */
  loadImages(): Observable<GalleryImageModel> {

    // Only consider sources that are not loading and that have more pages to load
    const sources = this.source.filter(source => !source.isLoading && source.hasMorePages);

    sources.forEach(source => {

      // Set source as loading
      source.isLoading = true;

      // Default URL to download content from
      let url: string = source.getHttpUrl().getUrl();

      // Source is initialized
      if (source.isInitialized === true) {

        // Increment page number
        source.page++;

        // Use page pattern to set next page URL
        url = source.pageLinkPattern.replace(/@page@/gi, String(source.page));
      }

      // Download content
      this
        .downloader
        .getContent(url)
        .then((content: string) => {

          // Set source as not loading
          source.isLoading = false;

          // Extract links
          const links = this.linkExtractor.extract(source, content);

          // Extract images
          const images = this.imageExtractor.extract(source, links);

          // Source not initialized
          if (source.isInitialized === false) {

            // Extract image link pattern
            const imageLinkPattern = this.imageLinkPatternExtractor.extract(images);
            source.imageLinkPattern = this.patternToRegExp(imageLinkPattern);

            // Extract image src pattern
            const imageSrcPattern = this.imageSrcPatternExtractor.extract(images);
            source.imageSrcPattern = this.patternToRegExp(imageSrcPattern);

            // Extract page link pattern
            source.pageLinkPattern = this.pageLinkPatternExtractor.extract(links, imageLinkPattern);

            if (source.pageLinkPattern === '') {

              source.hasMorePages = false;
              return;
            }

            // Extract current page number
            let currentPagePattern = source.pageLinkPattern.replace(/@page@/gi, '([0-9]+)');
            currentPagePattern = '^' + currentPagePattern + '$';

            if (url.match(currentPagePattern)) {

              source.page = parseInt(url.replace(new RegExp(currentPagePattern), '$1'), 10);
            }

            // Set source as initialized
            source.isInitialized = true;
          }

          // Images found
          if (images.length > 0 && source.pageLinkPattern) {

            images
              // Prevent duplicated src
              .filter(image => !this.srcLoaded[image.getSrc()])
              // Apply censorship
              .filter(image => this.censorship.isSafe(image.getLink().getHtml()))
              // Match image link pattern
              .filter(image => {

                const linkMatch = image.getLink().getUrl().match(source.imageLinkPattern);
                const srcMatch = image.getSrc().match(source.imageSrcPattern);

                return linkMatch || srcMatch;
              })
              // Keep image
              .forEach(image => {

                // Keep src as loaded
                this.srcLoaded[image.getSrc()] = true;

                // Image loaded
                this.image.next(image);
              })
            ;
          } else {

            // Prevent more image loadings
            source.hasMorePages = false;
          }
        })
        .catch(e => {

          // Set source as not loading
          source.isLoading = false;
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

    return this.source.some(source => source.hasMorePages);
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
