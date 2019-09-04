import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { TrustCssPipe } from '../pipe/trust-css.pipe';
import { SocialDatePipe } from '../pipe/social-date.pipe';

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

  ]
})
export class SharedModule { }
