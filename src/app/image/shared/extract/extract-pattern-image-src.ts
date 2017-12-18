import { ImageModel } from '../image.model';

/**
 * Returns an image link pattern extracted from an array of images
 *
 * @param images
 */
export function extractPatternImageSrc(images: ImageModel[]): string {

  // Extracted patterns
  const patterns: {[key: string]: number} = {};
  let pattern = '';

  // For each image
  images.forEach(image => {

    // Extraction based on the image's href
    let p = image.getSrc();

    // TODO extract logic to prevent duplication

    // Generalizes subdomain
    p = p.replace(/\/\/[a-z0-9]+\./gi, '//@subdomain@.');

    // Generalizes number
    p = p.replace(/[0-9]+/gi, '@number@');

    // Generalizes last node
    const req = p.split('?'); // query params // TODO: advanced query params
    const node = req[0].replace(/^.+(\/[^\/]+\/?)$/gi, '$1');

    // TODO: review this logic, and check why not shared with page-link-pattern
    // Last node has a none alphanumeric character or slash, and does not contain the subdomain
    if (node.match(/[^a-z0-9\/]/gi) && node.indexOf('@subdomain@') === -1) {

      p = p.replace(node, '/@file@');
    }

    // Has query params
    if (req[1]) {

      p = p.replace(req[1], '@params@');
    }

    // Define pattern's count
    if (!patterns[p]) {

      patterns[p] = 0;
    }

    // Increment pattern's count
    patterns[p]++;
  });

  // Find pattern with the most occurrences
  let max = 0;
  Object.keys(patterns).forEach(p => {

    const count = patterns[p];

    // Found more occurrences
    if (count > max) {

      pattern = p;
      max = count;
    }
  });

  return pattern;
}
