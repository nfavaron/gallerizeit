import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NavigationEnd, Event } from '@angular/router';
import { SettingsService } from './core/settings/settings.service';
import { SettingsStateEnum } from './core/settings/settings-state.enum';
import { ActivatedRoute } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  /**
   * Does the app have an update available ?
   */
  hasUpdate: boolean = false;

  /**
   * Is the app currently updating ?
   */
  isUpdating: boolean = false;

  /**
   * Can the app scroll ?
   */
  canScroll: boolean = true;

  /**
   * App scroll Y value
   */
  scrollY: number = 0;

  /**
   * Window object // TODO: use window service to get native window object
   */
  private window: Window = window;

  /**
   *
   * @param router
   * @param route
   * @param settingsService
   * @param swUpdate
   */
  constructor(private router: Router,
              private route: ActivatedRoute,
              private settingsService: SettingsService,
              private swUpdate: SwUpdate) {

  }

  /**
   * Initialized component
   */
  ngOnInit() {

    // Route query params
    this.route.queryParams.subscribe(params => this.onChangeQueryParams());

    // Router events
    this.router.events.subscribe(e => this.onEventRouter(e));

    // Set settings state
    this.settingsService.setState$.subscribe(state => this.onSetStateSettings(state));

    // Service worker update available
    this.swUpdate.available.subscribe(evt => this.onUpdateAvailable());
  }

  /**
   * Changed query params
   */
  onChangeQueryParams() {

    this.window.scrollTo(0, 0);
  }

  /**
   * Router emitted an event
   *
   * @param e
   */
  onEventRouter(e: Event) {

    if (e instanceof NavigationEnd) {

      this.window.scrollTo(0, 0);
    }
  }

  /**
   * Set settings state
   *
   * @param state
   */
  onSetStateSettings(state: SettingsStateEnum) {

    // Opened settings
    if (state === SettingsStateEnum.open) {

      // Can't scroll anymore
      this.canScroll = false;

      // Keep window scroll Y
      this.scrollY = this.window.scrollY;

      return;
    }

    // Closed settings
    if (state === SettingsStateEnum.close) {

      // Can scroll again
      this.canScroll = true;

      // Restore window scroll Y on next cycle
      setTimeout(() => this.window.scrollTo(0, this.scrollY));

      return;
    }
  }

  /**
   * Service worker update available
   */
  onUpdateAvailable() {

    this.hasUpdate = true;
  }

  /**
   * Clicked on the accept update button
   */
  onClickUpdateAccept() {

    this.isUpdating = true;

    // Delay the install so that the update screen can be rendered
    setTimeout(() => this.window.location.reload(), 2000);
  }

  /**
   * Clicked on the refuse update button
   */
  onClickUpdateRefuse() {

    this.hasUpdate = false;
  }
}
