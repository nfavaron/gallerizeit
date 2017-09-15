import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { AppServiceConfig } from './app.service.config';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

@Injectable()
export class AppService {

  /**
   * App URL
   */
  private url: string = '';

  /**
   * App version currently loaded
   */
  private version: string = '';

  constructor(
    private http: Http,
    private db: AngularFireDatabase,
    config: AppServiceConfig
  ) {

    this.url = config.url;
    this.version = config.version;
  }

  /**
   * Does the app have an update available ?
   *
   * @returns {Observable<boolean>}
   */
  update(): Observable<boolean> {

    return this
      .db
      .object('/app/version')
      .map(version => {

        if (version.$value > this.version) {

          this.version = version.$value;

          return true;
        } else {

          return false;
        }
      })
    ;
  }

  /**
   * Install the app (request service worker install process)
   */
  install() {

    // If browser supports service workers
    if ('serviceWorker' in navigator) {

      // The service worker will catch the request and flush its cache
      this.http
        .get(this.url + '/install')
        .subscribe(() => this.reload(), () => this.reload())
      ;
    }
  }

  /**
   * Reloads the page
   */
  private reload() {

    // TODO: get rid of global
    window.location.reload(true);
  }
}
