import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { CoreHeaderComponent } from './header/core-header.component';
import { CoreFooterComponent } from './footer/core-footer.component';
import { SharedModule } from '../shared/shared.module';
import { SiteService } from './site/site.service';
import { HttpDownloader } from './http/http-downloader';
import { FirebaseDownloader } from './firebase/firebase-downloader';
import { environment } from '../../environments/environment';
import { FirebaseConfig } from './firebase/firebase-config';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { HttpDownloaderService } from './http/http-downloader.service';

@NgModule({
  imports: [
    SharedModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
  ],
  declarations: [
    CoreHeaderComponent,
    CoreFooterComponent
  ],
  exports: [
    CoreHeaderComponent,
    CoreFooterComponent
  ]
})
export class CoreModule {

  static forRoot(): ModuleWithProviders {
    return {
      ngModule: CoreModule,
      providers: [
        SiteService,
        HttpDownloaderService,
        { provide: FirebaseConfig, useValue: environment.firebase },
        { provide: HttpDownloader, useClass: FirebaseDownloader },
      ]
    };
  }

  constructor (@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error(
        'CoreModule is already loaded. Import it in the AppModule only');
    }
  }
}
