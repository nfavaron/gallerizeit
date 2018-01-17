import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { IdeaModel } from '@gallerizeit/common';
import { IdeaService } from '@gallerizeit/common';

@IonicPage()
@Component({
  selector: 'app-page-priorities-list',
  templateUrl: 'priorities-list.html',
})
export class PrioritiesListPageComponent {
  priorityList: IdeaModel[];

  constructor(private ideaService: IdeaService) {
  }

  ionViewWillEnter() {
    this.getPriorityList();
  }

  getPriorityList() {
    this.priorityList = this.ideaService.getPriorityList();
  }

  removeFromPriorityList(idea: IdeaModel) {
    this.ideaService.removeIdeaFromPriorityList(idea);
    this.getPriorityList();
  }
}
