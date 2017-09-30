import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { CorePageService } from '../page.service';

@Component({
  moduleId: module.id,
  selector: 'app-home',
  styleUrls: ['./home.component.css'],
  templateUrl: './home.component.html'
})

export class CoreHomeComponent implements OnInit, OnDestroy {

  private subscriptions: Subscription[] = [];

  constructor(
    private pageService: CorePageService
  ) {

  }

  ngOnInit() {

    this.pageService.setHeader('GallerizeIt!');
  }

  ngOnDestroy() {

    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
