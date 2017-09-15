export interface CoreHttpDownloaderInterface {

  /**
   * Returns a promise of string representing the HTML code located at @url
   *
   * @param url
   */
  getContent(url: string): Promise<string>;

}
