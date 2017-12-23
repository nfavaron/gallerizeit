export class ImageLinkModel {

  /**
   * @param url
   * @param html
   */
  constructor(private url: string, private html: string) {

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
