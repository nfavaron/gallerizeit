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
import { GalleryExtractorUrlService } from './shared/extractor/url.service';
import { GalleryExtractorImageSrcPatternService } from './shared/extractor/image-src-pattern.service';
import { GallerySiteService } from './shared/site.service';
import { GallerySiteListComponent } from './site-list/site-list.component';

@NgModule({
  imports: [
    SharedModule,
    ReactiveFormsModule,
  ],
  exports: [
    GalleryFormComponent,
    GallerySiteListComponent,
  ],
  declarations: [
    GallerySerpComponent,
    GalleryFormComponent,
    GallerySiteListComponent,
  ],
  providers: [
    GalleryExtractorUrlService,
    GalleryExtractorImageService,
    GalleryExtractorLinkService,
    GalleryExtractorImageLinkPatternService,
    GalleryExtractorPageLinkPatternService,
    GalleryExtractorImageSrcPatternService,
    GalleryImageService,
    GallerySiteService
  ]
})
export class GalleryModule {}
