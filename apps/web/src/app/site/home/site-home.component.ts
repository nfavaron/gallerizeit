import { Component } from '@angular/core';
import { Common } from '@gallerizeit/common';

@Component({
  selector: 'app-site-home',
  templateUrl: './site-home.component.html',
  styleUrls: ['./site-home.component.css']
})
export class SiteHomeComponent {

  constructor() {

    Common.test();
  }

  /**
   * URLs to load as a demo
   */
  demoUrl: string[] = [
    'https://wallpaperscraft.com/catalog/animals',
    'https://www.hdcarwallpapers.com',
    'https://konachan.net/post',
  ];
}
