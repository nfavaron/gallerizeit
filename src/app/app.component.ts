import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NavigationEnd, Event } from '@angular/router';
import { SettingsService } from './core/settings/settings.service';
import { SettingsStateEnum } from './core/settings/settings-state.enum';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  /**
   * Prevent main container from scrolling
   */
  noScroll: boolean = false;

  /**
   *
   * @param router
   * @param settingsService
   */
  constructor(private router: Router,
              private settingsService: SettingsService) {

  }

  /**
   * Initialized component
   */
  ngOnInit() {

    // Router events
    this.router.events.subscribe(e => this.onEventRouter(e));

    // Set settings state
    this.settingsService.setState$.subscribe(state => this.onSetStateSettings(state));
  }

  /**
   * Router emitted an event
   *
   * @param e
   */
  onEventRouter(e: Event) {

    if (e instanceof NavigationEnd) {

      // TODO: use window service to get native window object
      window.scrollTo(0, 0);
    }
  }

  /**
   * Set settings state
   *
   * @param state
   */
  onSetStateSettings(state: SettingsStateEnum) {

    if (state === SettingsStateEnum.open) {

      this.noScroll = true;
      return;
    }

    this.noScroll = false;
  }
}
