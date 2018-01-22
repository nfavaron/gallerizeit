import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HomePageModule } from '../pages/home/home.module';
import { SitePopularPageModule } from '../pages/site-popular/site-popular.module';
import { SiteUpdatePageModule } from '../pages/site-update/site-update.module';
import { TabsPageModule } from '../pages/tabs/tabs.module';
import { TabsPageComponent } from '../pages/tabs/tabs';
import { AppComponent } from './app';
import { SiteService } from '@gallerizeit/common';

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
    SiteService
  ]
})
export class AppModule {}
