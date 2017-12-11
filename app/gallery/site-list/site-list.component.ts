import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { GallerySiteModel } from '../shared/site.model';
import { Input } from '@angular/core';
import { SiteSortType } from '../shared/types';
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
  @Input() sort: SiteSortType;
  @Input() limit: number;

  /**
   * Observables of site models
   */
  site$: Observable<GallerySiteModel[]>;

  /**
   * Is the component loading more sites ?
   */
  isLoading: boolean = false;

  /**
   * Total number of sites
   */
  total: number = 0;

  /**
   * List of placeholders to display while loading
   */
  placeholders: number[] = [];

  /**
   * Number of times the site list has been loaded
   */
  private loadCount: number = 0;

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

    // Load sites
    this.subscriptions.push(
      this.loadSites().subscribe(sites => this.onLoadSites(sites))
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
   * Load more sites
   */
  loadSites(): Observable<GallerySiteModel[]> {

    // Increment load count
    this.loadCount++;

    // Generate placeholders
    this.placeholders = new Array(this.limit);

    if (this.sort === 'popularity') {

      this.site$ = this.gallerySiteService.listSiteByPopularity(this.limit * this.loadCount);
    }

    if (this.sort === 'update') {


      this.site$ = this.gallerySiteService.listSiteByUpdate(this.limit * this.loadCount);
    }

    // Load sites
    return this.site$;
  }

  /**
   * Listed sites
   *
   * @param sites
   */
  onLoadSites(sites: GallerySiteModel[]): void {

    setTimeout(() => {
        // Empty placeholders
        this.placeholders = [];
    }, 2000);

    // Update count
    this.total = sites.length;

    // Set component not loading
    this.isLoading = false;
  }

  /**
   * Clicked the load more button
   */
  onClickLoadMore(): void {

    if (this.isLoading === false) {

      // Set component loading
      this.isLoading = true;

      // Load more sites
      this.loadSites();
    }
  }
}
