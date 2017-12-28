import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, FormArray } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { SettingsService } from './settings.service';
import { SettingsStateEnum } from './settings-state.enum';

@Component({
  selector: 'app-core-settings',
  styleUrls: ['./core-settings.component.css'],
  templateUrl: './core-settings.component.html'
})
export class CoreSettingsComponent implements OnInit, OnDestroy {

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
   * @param settingsService
   */
  constructor(private router: Router,
              private formBuilder: FormBuilder,
              private settingsService: SettingsService) {

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

    // Set settings state
    this.subscriptions.push(
      this.settingsService.setState$.subscribe(state => this.onSetStateSettings(state))
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
   * Set settings state
   *
   * @param state
   */
  onSetStateSettings(state: SettingsStateEnum) {

    if (state === SettingsStateEnum.open) {

      return this.open();
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
