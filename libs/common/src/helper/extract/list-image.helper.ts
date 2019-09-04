import { SiteModel } from '../../model/site.model';
import { ImageLinkModel } from '../../model/image-link.model';
import { ImageModel } from '../../model/image.model';
import { extractAbsoluteUrlHelper } from './absolute-url.helper';

/**
 * Returns an array of image models extracted from an array of image link models
 *
 * @param site
 * @param links
 */
export function extractListImageHelper(site: SiteModel, links: ImageLinkModel[]): ImageModel[] {

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

      // Make URL absolute
      src = extractAbsoluteUrlHelper(site, match[1] || match[2] || '');

      const isHttps = src.match(/^https:\/\//gi) !== null;
      const isGif = src.match(/\.gif$/gi) !== null;
      const isLogo = src.match(/[^a-z]+logo[^a-z]+/gi) !== null;

      // Valid image
      if (isHttps && isGif === false && isLogo === false) {

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
