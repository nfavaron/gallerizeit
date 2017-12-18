import { Injectable } from '@angular/core';
import { HttpDownloader } from './http-downloader';

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
  getContent(url: string): Promise<string> {

    return this.httpDownloader.getContent(url);
  }
}
