export abstract class HttpDownloader {

  /**
   * Returns a promise of string representing the HTML code located at @url
   *
   * @param url
   */
  abstract getContent(url: string): Promise<string>;

}
