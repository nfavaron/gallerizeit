import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { TrustCssPipe } from './trust-css.pipe';
import { SocialDatePipe } from './social-date.pipe';
import { CensorshipKeyword } from './censorship/censorship-keyword';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  declarations: [
    TrustCssPipe,
    SocialDatePipe
  ],
  exports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    TrustCssPipe,
    SocialDatePipe
  ],
  providers: [
    CensorshipKeyword
  ]
})
export class SharedModule { }
