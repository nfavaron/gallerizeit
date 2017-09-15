import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../shared/shared.module';
import { GallerySerpComponent } from './serp/serp.component';
import { GalleryFormComponent } from './form/form.component';
import { GalleryImageService } from './shared/image.service';
import { GalleryExtractorImageService } from './shared/extractor/image.service';
import { GalleryExtractorImageLinkPatternService } from './shared/extractor/image-link-pattern.service';
import { GalleryExtractorLinkService } from './shared/extractor/link.service';
import { GalleryExtractorPageLinkPatternService } from './shared/extractor/page-link-pattern.service';

@NgModule({
  imports: [
    SharedModule,
    ReactiveFormsModule
  ],
  exports: [],
  declarations: [
    GallerySerpComponent,
    GalleryFormComponent
  ],
  providers: [
    GalleryImageService,
    GalleryExtractorImageService,
    GalleryExtractorImageLinkPatternService,
    GalleryExtractorLinkService,
    GalleryExtractorPageLinkPatternService
  ]
})
export class GalleryModule {}
