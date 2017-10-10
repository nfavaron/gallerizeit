import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { GallerySiteModel } from '../../gallery/shared/site.model';
import { Subscription } from 'rxjs';
import { GallerySiteService } from '../../gallery/shared/site.service';

@Component({
  moduleId: module.id,
  selector: 'app-home',
  styleUrls: ['./home.component.css'],
  templateUrl: './home.component.html'
})
export class CoreHomeComponent implements OnInit, OnDestroy {

  /**
   * Observables of site models
   */
  siteMostPopular$: Observable<GallerySiteModel[]>;
  siteMostRecent$: Observable<GallerySiteModel[]>;

  /**
   * Which URL to load as a demo
   */
  demoUrl: string[] = [
    'https://wallpaperscraft.com/catalog/animals',
    'https://www.hdcarwallpapers.com',
    'https://konachan.net/post',
  ];

  /**
   * Observable subscriptions
   */
  private subscriptions: Subscription[] = [];

  /**
   *
   * @param gallerySiteService
   */
  constructor(private gallerySiteService: GallerySiteService) {

  }

  /**
   * Component init
   */
  ngOnInit() {

    // Subscribe to most popular sites list
    this.siteMostPopular$ = this.gallerySiteService.listSiteByMostPopular(8);
    this.subscriptions.push(
      this.siteMostPopular$.subscribe()
    );

    // Subscribe to most recent sites list
    this.siteMostRecent$ = this.gallerySiteService.listSiteByMostRecent(8);
    this.subscriptions.push(
      this.siteMostRecent$.subscribe()
    );
  }

  /**
   * Component destroy
   */
  ngOnDestroy() {

    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  /**
   * Track image by ID
   *
   * @param index
   * @param site
   */
  trackById(index: number, site: GallerySiteModel): string {

    return site.getId();
  }
}
