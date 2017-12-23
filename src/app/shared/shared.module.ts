import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TrustCssPipe } from './trust-css.pipe';
import { SocialDatePipe } from './social-date.pipe';
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
    SocialDatePipe
  ],
  exports: [
    CommonModule,
    RouterModule,
    TrustCssPipe,
    SocialDatePipe
  ],
  providers: [
    CensorshipKeyword
  ]
})
export class SharedModule { }
