import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { SiteModel } from '../../core/site/site.model';
import { Subscription } from 'rxjs/Subscription';
import { SiteService } from '../../core/site/site.service';
import { HostListener } from '@angular/core';

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
   * Window object // TODO: use window service to get native window object
   */
  private window: Window = window;

  /**
   * Number of times the site list has been loaded
   */
  private loadCount: number = 0;

  /**
   * Are the images lazy loading ?
   */
  private isLazyLoadingImages: boolean = false;

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

    // Unsubscribe from observables
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
   * Lazy load images
   */
  lazyLoadImages() {

    // Already lazy loading
    if (this.isLazyLoadingImages) {

      return;
    }

    // Prevent spam
    this.isLazyLoadingImages = true;

    // Find all elements with [data-bg] attribute
    [].forEach.call(this.window.document.querySelectorAll('[data-bg]'), (element: HTMLElement) => {

      const position = element.getBoundingClientRect();
      const distance = this.window.innerHeight * 0.1;

      // Not in viewport
      if (position.bottom < -distance || position.top > this.window.innerHeight + distance) {
        return;
      }

      // Replace data-bg by style background-image
      element.style.backgroundImage = 'url(' + element.dataset.bg + ')';
      element.removeAttribute('data-bg');
    });

    // Unlock lazy loading delayed
    setTimeout(() => this.isLazyLoadingImages = false, 500);
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

    // Lazy load images (next cycle)
    setTimeout(() => this.lazyLoadImages());
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

  /**
   * Scrolled window
   *
   * @param event
   */
  @HostListener('window:scroll') onScrollWindow(event: Event) {

    requestAnimationFrame(() => this.lazyLoadImages());
  }
}
