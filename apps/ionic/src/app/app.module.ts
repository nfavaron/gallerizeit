import 'rxjs/add/operator/map';
import 'rxjs/add/operator/first';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import {
  CensorshipKeyword, CensorshipService,
  DownloaderService, FirebaseConfig, FirebaseDownloader, HttpDownloader,
  SiteService, StringChecker
} from '@gallerizeit/common';
import { HomePageModule } from '../pages/home/home.module';
import { SitePopularPageModule } from '../pages/site-popular/site-popular.module';
import { SiteUpdatePageModule } from '../pages/site-update/site-update.module';
import { TabsPageModule } from '../pages/tabs/tabs.module';
import { TabsPageComponent } from '../pages/tabs/tabs';
import { AppComponent } from './app';

// TODO: should either be shared or ionic-specific
import { environment } from '../../../web/src/environments/environment';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(AppComponent),
    HomePageModule,
    SitePopularPageModule,
    SiteUpdatePageModule,
    TabsPageModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    AppComponent,
    TabsPageComponent
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    DownloaderService,
    CensorshipService,
    SiteService,
    { provide: FirebaseConfig, useValue: environment.firebase },
    { provide: HttpDownloader, useClass: FirebaseDownloader },
    { provide: StringChecker, useClass: CensorshipKeyword },
  ]
})
export class AppModule {}
