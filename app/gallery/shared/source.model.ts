import { CoreHttpUrlDom } from '../../core/http/url/dom';

export class SourceModel {

  public isInitialized: boolean = false;
  public hasMorePages: boolean = true;
  public imageLinkPattern: string = '';
  public pageLinkPattern: string = '';
  public page: number = 1;
  protected httpUrl: CoreHttpUrlDom;

  /**
   *
   * @param url
   */
  constructor(protected url: string) {

    this.httpUrl = new CoreHttpUrlDom(url);
  }

  /**
   * Returns the HTTP URL
   */
  getHttpUrl(): CoreHttpUrlDom {

    return this.httpUrl;
  }
}
