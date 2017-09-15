export class GalleryLinkModel {

  /**
   * @param url
   * @param html
   */
  constructor(protected url: string, protected html: string) {

  }

  /**
   * Gets the url
   */
  getUrl(): string {

    return this.url;
  }

  /**
   * Gets the html
   */
  getHtml() {

    return this.html;
  }

}
