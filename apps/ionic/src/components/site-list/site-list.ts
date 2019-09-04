import { Component } from '@angular/core';
import { SiteListComponent as CommonSiteListComponent, SiteService } from '@gallerizeit/common';

@Component({
  selector: 'app-site-list',
  templateUrl: 'site-list.html'
})
export class SiteListComponent extends CommonSiteListComponent {

  /**
   *
   * @param siteService
   */
  constructor(siteService: SiteService) {

    super(siteService);
  }
}
