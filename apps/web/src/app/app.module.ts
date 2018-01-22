import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { UrlSerializer } from '@angular/router';
import { ServiceWorkerModule } from '@angular/service-worker';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/first';
import { UrlReadableSerializer } from '@gallerizeit/common';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    ServiceWorkerModule.register('/ngsw-worker.js', {
      enabled: environment.production
    }),
    AppRoutingModule,
    CoreModule.forRoot(),
  ],
  providers: [
    { provide: UrlSerializer, useClass: UrlReadableSerializer },
  ],
  bootstrap: [
    AppComponent,
  ]
})
export class AppModule { }

