import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ImageModel } from '../shared/image.model';
import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { CrawlerService } from '../shared/crawler.service';
import { SiteService } from '../../core/site/site.service';
import { SiteModel } from '../../core/site/site.model';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ErrorModel } from '../shared/error.model';
import { HeaderService } from '../../core/header/header.service';

@Component({
  selector: 'app-image-serp',
  templateUrl: './image-serp.component.html',
  styleUrls: ['./image-serp.component.css'],
})
export class ImageSerpComponent implements OnInit, OnDestroy {

  /**
   * Number of "screen height" remaining to scroll before triggering an autoload
   */
  static AUTOLOAD_THRESHOLD: number = 2;

  /**
   * List of results
   */
  results: Array<{
    image?: ImageModel,
    error?: ErrorModel
  }> = [];

  /**
   * List of sites
   */
  sites: SiteModel[] = [];

  /**
   * Sites currently crawled
   */
  crawledSites: SiteModel[] = [];

  /**
   * List of placeholders to display while loading the first time
   */
  placeholders: number[] = [];

  /**
   * Screen min-width => number of images per row
   */
  private screenWidthImageCount: {[key: number]: number} = {
    0: 1,
    480: 2,
    800: 3,
    1100: 4,
    1600: 5
  };

  /**
   * Site IDs that have been liked on this SERP
   */
  private siteIdLiked: string[] = [];

  /**
   * Number of images loaded
   */
  private imageLoadedCount: number = 0;

  /**
   * Observable subscriptions
   */
  private subscriptions: Subscription[] = [];

  /**
   *
   * @param router
   * @param route
   * @param crawlerService
   * @param siteService
   * @param headerService
   */
  constructor(private router: Router,
              private route: ActivatedRoute,
              private crawlerService: CrawlerService,
              private siteService: SiteService,
              private headerService: HeaderService) {

  }

  /**
   * Component init
   */
  ngOnInit() {

    this.subscriptions.push(
      this.route.queryParams.subscribe(params => this.onChangeRoute())
    );

    this.subscriptions.push(
      this.crawlerService.image$.subscribe((image: ImageModel) => this.onLoadImage(image))
    );

    this.subscriptions.push(
      this.crawlerService.site$.subscribe((site: SiteModel) => this.onLoadSite(site))
    );

    this.subscriptions.push(
      this.crawlerService.error$.subscribe((error: ErrorModel) => this.onLoadError(error))
    );
  }

