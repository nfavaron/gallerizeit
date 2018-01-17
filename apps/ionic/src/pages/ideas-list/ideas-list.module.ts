import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { IdeasListPageComponent } from './ideas-list';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    IdeasListPageComponent,
  ],
  imports: [
    IonicPageModule.forChild(IdeasListPageComponent),
    ComponentsModule
  ],
})
export class IdeasListPageModule {}
