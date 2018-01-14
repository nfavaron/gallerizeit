import { SiteModel } from '../../../core/site/site.model';
import { regExpEscape } from '../../../shared/regexp/regexp-escape';

/**
 * Returns the extracted site title
 *
 * @param site
 * @param html
 */
export function extractTitle(site: SiteModel, html: string): string {

  // Default title
  let title = site.getUrlParser().getHost();

  // Remove line breaks
  html = html.replace(/\n|\r/gi, '');

  // Regular expression to identify the title
  const regExp = new RegExp(/<title[^>]*>(.*?)<\/title>/gi);
  const match: string[]|null = regExp.exec(html);

  if (!match || !match[1]) {

    return title;
  }

  // Keep extracted title
  title = match[1];

  // Remove host
  const hostRegExp = new RegExp(regExpEscape(site.getUrlParser().getHost(), '/'), 'gi');
  title = title.replace(hostRegExp, '');

  // Remove origin
  const originRegExp = new RegExp(regExpEscape(site.getUrlParser().getOrigin(), '/'), 'gi');
  title = title.replace(originRegExp, '');

  // Remove domain name
  const host = site.getUrlParser().getHost().split('.');
  const domain = host[host.length - 2] + '.' + host[host.length - 1];
  const domainRegExp = new RegExp(regExpEscape(domain, '/'), 'gi');
  title = title.replace(domainRegExp, '');

  // Convert &amp;
  title = title.replace('&amp;', '&');

  // Trim of any unusual starting/ending characters
  title = title.replace(/^[^a-z0-9]+/i, '');
  title = title.replace(/[^a-z0-9%)\]>!?'"]+$/i, '');

  // No title left ?
  if (!title) {

    title = site.getUrlParser().getHost();
  }

  return title;
}
