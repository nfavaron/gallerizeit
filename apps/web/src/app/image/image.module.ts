import { NgModule } from '@angular/core';
import { ImageRoutingModule } from './image-routing.module';
import { ImageSerpComponent } from './serp/image-serp.component';
import { CrawlerService, SharedModule } from '@gallerizeit/common';

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
