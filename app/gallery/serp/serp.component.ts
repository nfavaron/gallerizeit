import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { GalleryImageModel } from '../shared/image.model';
import { GalleryImageService } from '../shared/image.service';
import { GallerySiteModel } from '../shared/site.model';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { Params } from '@angular/router';
import { GallerySiteService } from '../shared/site.service';

@Component({
  moduleId: module.id,
  selector: 'app-gallery-serp',
  styleUrls: ['./serp.component.css'],
  templateUrl: './serp.component.html',
  host: {
    '(window:scroll)': 'onScrollWindow($event)',
    '(window:resize)': 'onResizeWindow($event)'
  }
})
export class GallerySerpComponent implements OnInit, OnDestroy {

  /**
   * Number of "screen height" remaining to scroll before triggering an autoload
   */
  static AUTOLOAD_THRESHOLD: number = 2;

  /**
   * List of loaded images
   */
  images: GalleryImageModel[] = [];

  /**
   * Observable subscriptions
   */
  private subscriptions: Subscription[] = [];

  /**
   * Site IDs that have been liked on this SERP
   */
  private likeSiteId: string[] = [];

  /**
   *
   * @param router
   * @param route
   * @param galleryImageService
   * @param gallerySiteService
   */
  constructor(private router: Router,
              private route: ActivatedRoute,
              private galleryImageService: GalleryImageService,
              private gallerySiteService: GallerySiteService) {

  }

  /**
   * Component init
   */
  ngOnInit() {

    this.subscriptions.push(
      this.route.params.subscribe(params => this.onChangeRoute())
    );

    this.subscriptions.push(
      this.route.queryParams.subscribe(params => this.onChangeRoute())
    );

    this.subscriptions.push(
      this.galleryImageService.image$.subscribe((image: GalleryImageModel) => this.onLoadImage(image))
    );
  }

  /**
   * Component destroy
   */
  ngOnDestroy() {

    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  /**
   * Track image by src
   *
   * @param index
   * @param image
   */
  trackByIndex(index: number, image: GalleryImageModel): number {

    return index;
  }

  /**
   * Auto load more images if needed
   */
  autoload(): void {

    // TODO: Find out how to get reference on window, without creating a dummy WindowService...

    let documentHeight = Math.max(
      window.document.documentElement.clientHeight,
      window.document.body.scrollHeight,
      window.document.documentElement.scrollHeight,
      window.document.body.offsetHeight,
      window.document.documentElement.offsetHeight
    );

    let scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
    let scrollable = documentHeight - window.innerHeight;

    // Scroll threshold reached
    if (scrollable - scrollTop < window.innerHeight * GallerySerpComponent.AUTOLOAD_THRESHOLD) {

      // Load more images
      this.galleryImageService.loadImages();
    }
  }

  /**
   * Changed route
   */
  onChangeRoute(): void {

    // Reset images list & service
    this.images = [];
    this.galleryImageService.reset();

    // Get URL list from query params
    const urlQueryParam = (<BehaviorSubject<Params>>this.route.queryParams).value['url'];
    let urlList: string[];

    // Make sure URL list is an array
    urlList = Array.isArray(urlQueryParam) ? urlQueryParam : [urlQueryParam];

    // Keep only valid URLs
    urlList = urlList.filter((url) => url.match(/^https?:\/\/([a-z0-9\-]+\.)?[a-z0-9\-]+\.[a-z]+/gi));

    // Invalid URL list
    if (!urlList || urlList.length === 0) {

      this.router.navigate(['/home']);
    }

    // Add each URL as image source
    urlList.forEach((url: string) => this.galleryImageService.addSite(new GallerySiteModel(url)));

    // Auto load more images if needed (after DOM updated)
    setTimeout(() => this.autoload());
  }

  /**
   * Loaded an image
   *
   * @param image
   */
  onLoadImage(image: GalleryImageModel): void {

    const img = new Image();

    img.onload = () => this.images.push(image);

    img.src = image.getSrc();

    // Load more images
    this.autoload();
  }

  /**
   * Clicked an image
   */
  onClickImage(image: GalleryImageModel): void {

    const site = image.getSite();

    // Site already liked
    if (this.likeSiteId.indexOf(site.getId()) > -1) {
      return;
    }

    // Consider site liked within this SERP
    this.likeSiteId.push(site.getId());

    // Load from DB // TODO: improve into "subscribe once"
    const subscription = this
      .gallerySiteService
      .getSite(site.getId())
      .subscribe((siteDb: GallerySiteModel) => {

        // Unsubscribe from getSite() observable
        subscription.unsubscribe();

        // Increment like count
        siteDb.likeCount++;

        // Update site
        this.gallerySiteService.updateSite(siteDb);
      })
    ;
  }

  /**
   * Scrolled window
   *
   * @param event
   */
  onScrollWindow(event: Event) {

    this.autoload();
  }

  /**
   * Resized window
   *
   * @param event
   */
  onResizeWindow(event: Event) {

    this.autoload();
  }
}
