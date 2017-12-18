import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [

  // SERP
  {
    path: 'browse',
    loadChildren: 'app/image/image.module#ImageModule'
  },

  // Home
  {
    path: '',
    loadChildren: 'app/site/site.module#SiteModule',
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
