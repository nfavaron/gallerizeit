import { NgModule } from '@angular/core';
import { IdeaCardComponent } from './idea-card/idea-card';
import { IonicModule } from 'ionic-angular';

@NgModule({
  declarations: [IdeaCardComponent],
  imports: [
    IonicModule.forRoot(IdeaCardComponent),
  ],
  exports: [IdeaCardComponent]
})
export class ComponentsModule {}
