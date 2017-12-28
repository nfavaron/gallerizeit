import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, FormArray } from '@angular/forms';
import { HeaderService } from '../header/header.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-core-form',
  styleUrls: ['./core-form.component.css'],
  templateUrl: './core-form.component.html'
})
export class CoreFormComponent implements OnInit, OnDestroy {

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
   * Observable subscriptions
   */
  private subscriptions: Subscription[] = [];

  /**
   *
   * @param router
   * @param formBuilder
   * @param headerService
   */
  constructor(private router: Router,
              private formBuilder: FormBuilder,
              private headerService: HeaderService
  ) {

  }

  /**
   * Initialize the component
   */
  ngOnInit() {

    // Initialize form controls
    this.form = this.formBuilder.group({
      url: this.formBuilder.array([])
    });

    this.urlInputList = <FormArray>this.form.get('url');

    // Add one URL input by default
    this.addUrlInput();

    // Open the form on request from header
    this.subscriptions.push(
      this.headerService.siteSettings$.subscribe(() => this.open())
    );
  }

  ngOnDestroy() {

    this.subscriptions.forEach(subscription => subscription.unsubscribe());
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
   * Clicked the overlay
   */
  onClickOverlay() {

    this.close();
  }

  /**
   * Clicked the add button
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
