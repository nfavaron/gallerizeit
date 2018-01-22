import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomePageComponent } from './home';
import { ComponentsModule } from '../../components/components.module';
import { SharedModule } from '@gallerizeit/common';

@NgModule({
  declarations: [
    HomePageComponent,
  ],
  imports: [
    IonicPageModule.forChild(HomePageComponent),
    SharedModule,
    ComponentsModule,
  ],
})
export class HomePageModule {}
