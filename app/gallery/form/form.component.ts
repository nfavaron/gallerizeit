import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { FormArray } from '@angular/forms';

@Component({
  moduleId: module.id,
  selector: 'app-gallery-form',
  styleUrls: ['./form.component.css'],
  templateUrl: './form.component.html'
})

export class GalleryFormComponent implements OnInit {

  /**
   * Form definition
   */
  form: FormGroup;

  /**
   * List of URL inputs
   */
  urlInputList: FormArray;

  /**
   * Is the form open ?
   */
  isOpen: boolean = false;

  /**
   * Maximum number of URL inputs
   */
  maxUrlInput: number = 3;

  /**
   *
   * @param router
   * @param formBuilder
   */
  constructor(private router: Router,
              private formBuilder: FormBuilder
  ) {

  }

  /**
   * Initialized the component
   */
  ngOnInit() {

    // Initialize form controls
    this.form = this.formBuilder.group({
      url: this.formBuilder.array([])
    });

    this.urlInputList = <FormArray>this.form.get('url');

    // Add one URL input by default
    this.addUrlInput();
  }

  /**
   * Add an URL input to the form
   */
  addUrlInput() {

    if (this.urlInputList.length < this.maxUrlInput) {

      this.urlInputList.push(new FormControl());
    }
  }

  /**
   * Open the form
   */
  open() {

    this.isOpen = true;
  }

  /**
   * Close the form
   */
  close() {

    this.isOpen = false;
  }

  /**
   * Submit the form
   */
  submit() {

    // Form is valid
    if (this.form.valid) {

      // Redirect to SERP page
      this.router.navigate(['/browse'], { queryParams: {
        url: this.form.get('url').value
      }});
    }
  }

  /**
   * Clicked the start button
   */
  onClickStart() {

    this.open();
  }

  /**
   * Clicked the overlay
   */
  onClickOverlay() {

    this.close();
  }

  /**
   * Clicked the add button (TODO: remove in favour of dynamic add)
   */
  onClickAdd() {

    this.addUrlInput();
  }

  /**
   * Clicked the submit button
   */
  onClickSubmit() {

    this.submit();
    this.close();
  }

  /**
   * Submitted the form
   */
  onSubmit() {

    this.submit();
    this.close();
  }
}
