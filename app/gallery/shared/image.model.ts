import { GalleryLinkModel } from './link.model';
import { GallerySiteModel } from './site.model';

export class GalleryImageModel {

  /**
   *
   * @param src
   * @param link
   * @param site
   */
  constructor(protected src: string, protected link: GalleryLinkModel, protected site: GallerySiteModel) {

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

  /**
   * Gets the site
   */
  getSite(): GallerySiteModel {

    return this.site;
  }

}
