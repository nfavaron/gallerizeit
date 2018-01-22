import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { CoreHeaderComponent } from './header/core-header.component';
import { CoreFooterComponent } from './footer/core-footer.component';
import { environment } from '../../environments/environment';
import { CoreSettingsComponent } from './settings/core-settings.component';
import { SettingsService } from './settings/settings.service';
import {
  CensorshipKeyword, CensorshipService, DownloaderService,
  FirebaseConfig, FirebaseDownloader,
  HttpDownloader, SharedModule, SiteService, StringChecker
} from '@gallerizeit/common';

@NgModule({
  imports: [
    SharedModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
  ],
  declarations: [
    CoreHeaderComponent,
    CoreFooterComponent,
    CoreSettingsComponent,
  ],
  exports: [
    CoreHeaderComponent,
    CoreFooterComponent,
    CoreSettingsComponent,
  ]
})
export class CoreModule {

  /**
   * Returns providers for root usage only
   */
  static forRoot(): ModuleWithProviders {

    return {
      ngModule: CoreModule,
      providers: [
        DownloaderService,
        CensorshipService,
        SiteService,
        SettingsService,
        { provide: FirebaseConfig, useValue: environment.firebase },
        { provide: HttpDownloader, useClass: FirebaseDownloader },
        { provide: StringChecker, useClass: CensorshipKeyword },
      ]
    };
  }

  /**
   *
   * @param parentModule
   */
  constructor (@Optional() @SkipSelf() parentModule: CoreModule) {

    if (parentModule) {
      throw new Error(
        'CoreModule is already loaded. Import it in the AppModule only');
    }
  }
}
