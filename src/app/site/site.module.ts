import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { SiteRoutingModule } from './site-routing.module';
import { SiteListComponent } from './list/site-list.component';
import { SiteHomeComponent } from './home/site-home.component';

@NgModule({
  imports: [
    SharedModule,
    SiteRoutingModule
  ],
  declarations: [
    SiteListComponent,
    SiteHomeComponent
  ]
})
export class SiteModule { }
