import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TabsPageComponent } from './tabs';

@NgModule({
  declarations: [
    TabsPageComponent,
  ],
  imports: [
    IonicPageModule.forChild(TabsPageComponent),
  ],
})
export class TabsPageModule {}
