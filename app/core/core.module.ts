import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import * as firebase from 'firebase/app';

import { SharedModule } from '../shared/shared.module';
import { CoreHeaderComponent } from './header/header.component';
import { CoreHomeComponent } from './home/home.component';
import { CorePageService } from './page.service';
import { environment } from '../environments/environment';
import { CoreHttpDownloaderFirebase } from './http/downloader/firebase';
import { CoreContentCensorshipWordService } from './content/censorship/word.service';
import { GalleryImageService } from '../gallery/shared/image.service';

@NgModule({
  imports: [
    BrowserModule,
    SharedModule,
    HttpModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule
  ],
  declarations: [
    CoreHeaderComponent,
    CoreHomeComponent
  ],
  exports: [
    CoreHeaderComponent,
    CoreHomeComponent
  ],
  providers: [
    CorePageService,
    Title,
    CoreHttpDownloaderFirebase,
    CoreContentCensorshipWordService,
    GalleryImageService
  ]
})
export class CoreModule {

  static forRoot(): ModuleWithProviders {
    return {
      ngModule: CoreModule,
      providers: [
        CorePageService,
        Title,
        CoreHttpDownloaderFirebase,
        CoreContentCensorshipWordService,
        GalleryImageService
      ]
    };
  }

  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error(
        'CoreModule is already loaded. Import it in the AppModule only');
    }
  }
}
