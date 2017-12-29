import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../settings/settings.service';
import { SettingsStateEnum } from '../settings/settings-state.enum';

@Component({
  selector: 'app-core-header',
  templateUrl: './core-header.component.html',
  styleUrls: ['./core-header.component.css']
})
export class CoreHeaderComponent implements OnInit {

  /**
   * Has the user a settings count ?
   */
  hasSettingsCount: boolean = false;

  /**
   * Number of URLs in settings
   */
  settingsCount: number = 0;

  /**
   *
   * @param settingsService
   */
  constructor(private settingsService: SettingsService) {

  }

  /**
   * Initialized component
   */
  ngOnInit() {

    this.settingsService.setUrlList$.subscribe(urlList => this.onSetUrlListSettings(urlList));
    this.settingsService.setState$.subscribe(state => this.onSetStateSettings(state));
  }

  /**
   * Clicked the settings button
   */
  onClickSettings(): void {

    this.settingsService.setState(SettingsStateEnum.request);
  }

  /**
   * Set count in settings
   *
   * @param urlList
   */
  onSetUrlListSettings(urlList: string[]): void {

    this.settingsCount = urlList.length;

    this.hasSettingsCount = true;
  }

  /**
   * Set settings state
   *
   * @param state
   */
  onSetStateSettings(state: SettingsStateEnum): void {

    // Deactivate settings count if settings menu has been opened
    if (state === SettingsStateEnum.open) {

      this.hasSettingsCount = false;
    }
  }
}
