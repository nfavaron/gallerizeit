import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { GalleryImageModel } from '../shared/image.model';
import { GalleryImageService } from '../shared/image.service';
import { SourceModel } from '../shared/source.model';

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

  static INFINITE_SCROLL_THRESHOLD = 0.3; // 33% of the screen remaining

  images: GalleryImageModel[] = [];

  private subscriptions: Subscription[] = [];

  /**
   *
   * @param route
   * @param galleryImageService
   */
  constructor(private route: ActivatedRoute,
              private galleryImageService: GalleryImageService) {

  }

  /**
   * Component init
   */
  ngOnInit() {

    this.subscriptions.push(
      this.route.params.subscribe(params => this.onChangeRouteParams(params))
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
    if (scrollable - scrollTop < window.innerHeight * GallerySerpComponent.INFINITE_SCROLL_THRESHOLD) {

      // Load more images
      this.galleryImageService.loadImages();

    }
  }

  /**
   * Changed route params
   *
   * @param params
   */
  onChangeRouteParams(params: Object): void {

    if (params['gallery_key'] === 'demo') {

      // Add sources
      this.galleryImageService.addSource(new SourceModel('https://konachan.net/post'));
      this.galleryImageService.addSource(new SourceModel('https://anime.desktopnexus.com/all/'));

      // Auto load more images if needed
      this.autoload();
    }
  }

  /**
   * Loaded image
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
