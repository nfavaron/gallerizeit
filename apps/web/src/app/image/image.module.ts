import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { ImageRoutingModule } from './image-routing.module';
import { ImageSerpComponent } from './serp/image-serp.component';
import { CrawlerService } from './shared/crawler.service';

@NgModule({
  imports: [
    SharedModule,
    ImageRoutingModule
  ],
  declarations: [
    ImageSerpComponent
  ],
  providers: [
    CrawlerService
  ]
})
export class ImageModule { }
