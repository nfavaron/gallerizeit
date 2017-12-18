import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.css']
})
export class ImageComponent implements OnChanges {

  @Input() src: string;

  isLoading = true;
  isError = false;

  ngOnChanges(changes: SimpleChanges) {

    // Image src has been changed
    if (!!changes['src']) {

      this.load();
    }
  }

  /**
   * Load image asynchronously
   */
  private load() {

    this.isLoading = true;
    this.isError = false;

    const img = new Image();

    img.addEventListener('load', () => this.isLoading = false);

    img.addEventListener('error', () => {

      this.isError = true;
      this.isLoading = false;
    });

    if (this.src) {

      img.src = this.src;
    }
  }
}
