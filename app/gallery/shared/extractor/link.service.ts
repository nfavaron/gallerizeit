import { Injectable } from '@angular/core';
import { GalleryLinkModel } from '../link.model';
import { GallerySiteModel } from '../site.model';
import { GalleryExtractorUrlService } from './url.service';

@Injectable()
export class GalleryExtractorLinkService {

  /**
   *
   * @param galleryExtractorUrlService
   */
  constructor(private galleryExtractorUrlService: GalleryExtractorUrlService) {

  }

  /**
   * Returns an array of links extracted from a HTML string
   *
   * @param source
   * @param html
   */
  extract(source: GallerySiteModel, html: string): GalleryLinkModel[] {

    let links: GalleryLinkModel[] = [];

    // Remove line breaks
    html = html.replace(/\n|\r/gi, '');

    // Regular expression to identify a link
    const regExp = new RegExp(/(<([a]+)[^>]*href=["']?([^"'\s>]+)[^>]*>)(.*?)(<\/\2>)/gi);
    let match: string[]|null;

    while (match = regExp.exec(html)) {

      // Found URL that is not just a hash
      if (match[3] && match[3] !== '#') {

        // Make URL absolute
        let url = this.galleryExtractorUrlService.extract(source, match[3]);

        // Keep link
        links.push(
          new GalleryLinkModel(url, match[0])
        );
      }
    }

    return links;
  }
}
