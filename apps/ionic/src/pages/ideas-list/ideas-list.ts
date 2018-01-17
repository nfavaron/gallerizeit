import { Component, OnInit } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { NgForm } from '@angular/forms';
import { IdeaModel } from '@gallerizeit/common';
import { IdeaService } from '@gallerizeit/common';

@IonicPage()
@Component({
  selector: 'app-page-ideas-list',
  templateUrl: 'ideas-list.html',
})
export class IdeasListPageComponent implements OnInit {
  ideas: IdeaModel[];

  constructor(private ideaService: IdeaService) {}

  ngOnInit() {
    console.log('ngOnInit');
    this.getIdeas();
  }

  createIdea(form: NgForm) {
    this.ideaService.addIdea(form.value.title, form.value.content);
    form.reset();
    this.getIdeas();
  }

  private getIdeas() {
    this.ideas = this.ideaService.getIdeas();
  }
}
