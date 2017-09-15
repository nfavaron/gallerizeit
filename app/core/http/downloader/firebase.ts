import { CoreHttpDownloaderInterface } from '../downloader.interface';
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { RequestOptionsArgs } from '@angular/http';
import { FirebaseServiceConfig } from '../../../firebase.service.config';

@Injectable()
export class CoreHttpDownloaderFirebase implements CoreHttpDownloaderInterface {

  private endpoint: string = '/getSource';

  /**
   *
   * @param http
   * @param config
   */
  constructor(private http: Http, private config: FirebaseServiceConfig) {

  }

  /**
   * @inheritDoc
   */
  getContent(url: string): Promise<string> {

    return new Promise((resolve, reject) => {

      const options: RequestOptionsArgs = {
        params: {
          url: url
        }
      };

      this
        .http
        .get(this.config.functionsURL + this.endpoint, options)
        .toPromise()
        .then((response: Response) => {

          resolve(response.text());
        })
      ;
    });
  }
}
