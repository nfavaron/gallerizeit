import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';

import { TrustCssPipe } from './trust-css.pipe';
import { ImageComponent } from './image/image.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    HttpModule
  ],
  declarations: [
    TrustCssPipe,
    ImageComponent
  ],
  exports: [
    CommonModule,
    RouterModule,
    HttpModule,
    TrustCssPipe,
    ImageComponent
  ]
})
export class SharedModule {
}
