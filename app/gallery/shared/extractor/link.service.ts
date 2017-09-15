import { Injectable } from '@angular/core';
import { GalleryLinkModel } from '../link.model';

Injectable()
export class GalleryExtractorLinkService {

  /**
   * Returns an array of links extracted from a HTML string
   *
   * @param html
   */
  extract(html: string): GalleryLinkModel[] {

    let links: GalleryLinkModel[] = [];

    // Remove line breaks
    html = html.replace(/\n|\r/gi, '');

    // Regular expression to identify a link
    const regExp = new RegExp(/(<([a]+)[^>]*href=["']?([^"'\s>]+)[^>]*>)(.*?)(<\/\2>)/gi);
    let match: string[]|null;

    while (match = regExp.exec(html)) {

      links.push(
        new GalleryLinkModel(match[3], match[0])
      );
    }

    return links;
  }
}
