import { GalleryLinkModel } from './link.model';

export class GalleryImageModel {

  /**
   *
   * @param src
   * @param link
   */
  constructor(protected src: string, protected link: GalleryLinkModel) {

  }

  /**
   * Gets the src
   */
  getSrc(): string {

    return this.src;
  }

  /**
   * Gets the link
   */
  getLink(): GalleryLinkModel {

    return this.link;
  }

}
