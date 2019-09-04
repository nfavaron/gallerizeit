import { NgModule } from '@angular/core';
import { SiteListComponent } from './site-list/site-list';
import { IonicModule } from 'ionic-angular';
import { SharedModule } from '@gallerizeit/common';

@NgModule({
  declarations: [
    SiteListComponent
  ],
  imports: [
    IonicModule.forRoot(SiteListComponent),
    SharedModule
  ],
  exports: [
    SiteListComponent
  ]
})
export class ComponentsModule {}
