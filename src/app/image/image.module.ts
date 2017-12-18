import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { ImageRoutingModule } from './image-routing.module';
import { ImageSerpComponent } from './serp/image-serp.component';
import { ImageService } from './shared/image.service';

@NgModule({
  imports: [
    SharedModule,
    ImageRoutingModule
  ],
  declarations: [
    ImageSerpComponent
  ],
  providers: [
    ImageService
  ]
})
export class ImageModule { }
