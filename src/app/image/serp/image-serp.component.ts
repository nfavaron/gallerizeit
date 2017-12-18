import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ImageModel } from '../shared/image.model';
import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ImageService } from '../shared/image.service';
import { SiteService } from '../../core/site/site.service';
import { SiteModel } from '../../core/site/site.model';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

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
   * List of images
   */
  images: ImageModel[] = [];

  /**
   * Number of sites loaded
   */
  siteCount: number = 0;

  /**
   * Site IDs that have been liked on this SERP
   */
  private siteIdLiked: string[] = [];

  /**
   * Observable subscriptions
   */
  private subscriptions: Subscription[] = [];

  /**
   *
   * @param router
   * @param route
   * @param imageService
   * @param siteService
   */
  constructor(private router: Router,
              private route: ActivatedRoute,
              private imageService: ImageService,
              private siteService: SiteService) {

  }

  /**
   * Component init
   */
  ngOnInit() {

    this.subscriptions.push(
      this.route.queryParams.subscribe(params => this.onChangeRoute())
    );

    this.subscriptions.push(
      this.imageService.image$.subscribe((image: ImageModel) => this.onLoadImage(image))
    );

    this.subscriptions.push(
      this.imageService.site$.subscribe((site: SiteModel) => this.onLoadSite(site))
    );
  }

  /**
   * Component destroy
   */
  ngOnDestroy() {

    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  /**
   * Auto load more images if needed
   */
  autoload(): void {

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
      this.imageService.loadImages();
    }
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
   * Changed route
   */
  onChangeRoute(): void {

    // Reset images list & service
    this.images = [];
    this.imageService.reset();

    // Get URL list from query params
    const urlQueryParam = (<BehaviorSubject<Params>>this.route.queryParams).value['url'];
    let urlList: string[];

    // Make sure URL list is an array
    urlList = Array.isArray(urlQueryParam) ? urlQueryParam : [urlQueryParam];

    // Keep only valid URLs
    urlList = urlList.filter((url) => url.match(/^https?:\/\/([a-z0-9\-]+\.)?[a-z0-9\-]+\.[a-z]+/gi));

    // Invalid URL list
    if (!urlList || urlList.length === 0) {

      // Navigate home
      this.router.navigate(['']);
    }

    // Add each URL as image source
    urlList.forEach((url: string) => this.imageService.addSite(new SiteModel(url)));

    // Auto load more images if needed (after DOM updated)
    setTimeout(() => this.autoload());
  }

  /**
   * Loaded site
   *
   * @param site
   */
  onLoadSite(site: SiteModel): void {

    // Increment site count
    this.siteCount++;

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

    const img = new Image();

    img.onload = () => this.images.push(image);

    img.src = image.getSrc();

    // Load more images
    this.autoload();
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

    this.autoload();
  }

}
