import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { IdeasListPageComponent } from '../ideas-list/ideas-list';
import { PrioritiesListPageComponent } from '../priorities-list/priorities-list';

/**
 * Generated class for the TabsPageComponent page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'app-page-tabs',
  templateUrl: 'tabs.html',
})
export class TabsPageComponent {

  ideasPage = IdeasListPageComponent;
  prioritiesPage = PrioritiesListPageComponent;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TabsPageComponent');
  }

}
