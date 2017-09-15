/**
 * @credits: https://ourcodeworld.com/articles/read/188/encode-and-decode-html-entities-using-pure-javascript
 */
export class HtmlEntity {

  /**
   * Converts a string to its html characters completely
   **/
  static encode(str: string): string {

    let buffer = [];
    let i: number;

    for (i = str.length - 1; i >= 0; i--) {

      buffer.unshift(['&#' + str[i].charCodeAt(0) + ';'].join(''));
    }

    return buffer.join('');
  }

  /**
   * Converts an html characterSet into its original character
   **/
  static decode(str: string): string {

    return str.replace(/&#(\d+);/g, (match: string, dec: number) => String.fromCharCode(dec));
  }
}
