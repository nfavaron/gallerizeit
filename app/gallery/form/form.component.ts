import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { FormControl } from '@angular/forms';
import { FormArray } from '@angular/forms';

@Component({
  moduleId: module.id,
  selector: 'app-gallery-form',
  styleUrls: ['./form.component.css'],
  templateUrl: './form.component.html'
})

export class GalleryFormComponent implements OnInit, OnDestroy {

  /**
   * Form definition
   */
  form: FormGroup;

  /**
   * Is the form open ?
   */
  isOpen: boolean = false;

  /**
   * Maximum number of URL inputs
   */
  maxUrlInput: number = 3;

  /**
   * Observable subscriptions
   */
  private subscriptions: Subscription[] = [];

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

    // Add one URL input by default
    this.addUrlInput();
  }

  /**
   * Destroyed the component
   */
  ngOnDestroy() {

    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  /**
   * Add an URL input to the form
   */
  addUrlInput() {

    const inputs = (<FormArray>this.form.get('url'));

    if (inputs.length < this.maxUrlInput) {

      (<FormArray>this.form.get('url')).push(new FormControl());
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

    if (this.form.valid) {



      console.log('submit', this.form.getRawValue());
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
   * Clicked the add button (TODO: remove in favour of dynaic add)
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
