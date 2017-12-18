import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import 'rxjs/add/operator/map';
// TODO: remove import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/first';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';
import { UrlReadableSerializer } from './shared/url/url-readable-serializer';
import { UrlSerializer } from '@angular/router';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CoreModule.forRoot()
  ],
  providers: [
    { provide: UrlSerializer, useClass: UrlReadableSerializer },
  ],
  bootstrap: [
    AppComponent,
  ]
})
export class AppModule { }

