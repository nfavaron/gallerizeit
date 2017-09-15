import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({name: 'trustCss'})
export class TrustCssPipe implements PipeTransform {

    constructor(
      private sanitizer: DomSanitizer
    ) {

    }

    transform(css: string) {
      return this.sanitizer.bypassSecurityTrustStyle(css);
    }
}
