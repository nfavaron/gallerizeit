import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IdeasListPageModule } from '../pages/ideas-list/ideas-list.module';
import { PrioritiesListPageModule } from '../pages/priorities-list/priorities-list.module';
import { TabsPageModule } from '../pages/tabs/tabs.module';
import { TabsPageComponent } from '../pages/tabs/tabs';
import { AppComponent } from './app';
import { IdeaService } from '@gallerizeit/common';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(AppComponent),
    IdeasListPageModule,
    PrioritiesListPageModule,
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
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    IdeaService
  ]
})
export class AppModule {}
