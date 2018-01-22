import { SiteModel } from '../../model/site.model';

/**
 * Extract the absolute URL from the @site
 *
 * @param site
 * @param url
 */
export function extractAbsoluteUrlHelper(site: SiteModel, url: string): string {

  const urlParser = site.getUrlParser();

  // Missing protocol
  if (url.indexOf('//') === 0) {

    url = urlParser.getProtocol() + ':' + url;

    // Missing protocol & domain but is absolute link
  } else if (url.indexOf('/') === 0) {

    url = urlParser.getOrigin() + url;

    // Missing protocol & domain but is relative link
  } else if (!url.match(/^https?:\/\//gi)) {

    // Starts with '?' or './'
    if (url.indexOf('?') === 0 || url.indexOf('./') === 0) {

      url = urlParser.getOrigin() + urlParser.getPath() + url.replace(/^\.\//, '/');

    } else {

      // TODO: improve link parsing, if ends by file or directory

      url = urlParser.getOrigin() + '/' + url;

    }
  }

  return url;
}
