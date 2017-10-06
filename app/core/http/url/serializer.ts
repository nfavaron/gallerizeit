import { UrlSerializer, UrlTree, DefaultUrlSerializer } from '@angular/router';

/**
 * URL serializer that will not encode URL
 *
 * @credits jigar gala
 * @url https://stackoverflow.com/questions/41476193/angular-2-disable-url-encoding
 */
export class CoreHttpUrlSerializer implements UrlSerializer {

  /**
   * Parse encoded URL
   *
   * @param url
   */
  parse(url: any): UrlTree {

    const dus = new DefaultUrlSerializer();

    return dus.parse(url);
  }

  /**
   * Serialize URL tree
   *
   * @param tree
   */
  serialize(tree: UrlTree): any {

    const dus = new DefaultUrlSerializer();
    const path = dus.serialize(tree);

    return path
      .replace(/%2F/g, '/')
      .replace(/%3D/g, '=')
      ;
  }
}
