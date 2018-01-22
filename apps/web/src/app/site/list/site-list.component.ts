import { Component, Input } from '@angular/core';
import { SiteListComponent as CommonSiteListComponent, SiteService } from '@gallerizeit/common';

@Component({
  selector: 'app-site-list',
  templateUrl: './site-list.component.html',
  styleUrls: ['./site-list.component.css']
})
export class SiteListComponent extends CommonSiteListComponent {

  @Input() heading: string;

  /**
   *
   * @param siteService
   */
  constructor(siteService: SiteService) {

    super(siteService);
  }
}
