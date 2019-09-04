import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { FirebaseConfig } from './config';
import { HttpDownloader } from '../http/downloader';
import { Injectable } from '@angular/core';

@Injectable()
export class FirebaseDownloader implements HttpDownloader {

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
