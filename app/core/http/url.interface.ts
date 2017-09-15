export interface HttpUrlInterface {

  /**
   * Returns the URL's original address
   */
  getUrl(): string;

  /**
   * Returns the URL protocol, example: http, https
   */
  getProtocol(): string;

  /**
   * Returns the URL host, example: mysite.com
   */
  getHost(): string;

  /**
   * Returns the URL origin, example: http://mysite.com
   */
  getOrigin(): string;

  /**
   * Returns the URL base path, example: /mypath/
   */
  getBase(): string;

  /**
   * Returns the absolute URL of the path
   *
   * @param path
   */
  getAbsoluteUrl(path: string): string;

}
