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
   * Count observable
   */
  public setCount$: Observable<number>;
  private setCountSubject: Subject<number>;

  constructor() {

    this.setStateSubject = new Subject<SettingsStateEnum>();
    this.setState$ = this.setStateSubject.asObservable();

    this.setCountSubject = new Subject<number>();
    this.setCount$ = this.setCountSubject.asObservable();
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
   * Update site count
   *
   * @param count
   */
  setCount(count: number): void {

    this.setCountSubject.next(count);
  }
}
