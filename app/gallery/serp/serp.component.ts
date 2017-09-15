import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { GalleryImageModel } from '../shared/image.model';
import { GalleryImageService } from '../shared/image.service';
import { SourceModel } from '../shared/source.model';

@Component({
  moduleId: module.id,
  selector: 'app-wallpaper-serp',
  styleUrls: ['./serp.component.css'],
  templateUrl: './serp.component.html'
})
export class GallerySerpComponent implements OnInit, OnDestroy {

  private subscriptions: Subscription[] = [];
  images: GalleryImageModel[] = [];

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
   * Changed route params
   *
   * @param params
   */
  onChangeRouteParams(params: Object): void {

    if (params['gallery_key'] === 'demo') {

      // Add sources
      this.galleryImageService.addSource(new SourceModel('http://konachan.net/post'));
      this.galleryImageService.addSource(new SourceModel('https://www.desktopnexus.com/all'));

      // Load images
      this.galleryImageService.loadImages(); // TODO: replace by infinite scrolling + placeholders
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
  }
}
