import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'app-home',
  styleUrls: ['./home.component.css'],
  templateUrl: './home.component.html'
})

export class CoreHomeComponent{

  /**
   * Which URL to load as a demo
   */
  demoUrl: string[] = [
    'https://konachan.net/post',
    'https://anime.desktopnexus.com/all/'
  ];
}
