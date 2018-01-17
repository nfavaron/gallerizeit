import { Input } from '@angular/core';
import { IdeaModel } from '@gallerizeit/common';
import { IdeaService } from '@gallerizeit/common';

export class CommonIdeaCardComponent {

  @Input() index: number;
  @Input() idea: IdeaModel;

  constructor(protected ideaService: IdeaService) {

  }

  isAPriority() {

    return this.ideaService.isIdeaAPriority(this.idea);
  }

  addToPriorities() {

    this.ideaService.addIdeaToPriorityList(this.idea);
  }

  removeFromPriority() {

    this.ideaService.removeIdeaFromPriorityList(this.idea);
  }

  onClickAdd() {

    this.addToPriorities();
  }

  onClickRemove() {

    this.removeFromPriority();
  }

}
