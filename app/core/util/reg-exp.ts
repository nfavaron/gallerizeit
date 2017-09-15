export class CoreUtilRegExp {

  /**
   * Escape special characters for regular expression usage
   * @credits http://locutus.io/php/pcre/preg_quote/
   *
   * @param str
   * @param delimiter
   */
  static escape(str: string, delimiter: string): string {

    return str.replace(new RegExp('[.\\\\+*?\\[\\^\\]$(){}=!<>|:\\' + (delimiter || '') + '-]', 'g'), '\\$&');
  }
}
