import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { ImageModel } from './image.model';
import { SiteModel } from '../../core/site/site.model';
import { ErrorModel } from './error.model';
import { HttpDownloaderService } from '../../core/http/http-downloader.service';
import { CensorshipKeyword } from '../../shared/censorship/censorship-keyword';
import { extractListImageLink } from './extract/extract-list-image-link';
import { extractListImage } from './extract/extract-list-image';
import { extractPatternImageLink } from './extract/extract-pattern-image-link';
import { regExpEscape } from '../../shared/regexp/regexp-escape';
import { extractPatternImageSrc } from './extract/extract-pattern-image-src';
import { extractPatternPageLink } from './extract/extract-pattern-page-link';
import { extractTitle } from './extract/extract-title';
import { ImageLinkModel } from './image-link.model';

@Injectable()
export class CrawlerService {

  /**
   * Observable of image
   */
  public image$: Observable<ImageModel>;
  private image: Subject<ImageModel>;

  /**
   * Observable of site
   */
  public site$: Observable<SiteModel>;
  private site: Subject<SiteModel>;

  /**
   * Observable of error
   */
  public error$: Observable<ErrorModel>;
  private error: Subject<ErrorModel>;

  /**
   * Added site model as source
   */
  private sites: SiteModel[] = [];

  /**
   * Loaded image "src" values
   */
  private srcLoaded: { [key: string]: boolean } = {};

  /**
   * Last reset timestamp, acting as unique identifier
   */
  private id: number;

  /**
   *
   * @param httpDownloaderService
   * @param censorshipKeyword
   */
  constructor(private httpDownloaderService: HttpDownloaderService,
              private censorshipKeyword: CensorshipKeyword) {

    this.reset();
  }

  /**
   * Returns crawler ID
   */
  getId(): number {

    return this.id;
  }

  /**
   * Reset the crawler
   */
  reset(): void {

    this.id = Date.now();

    this.sites = [];
    this.srcLoaded = {};

    this.image = new Subject<ImageModel>();
    this.image$ = this.image.asObservable();

    this.site = new Subject<SiteModel>();
    this.site$ = this.site.asObservable();

    this.error = new Subject<ErrorModel>();
    this.error$ = this.error.asObservable();
  }

  /**
   * Add a site to crawl
   *
   * @param site
   */
  addSite(site: SiteModel): void {

    this.sites.push(site);
  }

  /**
   * Load sites & crawl their content to find images
   */
  load(): void {

    // Only consider sites that are not loading and that have more pages to load
    this
      .sites
      .filter(site => !site.isLoading && site.hasMorePages)
      .forEach(site => this.crawl(site))
    ;
  }

  /**
   * Returns list of sites being crawled
   */
  getCrawledSites(): SiteModel[] {

    return this.sites.filter(site => site.hasMorePages);
  }

  /**
   * Crawl site and emit images, sites and errors
   *
   * @param site
   */
  private crawl(site: SiteModel): void {

    // Set site as loading
    site.isLoading = true;

    // Increment crawl count
    site.crawlCount++;

    // Get URL to crawl
    const url = this.getUrl(site);

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

        // Initialize site
        this.initializeSite(site, url, links, images);

        // Filtered images
        const filtered = images
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
        ;

        // Images found
        if (filtered.length > 0) {

          // For each filtered image
          filtered.forEach(image => {

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
          });

          // No more pages to load
          if (site.hasMorePages === false) {

            // Emit an error
            this.error.next(new ErrorModel(site, ErrorModel.MSG_HINT));
          }

        } else {

          // Prevent more image loadings
          site.hasMorePages = false;

          // No links detected
          if (links.length === 0) {

            // Emit an error
            this.error.next(new ErrorModel(site, ErrorModel.MSG_NO_LOAD));
            return;
          }

          // Emit an error
          this.error.next(
            new ErrorModel(
              site,
              site.crawlCount === 1 ? ErrorModel.MSG_NO_IMAGE : ErrorModel.MSG_NO_MORE_IMAGE
            )
          );
        }
      })
      .catch(e => {

        // Set site as not loading
        site.isLoading = false;

        // Emit an error
        this.error.next(new ErrorModel(site, ErrorModel.MSG_NO_LOAD));
      })
    ;
  }

  /**
   * Returns the URL to crawl
   *
   * @param site
   */
  private getUrl(site: SiteModel): string {

    // Default URL to download content from
    let url: string = site.getUrlParser().getUrl();

    // Site is initialized
    if (site.isInitialized === true) {

      // Increment page number
      site.page++;

      // Use page pattern to set next page URL
      url = site.pageLinkPattern.replace(/@page@/gi, String(site.page));
    }

    return url;
  }

  /**
   * Initializes the site
   *
   * @param site
   * @param url
   * @param links
   * @param images
   */
  private initializeSite(site: SiteModel, url: string, links: ImageLinkModel[], images: ImageModel[]): void {

    // Site already initialized
    if (site.isInitialized) {
      return;
    }

    // Extract image link pattern
    const imageLinkPattern = extractPatternImageLink(images);
    site.imageLinkPattern = this.patternToRegExp(imageLinkPattern);

    // Extract image src pattern
    const imageSrcPattern = extractPatternImageSrc(images);
    site.imageSrcPattern = this.patternToRegExp(imageSrcPattern);

    // Extract page link pattern
    site.pageLinkPattern = extractPatternPageLink(links, imageLinkPattern);

    // No page link pattern extracted
    if (site.pageLinkPattern === '') {

      // No more pages to load
      site.hasMorePages = false;
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
