import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SitePopularPageComponent } from './site-popular';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    SitePopularPageComponent,
  ],
  imports: [
    IonicPageModule.forChild(SitePopularPageComponent),
    ComponentsModule
  ],
})
export class SitePopularPageModule {}
