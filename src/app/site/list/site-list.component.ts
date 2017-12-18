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

  @Input() title: string;
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
   * @param siteService
   */
  constructor(private siteService: SiteService) {

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
  trackById(index: number, site: SiteModel): string {

    return site.getId();
  }

  /**
   * Load more sites
   */
  loadSites(): Observable<SiteModel[]> {

    // Increment load count
    this.loadCount++;

    // Generate placeholders
    this.placeholders = new Array(this.limit);

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
