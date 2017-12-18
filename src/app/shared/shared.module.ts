import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TrustCssPipe } from './trust-css.pipe';
import { ImageComponent } from './image/image.component';
import { HttpClientModule } from '@angular/common/http';
import { CensorshipKeyword } from './censorship/censorship-keyword';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    HttpClientModule
  ],
  declarations: [
    TrustCssPipe,
    ImageComponent
  ],
  exports: [
    CommonModule,
    RouterModule,
    TrustCssPipe,
    ImageComponent
  ],
  providers: [
    CensorshipKeyword
  ]
})
export class SharedModule { }
