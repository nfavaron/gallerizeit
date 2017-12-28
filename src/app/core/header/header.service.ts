import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class HeaderService {

  public static SITE_SETTINGS_STATE_OPEN: string = 'open'

  /**
   * Site settings state observable
   */
  public siteSettings$: Observable<string>;
  private siteSettingsSubject: Subject<string>;

  /**
   * Settings requests observable
   */
  public siteCount$: Observable<number>;
  private siteCountSubject: Subject<number>;

  /**
   *
   */
  constructor() {

    this.siteSettingsSubject = new Subject<string>();
    this.siteSettings$ = this.siteSettingsSubject.asObservable();

    this.siteCountSubject = new Subject<number>();
    this.siteCount$ = this.siteCountSubject.asObservable();
  }

  /**
   * Request to open the settings
   */
  openSiteSettings(): void {

    this.siteSettingsSubject.next(HeaderService.SITE_SETTINGS_STATE_OPEN);
  }

  /**
   * Update site count
   *
   * @param count
   */
  setSiteCount(count: number): void {

    this.siteCountSubject.next(count);
  }
}
