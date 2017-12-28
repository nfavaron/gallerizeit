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
   * Number of sites in settings
   */
  siteCount: number = 0;

  /**
   *
   * @param settingsService
   */
  constructor(private settingsService: SettingsService) {

  }

  ngOnInit() {

    this.settingsService.setCount$.subscribe(count => this.onSetCountSettings(count));
  }

  /**
   * Clicked the settings button
   */
  onClickSettings(): void {

    this.settingsService.setState(SettingsStateEnum.open);
  }

  /**
   * Set count in settings
   */
  onSetCountSettings(count: number): void {

    this.siteCount = count;
  }
}
