import { HttpUrlInterface } from '../url.interface';
import { HtmlEntity } from '../../../shared/html/entity';

export class CoreHttpUrlDom implements HttpUrlInterface {

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
  protected parser: HTMLAnchorElement = document.createElement('a');

  /**
   *
   * @param url
   */
  constructor(url: string) {

    this.parser.href = HtmlEntity.decode(decodeURI(url));
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
  getBase(): string {

    /*if (empty(this.base)) {

      request = parse_url(this.url);

      // Make sure the path has a value
      path = empty(request['path']) ? '/' : request['path'];

      // Remove eventual file at the end of the path
      path = preg_replace('/\/[a-z0-9_\-.]+\.[a-z0-9]+/i', '/', path);

      // Path must end with slash
      if (!preg_match('/\//', path)) {
        path .= '/';
      }

      this.base = sprintf('%s%s', this.getOrigin(), path);

    }

    return this.base;*/

    return 'TODO';

  }

  /**
   * @inheritdoc
   */
  getAbsoluteUrl(path: string): string {

    /*// By default, consider the path as an URL
    path = html_entity_decode(urldecode(path));
    url  = path;

    // Does not start by 'http'
    if (!preg_match('/^http/', path)) {

      // Starts by double slash
      if (mb_strpos(path, '//') === 0) {

        url = sprintf('%s:%s', this.getMethod(), path);

        // Starts by slash
      } elseif (mb_substr(path, 0, 1) === '/') {

        url = this.getOrigin() . path;

      } else {

        url = this.getBase() . path;

      }

    }

    return url;*/

    return 'TODO';
  }

}
