import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomePageComponent } from './home';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    HomePageComponent,
  ],
  imports: [
    IonicPageModule.forChild(HomePageComponent),
    ComponentsModule
  ],
})
export class HomePageModule {}
