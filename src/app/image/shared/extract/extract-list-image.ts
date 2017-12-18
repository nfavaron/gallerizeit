import { SiteModel } from '../../../core/site/site.model';
import { ImageLinkModel } from '../image-link.model';
import { ImageModel } from '../image.model';
import { extractAbsoluteUrl } from './extract-absolute-url';

/**
 * Returns an array of image models extracted from an array of image link models
 *
 * @param site
 * @param links
 */
export function extractListImage(site: SiteModel, links: ImageLinkModel[]): ImageModel[] {

  // Regular expression to identify an image
  const regExp = /(?:[\s]+src=["']?([^">\s']+))|(?:[\s]*:url\(["']?([^")\s']+))/gim;

  // Extracted images
  const image: {[key: string]: ImageLinkModel[]} = {};

  // For each link
  links.forEach(link => {

    let match: string[]|null;
    let src: string;

    // Found an img within a link
    while (match = regExp.exec(link.getHtml())) {

      const url = match[1] || match[2];

      // URL is not a gif or a logo
      if (url && url.match(/\.gif$/gi) === null && url.match(/[^a-z]+logo[^a-z]+/gi) === null) {

        // Make URL absolute
        src = extractAbsoluteUrl(site, url);

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
    .map(src => new ImageModel(src, image[src][0], site));
}
