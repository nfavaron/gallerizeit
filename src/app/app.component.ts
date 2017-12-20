import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  /**
   *
   * @param router
   */
  constructor(private router: Router) {

  }

  /**
   * Initialized component
   */
  ngOnInit() {

    // Router events
    this.router.events.subscribe(e => this.onRouterEvent(e));
  }

  /**
   * Router emitted an event
   *
   * @param e
   */
  onRouterEvent(e: any) {

    if (e instanceof NavigationEnd) {

      // TODO: use window service to get native window object
      window.scrollTo(0, 0);
    }
  }

}
