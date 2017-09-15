import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class CorePageService {

  header$: Observable<Object>;
  private header: Subject<Object>;

  constructor() {

    this.header = new Subject<Object>();
    this.header$ = this.header.asObservable();
  }

  /**
   * Set the header's content
   *
   * @param title
   * @param route
   */
  setHeader(title: string, route: Array<any> = ['home']) {

    this.header.next({
      title: title,
      route: route
    });
  }
}
