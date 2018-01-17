import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PrioritiesListPageComponent } from './priorities-list';

@NgModule({
  declarations: [
    PrioritiesListPageComponent,
  ],
  imports: [
    IonicPageModule.forChild(PrioritiesListPageComponent),
  ],
})
export class PrioritiesListPageModule {}
