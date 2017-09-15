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
   */
  constructor(private downloader: CoreHttpDownloaderFirebase,
              private censorship: CoreContentCensorshipWordService,
              private imageExtractor: GalleryExtractorImageService,
              private linkExtractor: GalleryExtractorLinkService,
              private imageLinkPatternExtractor: GalleryExtractorImageLinkPatternService,
              private pageLinkPatternExtractor: GalleryExtractorPageLinkPatternService) {

    this.image = new Subject<GalleryImageModel>();
    this.image$ = this.image.asObservable();
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
    this.source
      .filter(source => !source.isLoading && source.hasMorePages)
      .forEach(source => {

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
          const links = this.linkExtractor.extract(content);

          // Extract images
          const images = this.imageExtractor.extract(links);

          // Source not initialized
          if (source.isInitialized === false) {

            // Extract image link pattern
            const imageLinkPattern = this.imageLinkPatternExtractor.extract(images);
            source.imageLinkPattern = CoreUtilRegExp.escape(imageLinkPattern, '/');
            source.imageLinkPattern = source.imageLinkPattern.replace('@subdomain@', '[a-z0-9]+');
            source.imageLinkPattern = source.imageLinkPattern.replace('@number@', '[0-9]+');
            source.imageLinkPattern = source.imageLinkPattern.replace('@file@', '[^\?]+');
            source.imageLinkPattern = source.imageLinkPattern.replace('@params@', '.*');
            source.imageLinkPattern = '^' + source.imageLinkPattern + '$';

            // Extract page link pattern
            source.pageLinkPattern = this.pageLinkPatternExtractor.extract(links, imageLinkPattern);

            // Missing protocol
            if (source.pageLinkPattern.indexOf('//') === 0) {

              source.pageLinkPattern = source.getHttpUrl().getProtocol() + ':' + source.pageLinkPattern;

              // Missing protocol & domain but is absolute link
            } else if (source.pageLinkPattern.indexOf('/') === 0) {

              source.pageLinkPattern = source.getHttpUrl().getOrigin() + source.pageLinkPattern;

              // Missing protocol & domain but is relative link
            } else if (!source.pageLinkPattern.match(/^https?:\/\//gi)) {

              source.pageLinkPattern = source.getHttpUrl().getOrigin() + '/' + source.pageLinkPattern;

            }

            // Extract current page number
            let currentPagePattern = source.pageLinkPattern.replace('@page@', '([0-9]+)');
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
              .filter(image => image.getLink().getUrl().match(new RegExp(source.imageLinkPattern)))
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
}
