import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HomePageComponent } from '../home/home';
import { SitePopularPageComponent } from '../site-popular/site-popular';
import { SiteUpdatePageComponent } from '../site-update/site-update';

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

  homePage = HomePageComponent;
  sitePopularPage = SitePopularPageComponent;
  siteUpdatePage = SiteUpdatePageComponent;

  /**
   *
   * @param navCtrl
   * @param navParams
   */
  constructor(public navCtrl: NavController, public navParams: NavParams) {

  }
}
