import { Injectable } from '@angular/core';
import { GalleryLinkModel } from '../link.model';
import { GalleryImageModel } from '../image.model';
import { GalleryExtractorUrlService } from './url.service';
import { SourceModel } from '../source.model';

@Injectable()
export class GalleryExtractorImageService {

  /**
   *
   * @param galleryExtractorUrlService
   */
  constructor(private galleryExtractorUrlService: GalleryExtractorUrlService) {

  }

  /**
   * Returns an array of images extracted from an array of links
   *
   * @param source
   * @param links
   */
  extract(source: SourceModel, links: GalleryLinkModel[]): GalleryImageModel[] {

    // Regular expression to identify an image
    const regExp = /(?:[\s]+src=["']?([^">\s']+))|(?:[\s]*:url\(["']?([^")\s']+))/gim;

    // Extracted images
    const image: {[key: string]: GalleryLinkModel[]} = {};

    // For each link
    links.forEach(link => {

      let match: string[]|null;
      let src: string;

      // Found an img within a link
      while (match = regExp.exec(link.getHtml())) {

        let url = match[1] || match[2];

        // URL is not a gif
        if (url && url.match(/\.gif$/gi) === null) {

          // Make URL absolute
          src = this.galleryExtractorUrlService.extract(source, url);

          if (!image[src]) {

            image[src] = [];
          }

          image[src].push(link);
        }
      }
    });

    return Object
      .keys(image)
      .filter(src => image[src].length === 1)
      .map(src => new GalleryImageModel(src, image[src][0]))
    ;
  }
}
