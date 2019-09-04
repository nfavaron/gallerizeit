import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SafeStyle } from '@angular/platform-browser';

@Pipe({name: 'trustCss'})
export class TrustCssPipe implements PipeTransform {

  /**
   *
   * @param sanitizer
   */
    constructor(
      private sanitizer: DomSanitizer
    ) {

    }

  /**
   * Make a raw CSS code safe
   *
   * @param css
   */
    transform(css: string): SafeStyle {

      return this.sanitizer.bypassSecurityTrustStyle(css);
    }
}
