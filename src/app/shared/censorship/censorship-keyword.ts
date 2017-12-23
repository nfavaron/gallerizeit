import { Injectable } from '@angular/core';

@Injectable()
export class CensorshipKeyword {

  /**
   * List of blacklisted keywords, welcome to the worst of the Web...
   */
  private blacklist: string[] = [
    'porn',
    'sex',
    'fuck',
    'fucking',
    'suck',
    'pussy',
    'vagina',
    'vaginas',
    'penis',
    'dick',
    'dicks',
    'boob',
    'boobs',
    'tit',
    'tits',
    'nipple',
    'nipples',
    'ass',
    'asses',
    'anal',
    'anals',
    'booty',
    'booties',
    'cum',
    'penetration',
    'penetrations',
    'blowjob',
    'blowjobs',
    'bitch',
    'bitches',
    'underwear',
    'underwears',
    'panty',
    'panties',
    'hentai',
    'explicit',
    'orgasm',
    'orgasms',
    'topless'
  ];

  /**
   * Returns true is the provided @text is safe, else returns false
   *
   * @param text
   */
  isSafe(text: string): boolean {

    let words: string[];
    let word: string;

    // Replace anything not a letter or digit by a white space
    text = text.replace(/[^a-z0-9]/i, ' ');

    // Remove words of one or 2 letters
    text = text.replace(/([^a-z0-9])[a-z0-9]{1,2}([^a-z0-9])/i, '$1$2');

    // Replace consecutive white spaces by a single white space
    text = text.replace(/\s{2,}/i, ' ');

    // Remove start and end white spaces
    text = text.trim();

    // Make sure all characters are lowercase
    text = text.toLowerCase();

    // Extract words
    words = text.split(' ');

    // While the text is safe and there are words to check
    while (word = words.pop()) {

      // Found a blacklisted word
      if (this.blacklist.indexOf(word) > -1) {

        // Not safe !!
        return false;

      }

    }

    return true;

  }
}
