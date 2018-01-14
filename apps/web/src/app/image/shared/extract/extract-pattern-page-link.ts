import { ImageLinkModel } from '../image-link.model';
import { regExpEscape } from '../../../shared/regexp/regexp-escape';

/**
 * Returns a page link pattern string extracted from a list of links and an image link pattern string
 *
 * @param links
 * @param imageLinkPattern
 */
export function extractPatternPageLink(links: ImageLinkModel[], imageLinkPattern: string): string {

  // Associative array of identified patterns to their number of occurrences
  const patternCount: { [key: string]: number } = {};
  const patternUrl: { [key: string]: string[] } = {};
  let pattern = '';

  // For each link
  links.forEach(link => {

    // Extraction based on the link URL
    let p = link.getUrl();

    // Link has at least one number prepended by NOT an alphanumeric or is prepend by 'p' or 'page'
    if (p.match(/[^a-z0-9][0-9]+/gi) || p.match(/p(age)?[0-9]+/gi)) {

      // Generalizes subdomain
      p = p.replace(/\/\/[a-z0-9]+\./gi, '//@subdomain@.');

      // Generalizes number
      p = p.replace(/[0-9]+/gi, '@number@');

      // Convert ending by /@number@ to /@file@
      p = p.replace(/\/@number@\/?$/gi, '/@file@');

      // New pattern
      if (!patternCount[p]) {

        patternCount[p] = 0;
        patternUrl[p] = [];
      }

      // Keep original link
      const url = link.getUrl();
      patternUrl[p].push(url);

      // Increment number of occurrences
      patternCount[p]++;

      // If the pattern contains the word 'page'
      if (url.match(/[&;?/,]page/gi)) {

        // We most likely have a winner!
        patternCount[p] += 1337;
      }
    }
  });

  // Search for max occurrence, that appears more than once
  let max = 1;
  let pagePattern = '';

  Object
  .keys(patternCount)
  .forEach(p => {

    // Found more occurrences
    if (patternCount[p] > max) {

      // Not the image pattern
      if (p !== imageLinkPattern) {

        pagePattern = p;
        max = patternCount[p];
      }
    }
  })
  ;

  // Did not find any page pattern
  if (!pagePattern) {

    // Returns default pattern value
    return pattern;
  }

  // Keep page original URL
  const pageUrl = patternUrl[pagePattern][0];

  // Find which @number@ is the page identifier
  let numberCount = 0;
  let match: string[] | null;

  const regExp = new RegExp(/[0-9]+/gi);
  while (match = regExp.exec(pageUrl)) {

    numberCount++;
  }

  // Only one number
  if (numberCount === 1) {

    // This must be the page identifier
    pagePattern = pageUrl.replace(/[0-9]+/gi, '@page@');

  } else {

    let p = '';
    const explode = pageUrl.split(/[0-9]+/gi);

    explode.forEach(part => {

      if (part) {

        // Reset numbers list for this test pattern
        const numbers: string[] = [];

        // Didn't find page yet
        if (p.indexOf('@page@') === -1) {

          let testPattern = p + part + '@page@';
          testPattern = regExpEscape(testPattern, '/');
          testPattern = testPattern.replace(/@page@/gi, '([0-9]+)');
          const testRegExp = new RegExp('^' + testPattern + '.*$', 'gi');

          // For each URL
          patternUrl[pagePattern].forEach(url => {

            // Extract number
            const number = url.replace(testRegExp, '$1');

            if (numbers.indexOf(number) === -1) {

              numbers.push(number);
            }
          });
        }

        // Found many different numbers
        if (numbers.length > 1) {

          // This must be the page identifier
          p += part + '@page@';

        } else {

          // Extract number
          let testPattern = regExpEscape(p + part, '/');
          testPattern = testPattern.replace(/@page@/gi, '[0-9]+');
          const testRegExp = new RegExp('^' + testPattern + '([0-9]+).*$', 'gi');

          const number = pageUrl.replace(testRegExp, '$1');

          p += part + number;
        }
      }
    });

    // Update page pattern
    pagePattern = p;
  }

  pattern = pagePattern;

  return pattern.indexOf('@page@') > -1 ? pattern : '';
}
