import { SiteModel } from '../../model/site.model';
import { ImageLinkModel } from '../../model/image-link.model';
import { extractAbsoluteUrlHelper } from './absolute-url.helper';

/**
 * Returns an array of links extracted from a HTML string
 *
 * @param site
 * @param html
 */
export function extractListImageLinkHelper(site: SiteModel, html: string): ImageLinkModel[] {

  const links: ImageLinkModel[] = [];

  // Remove line breaks
  html = html.replace(/\n|\r/gi, '');

  // Regular expression to identify a link
  const regExp = new RegExp(/(<(a)[^>]*href=["']?([^"'\s>]+)[^>]*>)(.*?)(<\/\2>)/gi);
  let match: string[]|null;

  while (match = regExp.exec(html)) {

    // Found URL that is not just a hash
    if (match[3] && match[3] !== '#') {

      // Make URL absolute
      const url = extractAbsoluteUrlHelper(site, match[3]);

      // Keep link
      links.push(
        new ImageLinkModel(url, match[0])
      );
    }
  }

  return links;
}
