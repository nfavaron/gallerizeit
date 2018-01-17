import { Component } from '@angular/core';
import { CommonIdeaCardComponent, IdeaService } from '@gallerizeit/common';
import { AlertController } from 'ionic-angular';

@Component({
  selector: 'app-idea-card',
  templateUrl: 'idea-card.html'
})
export class IdeaCardComponent extends CommonIdeaCardComponent {

  constructor(ideaService: IdeaService,
              private alertCtrl: AlertController) {

    super(ideaService);
  }

  addToPriorities() {

    const alert = this.alertCtrl.create({
      title: 'Add to Priority List',
      subTitle: 'Are you sure?',
      message: 'Are you sure you want to add the Idea to your list of priorities?',
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            super.addToPriorities();
          }
        },
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            console.log('Request cancelled');
          }
        }
      ]
    });
    alert.present();
    console.log('add to priority clicked');
  }

}
