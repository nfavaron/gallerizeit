import { htmlDecodeHelper } from '../../helper/html/decode.helper';

export class UrlParser {

  /**
   * Use HTMLAnchorElement to parse an URL:
   *
   * parser.href = "http://example.com:3000/pathname/?search=test#hash";
   * parser.protocol; // => "http:"
   * parser.hostname; // => "example.com"
   * parser.port;     // => "3000"
   * parser.pathname; // => "/pathname/"
   * parser.search;   // => "?search=test"
   * parser.hash;     // => "#hash"
   * parser.host;     // => "example.com:3000"
   */
  private parser: HTMLAnchorElement = document.createElement('a');

  /**
   *
   * @param url
   */
  constructor(url: string) {

    this.parser.href = htmlDecodeHelper(decodeURI(url));
  }

  /**
   * @inheritdoc
   */
  getUrl(): string {

    return this.parser.href;
  }

  /**
   * @inheritdoc
   */
  getProtocol(): string {

    return this.parser.protocol.replace(':', '');
  }

  /**
   * @inheritDoc
   */
  getHost(): string {

    return this.parser.host;
  }

  /**
   * @inheritdoc
   */
  getOrigin(): string {

    return this.getProtocol() + '://' + this.getHost();
  }

  /**
   * @inheritdoc
   */
  getPath(): string {

    return this.parser.pathname;
  }
}
