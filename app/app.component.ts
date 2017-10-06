import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AppService } from './app.service';

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  hasUpdate: boolean = false;
  isInstalling: boolean = false;

  constructor(
    private router: Router,
    private appService: AppService
  ) {

  }

  ngOnInit() {

    // Router
    this.router.events.subscribe(e => this.onRouterEvent(e));

    // Check for app update
    this.appService.update().subscribe(hasUpdate => this.hasUpdate = hasUpdate);
  }

  onRouterEvent(e: any) {

    if (e instanceof NavigationEnd) {

      // TODO: use DomAdapter (if still exists)
      window.scrollTo(0, 0);
    }
  }

  onClickAcceptUpdate() {

    this.isInstalling = true;

    // Delay the install so that the update screen can be rendered
    setTimeout(() => this.appService.install(), 1500);
  }

  onClickRefuseUpdate() {

    this.hasUpdate = false;
  }
}
