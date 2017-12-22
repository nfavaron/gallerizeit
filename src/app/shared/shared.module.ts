import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TrustCssPipe } from './trust-css.pipe';
import { HttpClientModule } from '@angular/common/http';
import { CensorshipKeyword } from './censorship/censorship-keyword';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    HttpClientModule
  ],
  declarations: [
    TrustCssPipe
  ],
  exports: [
    CommonModule,
    RouterModule,
    TrustCssPipe
  ],
  providers: [
    CensorshipKeyword
  ]
})
export class SharedModule { }
