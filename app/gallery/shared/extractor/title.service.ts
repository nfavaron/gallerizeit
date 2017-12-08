import { Injectable } from '@angular/core';
import { GallerySiteModel } from '../site.model';
import { CoreUtilRegExp } from '../../../core/util/reg-exp';

@Injectable()
export class GalleryExtractorTitleService {

  /**
   * Returns the extracted site title
   *
   * @param source
   * @param html
   */
  extract(source: GallerySiteModel, html: string): string {

    // Default title
    let title = source.getHttpUrl().getHost();

    // Remove line breaks
    html = html.replace(/\n|\r/gi, '');

    // Regular expression to identify the title
    const regExp = new RegExp(/<title[^>]*>(.*?)<\/title>/gi);
    let match: string[]|null = regExp.exec(html);

    if (!match || !match[1]) {

      return '';
    }

    // Keep extracted title
    title = match[1];

    // Remove host
    const hostRegExp = new RegExp(CoreUtilRegExp.escape(source.getHttpUrl().getHost(), '/'), 'gi');
    title = title.replace(hostRegExp, '');

    // Remove origin
    const originRegExp = new RegExp(CoreUtilRegExp.escape(source.getHttpUrl().getOrigin(), '/'), 'gi');
    title = title.replace(originRegExp, '');

    // Remove domain name
    const host = source.getHttpUrl().getHost().split('.');
    const domain = host[host.length-2] + '.' + host[host.length-1];
    const domainRegExp = new RegExp(CoreUtilRegExp.escape(domain, '/'), 'gi');
    title = title.replace(domainRegExp, '');

    // Convert &amp;
    title = title.replace('&amp;', '&');

    // Trim of any unusual starting/ending characters
    title = title.replace(/^[^a-z0-9]+/i, '');
    title = title.replace(/[^a-z0-9%)\]>!?'"]+$/i, '');

    // No title left ?
    if (!title) {

      title = source.getHttpUrl().getHost();
    }

    return title;
  }
}
