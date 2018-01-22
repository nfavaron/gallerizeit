import { Injectable } from '@angular/core';
import { StringChecker } from '../shared/string/checker';

@Injectable()
export class CensorshipService implements StringChecker {

  /**
   *
   * @param stringChecker
   */
  constructor(private stringChecker: StringChecker) {

  }

  /**
   * Returns true is the provided @text is safe, else returns false
   *
   * @param text
   */
  isSafe(text: string): boolean {

    return this.stringChecker.isSafe(text);
  }
}
