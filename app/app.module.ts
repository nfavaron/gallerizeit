import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import {UrlSerializer} from '@angular/router';

import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { environment } from './environments/environment';
import { CoreModule } from './core/core.module';
import { AppRoutingModule } from './app-routing.module';
import { AppServiceConfig } from './app.service.config';
import { FirebaseServiceConfig } from './firebase.service.config';
import { AppService } from './app.service';
import { GalleryModule } from './gallery/gallery.module';
import { CoreHttpUrlSerializer } from './core/http/url/serializer';

@NgModule({
  imports: [
    AppRoutingModule,
    CoreModule.forRoot(),
    GalleryModule
  ],
  declarations: [
    AppComponent
  ],
  providers: [
    { provide: AppServiceConfig, useValue: environment.app },
    { provide: FirebaseServiceConfig, useValue: environment.firebase },
    { provide: UrlSerializer, useClass: CoreHttpUrlSerializer },
    AppService
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