  /**
   * Component destroy
   */
  ngOnDestroy() {

    // Update header site count
    this.headerService.setSiteCount(0);

    // Unsubscribe observables
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  /**
   * Reset the component state
   */
  reset(): void {

    // Reset results list
    this.results = [];

    // Reset sites list
    this.sites = [];

    // Reset number of images loaded
    this.imageLoadedCount = 0;

    // Reset crawler
    this.crawlerService.reset();
  }

  /**
   * Auto load more images if needed
   */
  autoload(): void {

    // No more crawled sites
    if (this.crawledSites.length === 0) {
      return;
    }

    // TODO: Find out how to get reference on window, without creating a dummy WindowService...

    const documentHeight = Math.max(
      window.document.documentElement.clientHeight,
      window.document.body.scrollHeight,
      window.document.documentElement.scrollHeight,
      window.document.body.offsetHeight,
      window.document.documentElement.offsetHeight
    );

    const scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
    const scrollable = documentHeight - window.innerHeight;

    // Scroll threshold reached
    if (scrollable - scrollTop < window.innerHeight * ImageSerpComponent.AUTOLOAD_THRESHOLD) {

      // Load more images
      this.crawlerService.load();
    }
  }

  /**
   * Update crawled sites list
   */
  updateCrawledSites(): void {

    this.crawledSites = this.crawlerService.getCrawledSites();

    // Update placeholders
    this.updatePlaceholders();
  }

  /**
   * Update placeholders
   */
  updatePlaceholders(): void {

    // No ite crawled
    if (this.crawledSites.length === 0) {

      // Empty placeholders
      this.placeholders = [];
      return;
    }

    // Get number of images per row
    const imagePerRowCount = this.getImagePerRowCount();

    // Update number of placeholders
    this.placeholders = new Array(imagePerRowCount - (this.imageLoadedCount % imagePerRowCount));
  }

  /**
   * Track image by src
   *
   * @param index
   * @param image
   */
  trackByIndex(index: number, image: ImageModel): number {

    return index;
  }

  /**
   * Returns the number of images to display per row for the current screen width
   */
  getImagePerRowCount(): number {

    let count = 0;
    let breakpoint;

    // Get list of breakpoints sorted by descending order
    const breakpoints = Object
      .keys(this.screenWidthImageCount)
      .map(k => parseInt(k, 10))
    ;

    // Until a count has been found or there are no more breakpoints
    while(count === 0 && breakpoints.length) {

      breakpoint = breakpoints.pop();

      // TODO: use window service to get native object
      if (window.innerWidth >= breakpoint) {

        count = this.screenWidthImageCount[breakpoint];
      }
    }

    return count;
  }

  /**
   * Changed route
   */
  onChangeRoute(): void {

    // Reset component state
    this.reset();

    // Get URL list from query params
    const urlQueryParam = (<BehaviorSubject<Params>>this.route.queryParams).value['url'];

    // Keep only valid URLs
    const urlList =
      (Array.isArray(urlQueryParam) ? urlQueryParam : [urlQueryParam])
      .filter((url) => url.match(/^https?:\/\/([a-z0-9\-]+\.)?[a-z0-9\-]+\.[a-z]+/gi))
    ;

    // Invalid URL list
    if (!urlList || urlList.length === 0) {

      // Navigate home
      this.router.navigate(['']);
    }

    // Add each URL as crawler source
    urlList.forEach((url: string) => {

      const site = new SiteModel(url);

      this.sites.push(site);
      this.crawledSites.push(site);
      this.crawlerService.addSite(site);
    });

    // Update header site count
    this.headerService.setSiteCount(urlList.length);

    // Update placeholders
    this.updatePlaceholders();

    // Auto load more images if needed (after DOM updated)
    setTimeout(() => this.autoload());
  }

  /**
   * Loaded site
   *
   * @param site
   */
  onLoadSite(site: SiteModel): void {

    // Check if more results to load
    this.updateCrawledSites();

    // Load from DB
    this
      .siteService
      .getSite(site.getId())
      .first()
      .subscribe(
        (siteDb: SiteModel) => {

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

  /**
   * Loaded an image
   *
   * @param image
   */
  onLoadImage(image: ImageModel): void {

    // Check if more results to load
    this.updateCrawledSites();

    const img = new Image();

    // On image load, add result
    img.onload = () => {

      // Increment number of images
      this.imageLoadedCount++;

      // Update placeholders
      this.updatePlaceholders();

      // Add result
      this.results.push({image: image});
    };

    // Load image async
    img.src = image.getSrc();

    // Load more images
    this.autoload();
  }

  /**
   * Loaded an error
   *
   * @param error
   */
  onLoadError(error: ErrorModel): void {

    // Check if more results to load
    this.updateCrawledSites();

    // Add result
    this.results.push({error: error});
  }

  /**
   * Clicked an image
   *
   * @param image
   */
  onClickImage(image: ImageModel): void {

    const site = image.getSite();

    // Site already liked
    if (this.siteIdLiked.indexOf(site.getId()) > -1) {
      return;
    }

    // Consider site liked within this SERP
    this.siteIdLiked.push(site.getId());

    // Load from DB
    this
    .siteService
    .getSite(site.getId())
    .first()
    .subscribe((siteDb: SiteModel) => {

      // Increment like count
      siteDb.likeCount++;

      // Update site
      this.siteService.updateSite(siteDb);
    })
    ;
  }

  /**
   * Scrolled window
   *
   * @param event
   */
  @HostListener('window:scroll') onScrollWindow(event: Event) {

    this.autoload();
  }

  /**
   * Resized window
   *
   * @param event
   */
  @HostListener('window:resize') onResizeWindow(event: Event) {

    // Update placeholders
    this.updatePlaceholders();

    this.autoload();
  }

}
