import { Injectable } from '@angular/core';
import { HttpDownloader } from './http-downloader';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class HttpDownloaderService {

  /**
   *
   * @param httpDownloader
   */
  constructor(private httpDownloader: HttpDownloader) {

  }

  /**
   * @inheritDoc
   */
  getContent(url: string): Observable<string> {

    return this.httpDownloader.getContent(url);
  }
}
