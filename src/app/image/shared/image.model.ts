import { ImageLinkModel } from './image-link.model';
import { SiteModel } from '../../core/site/site.model';

export class ImageModel {

  /**
   *
   * @param src
   * @param imageLink
   * @param site
   */
  constructor(protected src: string,
              protected imageLink: ImageLinkModel,
              protected site: SiteModel) {

  }

  /**
   * Gets the src
   */
  getSrc(): string {

    return this.src;
  }

  /**
   * Gets the image link
   */
  getImageLink(): ImageLinkModel {

    return this.imageLink;
  }

  /**
   * Gets the site
   */
  getSite(): SiteModel {

    return this.site;
  }

}
