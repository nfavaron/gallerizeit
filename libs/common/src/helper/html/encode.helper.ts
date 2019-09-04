/**
 * Converts a string to its html characters completely
 *
 * @param str
 **/
export function htmlEncodeHelper(str: string): string {

  const buffer = [];
  let i: number;

  for (i = str.length - 1; i >= 0; i--) {

    buffer.unshift(['&#' + str[i].charCodeAt(0) + ';'].join(''));
  }

  return buffer.join('');
}
