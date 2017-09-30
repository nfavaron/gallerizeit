import { Injectable } from '@angular/core';
import { SourceModel } from '../source.model';

@Injectable()
export class GalleryExtractorUrlService {

  /**
   * Make a URL absolute using the @source
   *
   * @param source
   * @param url
   */
  extract(source: SourceModel, url: string): string {

    const httpUrl = source.getHttpUrl();

    // Missing protocol
    if (url.indexOf('//') === 0) {

      url = httpUrl.getProtocol() + ':' + url;

      // Missing protocol & domain but is absolute link
    } else if (url.indexOf('/') === 0) {

      url = httpUrl.getOrigin() + url;

      // Missing protocol & domain but is relative link
    } else if (!url.match(/^https?:\/\//gi)) {

      url = httpUrl.getOrigin() + '/' + url;

    }
    return url;
  }
}