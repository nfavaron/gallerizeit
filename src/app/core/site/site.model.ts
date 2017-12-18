import { UrlParser } from '../../shared/url/url-parser';

export class SiteModel {

  /**
   * Site loaded in a SERP
   */
  public loadCount: number = 0;

  /**
   * At least one image was clicked in a SERP
   */
  public likeCount: number = 0;

  /**
   * URL acting as unique identifier
   */
  public url: string = '';
  public title: string = '';
  public createDate: string = '';
  public updateDate: string = '';
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
  private urlParser: UrlParser;

  /**
   *
   * @param url
   */
  constructor(url: string) {

    // Remove special last character that would cause duplicated URL
    this.url = url.replace(/[#/?]$/gi, '');

    // URL parser
    this.urlParser = new UrlParser(url);
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
   * Returns the URL parser
   */
  getUrlParser(): UrlParser {

    return this.urlParser;
  }

  /**
   * Returns source name
   */
  getSourceName(): string {

    return (this.getUrlParser().getHost() + this.getUrlParser().getPath())
      .replace(/^www\./gi, '')
      .replace(/\/$/gi, '')
      ;
  }
}
