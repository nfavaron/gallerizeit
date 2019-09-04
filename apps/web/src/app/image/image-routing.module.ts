import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ImageSerpComponent } from './serp/image-serp.component';

const routes: Routes = [
  { path: '', component: ImageSerpComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ImageRoutingModule {}
