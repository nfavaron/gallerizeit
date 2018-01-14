import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'socialDate'})
export class SocialDatePipe implements PipeTransform {

  /**
   *
   */
  constructor() {

  }

  /**
   *
   * @param timestamp
   */
  transform(timestamp: string): string {

    const ms = (Date.now() - parseInt(timestamp, 10));

    // Years
    if (ms > 31536000000) {

      const year = Math.floor(ms / 31536000000);

      return year + ' ' + (year > 1 ? 'years ago' : 'year ago');
    }

    // Months
    if (ms > 2592000000) {

      const month = Math.floor(ms / 2592000000);

      return month + ' ' + (month > 1 ? 'months ago' : 'month ago');
    }

    // Days
    if (ms > 86400000) {

      const day = Math.floor(ms / 86400000);

      return day + ' ' + (day > 1 ? 'days ago' : 'day ago');
    }

    // Hours
    if (ms > 3600000) {

      const hour = Math.floor(ms / 3600000);

      return hour + ' ' + (hour > 1 ? 'hours ago' : 'hour ago');
    }

    // Minutes
    if (ms > 60000) {

      const minute = Math.floor(ms / 60000);

      return minute + ' ' + (minute > 1 ? 'minutes ago' : 'minute ago');
    }

    return 'just now';
  }
}
