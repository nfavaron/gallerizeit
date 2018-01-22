import { NgModule } from '@angular/core';
import { SiteCardComponent } from './site-card/site-card';
import { IonicModule } from 'ionic-angular';

@NgModule({
  declarations: [SiteCardComponent],
  imports: [
    IonicModule.forRoot(SiteCardComponent),
  ],
  exports: [SiteCardComponent]
})
export class ComponentsModule {}
