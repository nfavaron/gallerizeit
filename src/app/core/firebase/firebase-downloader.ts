import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FirebaseConfig } from './firebase-config';
import { HttpDownloader } from '../http/http-downloader';

@Injectable()
export class FirebaseDownloader extends HttpDownloader {

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
  getContent(url: string): Promise<string> {

    return new Promise((resolve, reject) => {

      this
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
        .first()
        .subscribe((response: string) => {

          resolve(response);
        })
      ;
    });
  }
}
