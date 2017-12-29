import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { SiteModel } from '../../core/site/site.model';
import { Subscription } from 'rxjs/Subscription';
import { SiteService } from '../../core/site/site.service';

@Component({
  selector: 'app-site-list',
  templateUrl: './site-list.component.html',
  styleUrls: ['./site-list.component.css']
})
export class SiteListComponent implements OnInit, OnDestroy {

  @Input() heading: string;
  @Input() sort: 'popularity' | 'update';
  @Input() limit: number;

  /**
   * Observables of site models
   */
  site$: Observable<SiteModel[]>;

  /**
   * Is the component loading more sites ?
   */
  isLoading: boolean = false;

  /**
   * Has more sites to load
   */
  hasMore: boolean = true;

  /**
   * Total number of sites
   */
  total: number = 0;

  /**
   * List of placeholders to display while loading the first time
   */
  placeholders: number[] = [];

  /**
   * List of cover URL images loaded
   */
  coverUrlLoaded: string[] = [];

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
   * @param siteService
   */
  constructor(private siteService: SiteService) {

  }

  /**
   * Initialized component
   */
  ngOnInit() {

    // Generate placeholders
    this.placeholders = new Array(this.limit);

    // Load sites
    this.subscriptions.push(
      this.loadSites().subscribe(sites => this.onLoadSites(sites))
    );
  }

  /**
   * Destroyed component
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
  trackById(index: number, site: SiteModel): string {

    return site.getId();
  }

  /**
   * Load more sites
   */
  loadSites(): Observable<SiteModel[]> {

    // Increment load count
    this.loadCount++;

    if (this.sort === 'popularity') {

      this.site$ = this.siteService.listSiteByPopularity(this.limit * this.loadCount);
    }

    if (this.sort === 'update') {


      this.site$ = this.siteService.listSiteByUpdate(this.limit * this.loadCount);
    }

    // Load sites
    return this.site$;
  }

  /**
   * Listed sites
   *
   * @param sites
   */
  onLoadSites(sites: SiteModel[]): void {

    // Empty placeholders
    this.placeholders = [];

    // Has more sites to load
    this.hasMore = this.total !== sites.length;

    // Set component not loading
    this.isLoading = false;

    // Update count
    this.total = sites.length;

    // Load cover URL
    sites
      .filter(site => this.coverUrlLoaded.indexOf(site.coverUrl) === -1)
      .forEach(site => {

        const img = new Image();

        // Async image loading
        img.onload = () => this.coverUrlLoaded.push(site.coverUrl);
        img.src = site.coverUrl;
      })
    ;
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
