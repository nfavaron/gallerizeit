import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SiteUpdatePageComponent } from './site-update';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    SiteUpdatePageComponent,
  ],
  imports: [
    IonicPageModule.forChild(SiteUpdatePageComponent),
    ComponentsModule
  ],
})
export class SiteUpdatePageModule {}
