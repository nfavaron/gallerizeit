import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FirebaseConfig } from './firebase-config';
import { HttpDownloader } from '../http/http-downloader';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class FirebaseDownloader extends HttpDownloader {

  /**
   * Firebase function endpoint
   */
  private endpoint = '/getSource';

  /**
   *
   * @param httpClient
   * @param config
   */
  constructor(private httpClient: HttpClient, private config: FirebaseConfig) {
    super();
  }

  /**
   * @inheritDoc
   */
  getContent(url: string): Observable<string> {

    return this
      .httpClient
      .request(
        'GET',
        this.config.functionsURL + this.endpoint,
        {
          responseType: 'text',
          params: {
            url: url
          }
        }
      )
    ;
  }
}
