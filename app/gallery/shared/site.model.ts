import { CoreHttpUrlDom } from '../../core/http/url/dom';

export class GallerySiteModel {

  public url: string = ''; // acts as ID
  public loadCount: number = 0;
  public createDate: string = '';
  public coverUrl: string = '';
  public imageLinkPattern: RegExp;
  public imageSrcPattern: RegExp;
  public pageLinkPattern: string = '';
  public page: number = 1;
  public hasMorePages: boolean = true;
  public isInitialized: boolean = false;
  public isLoaded: boolean = false;
  public isLoading: boolean = false;

  private id: string = '';
  private httpUrl: CoreHttpUrlDom;

  /**
   *
   * @param url
   */
  constructor(url: string) {

    // Remove special last character that would cause duplicated URL
    this.url = url.replace(/[#/?]$/gi, '');

    // URL parser
    this.httpUrl = new CoreHttpUrlDom(url);
  }

  /**
   * Returns unique ID
   */
  getId(): string {

    if (!this.id) {

      this.id = btoa(this.url);
    }

    return this.id;
  }

  /**
   * Returns URL
   */
  getUrl(): string {

    return this.url;
  }

  /**
   * Returns the HTTP URL
   */
  getHttpUrl(): CoreHttpUrlDom {

    return this.httpUrl;
  }
}
