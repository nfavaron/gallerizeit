import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CoreHomeComponent } from './core/home/home.component';
import { GallerySerpComponent } from './gallery/serp/serp.component';

const routes: Routes = [

  // SERP
  {
    path: 'browse',
    component: GallerySerpComponent
  },

  // Home (for redirection)
  {
    path: 'home',
    redirectTo: '',
    pathMatch: 'full'
  },

  // Default
  {
    path: '',
    component: CoreHomeComponent,
    pathMatch: 'full'
  },

  // Not found
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule {

}
