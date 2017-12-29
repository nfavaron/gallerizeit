import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { SettingsStateEnum } from './settings-state.enum';

@Injectable()
export class SettingsService {

  /**
   * State observable
   */
  public setState$: Observable<SettingsStateEnum>;
  private setStateSubject: Subject<SettingsStateEnum>;

  /**
   * URL list observable
   */
  public setUrlList$: Observable<string[]>;
  private setUrlListSubject: Subject<string[]>;

  constructor() {

    this.setStateSubject = new Subject<SettingsStateEnum>();
    this.setState$ = this.setStateSubject.asObservable();

    this.setUrlListSubject = new Subject<string[]>();
    this.setUrlList$ = this.setUrlListSubject.asObservable();
  }

  /**
   * Set settings state
   *
   * @param state
   */
  setState(state: SettingsStateEnum): void {

    this.setStateSubject.next(state);
  }

  /**
   * Update URL list
   *
   * @param urlList
   */
  setUrlList(urlList: string[]): void {

    this.setUrlListSubject.next(urlList);
  }
}
