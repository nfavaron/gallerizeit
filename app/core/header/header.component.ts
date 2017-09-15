import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

import { CorePageService } from '../page.service';

@Component({
  moduleId: module.id,
  selector: 'app-header',
  styleUrls: ['./header.component.css'],
  templateUrl: './header.component.html'
})

export class CoreHeaderComponent {

  @Input() title: string = '';
  @Input() route: Array<any> = [''];

  hasLogoIcon: boolean = true;

  constructor(private pageService: CorePageService,
              private router: Router
  ) {

  }

  ngOnInit() {

    // Page header
    this.pageService.header$.subscribe(header => {
      this.title = header['title'];
      this.route = header['route'];
      this.hasLogoIcon = ['/', '/gallerys'].indexOf(this.router.url) > -1;
    });
  }
}
