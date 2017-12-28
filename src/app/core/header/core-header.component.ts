import { Component, OnInit } from '@angular/core';
import { HeaderService } from './header.service';

@Component({
  selector: 'app-core-header',
  templateUrl: './core-header.component.html',
  styleUrls: ['./core-header.component.css']
})
export class CoreHeaderComponent implements OnInit {

  /**
   * Number of sites in settings
   */
  siteCount: number = 0;

  /**
   *
   * @param headerService
   */
  constructor(private headerService: HeaderService) {

  }

  ngOnInit() {

    this.headerService.siteCount$.subscribe(count => this.onUpdateSiteCount(count));

  }

  /**
   * Clicked the settings button
   */
  onClickSettings(): void {

    this.headerService.openSiteSettings();
  }

  /**
   * Update site count
   */
  onUpdateSiteCount(count: number): void {

    this.siteCount = count;
  }
}
