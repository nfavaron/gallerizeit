import { SiteModel } from './site.model';

export class ErrorModel {

  public static MSG_NO_LOAD: string = 'Unable to load {site}';
  public static MSG_NO_IMAGE: string = 'Unable to detect a photo gallery on {site}';
  public static MSG_NO_HOTLINK: string = 'Not allowed to load photos outside of {site}';
  public static MSG_NO_MORE_IMAGE: string = 'No more photos to load from {site}';
  public static MSG_HINT: string = 'It works best if you add a photo gallery URL with page numbers';

  /**
   *
   * @param site
   * @param message
   */
  constructor(private site: SiteModel, private message: string) {

  }

  /**
   * Returns the formatted error message
   */
  getMessage(): string {

    return this.message.replace('{site}', this.site.getSiteName());
  }
}
