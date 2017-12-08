import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { GallerySiteModel } from '../shared/site.model';
import { Input } from '@angular/core';
import { SiteListByType } from '../shared/types';
import { GallerySiteService } from '../shared/site.service';
import { Observable } from 'rxjs';

@Component({
  moduleId: module.id,
  selector: 'app-gallery-site-list',
  styleUrls: ['./site-list.component.css'],
  templateUrl: './site-list.component.html'
})
export class GallerySiteListComponent implements OnInit, OnDestroy {

  @Input() title: string;
  @Input() sort: SiteListByType;
  @Input() limit: number;

  /**
   * Observables of site models
   */
  site$: Observable<GallerySiteModel[]>;

  /**
   * Is the list loading more sites ?
   *
   * @type {boolean}
   */
  isLoading: boolean = false;

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

    // Subscribe to sites list
    this.site$ = this.gallerySiteService.listSiteByMost(this.sort, this.limit);
    this.subscriptions.push(
      this.site$.subscribe()
    );
  }

  /**
   * Component destroy
   */
  ngOnDestroy() {

    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  /**
   * Track site by ID
   *
   * @param index
   * @param site
   */
  trackById(index: number, site: GallerySiteModel): string {

    return site.getId();
  }

  /**
   * Clicked the load more button
   */
  onClickLoadMore(): void {

    console.log('onClickLoadMore');
  }
}
