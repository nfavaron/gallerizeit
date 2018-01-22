import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpDownloader } from '../shared/http/downloader';

@Injectable()
export class DownloaderService implements HttpDownloader {

  /**
   *
   * @param httpDownloader
   */
  constructor(private httpDownloader: HttpDownloader) {

  }

  /**
   * Returns an observable of string representing the HTML code located at @url
   *
   * @param url
   */
  getContent(url: string): Observable<string> {

    return this.httpDownloader.getContent(url);
  }
}
