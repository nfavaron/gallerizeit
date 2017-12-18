import { extractAbsoluteUrl } from './extract-absolute-url';
import { SiteModel } from '../../../core/site/site.model';
import { ImageLinkModel } from '../image-link.model';

/**
 * Returns an array of links extracted from a HTML string
 *
 * @param site
 * @param html
 */
export function extractListImageLink(site: SiteModel, html: string): ImageLinkModel[] {

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
      const url = extractAbsoluteUrl(site, match[3]);

      // Keep link
      links.push(
        new ImageLinkModel(url, match[0])
      );
    }
  }

  return links;
}
