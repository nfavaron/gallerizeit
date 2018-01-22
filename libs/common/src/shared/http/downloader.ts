import { Observable } from 'rxjs/Observable';

export abstract class HttpDownloader {

  /**
   * Returns an observable of string representing the HTML code located at @url
   *
   * @param url
   */
  abstract getContent(url: string): Observable<string>;
}
