import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SiteHomeComponent } from './home/site-home.component';

const routes: Routes = [
  { path: '', component: SiteHomeComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SiteRoutingModule {}
