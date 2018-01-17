import { IdeaModel } from '@gallerizeit/common';

export class IdeaService {
  private ideas: IdeaModel[] = [];
  private priorityList: IdeaModel[] = [];

  addIdea(title: string, content: string) {
    this.ideas.push(new IdeaModel(title, content));
  }

  getIdeas() {
    return this.ideas.slice();
  }

  removeIdea(index: number) {
    this.ideas.splice(index, 1);
  }

  addIdeaToPriorityList(idea: IdeaModel) {
    this.priorityList.push(idea);
  }

  removeIdeaFromPriorityList(idea: IdeaModel) {

    const index = this.priorityList.findIndex((id: IdeaModel) => {
      return id === idea;
    });

    this.priorityList.splice(index, 1);
  }

  getPriorityList() {
    // Get a copy of the priority list array.
    return this.priorityList.slice();
  }

  isIdeaAPriority(idea: IdeaModel) {
    return this.priorityList.find((id: IdeaModel) => {
      return id === idea;
    });
  }
}
