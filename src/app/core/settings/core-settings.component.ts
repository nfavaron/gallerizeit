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
   * Original list of URLs before opening the settings
   */
  urlListOriginal: string[] = [];

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
   * Initialized component
   */
  ngOnInit() {

    // Reset form
    this.reset();

    // Add one URL input by default
    this.add('');

    // Set settings state
    this.subscriptions.push(
      this.settingsService.setState$.subscribe(state => this.onSetStateSettings(state))
    );

    // Set settings URL list
    this.subscriptions.push(
      this.settingsService.setUrlList$.subscribe(urlList => this.onSetUrlListSettings(urlList))
    );
  }

  /**
   * Destroyed component
   */
  ngOnDestroy() {

    // Unsubscribe from observables
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  /**
   * Initialize form from URL list
   *
   * @param urlList
   */
  initForm(urlList: string[]) {

    // Reset form
    this.reset();

    // No URL list
    if (urlList.length === 0) {

      // Add default input
      this.add('');

      return;
    }

    // Generate new list of URL inputs
    urlList.forEach(url => this.add(url));
  }

  /**
   * Reset form
   */
  reset(): void {

    // Initialize form controls
    this.form = this.formBuilder.group({
      url: this.formBuilder.array([])
    });

    this.urlInputList = <FormArray>this.form.get('url');
  }

  /**
   * Add an URL input to the form
   *
   * @param url
   */
  add(url: string) {

    if (this.urlInputList.length < this.maxUrlInput) {

      const input = new FormControl();

      input.setValue(url);

      this.urlInputList.push(input);
    }
  }

  /**
   * Open the form
   */
  open() {

    this.isOpen = true;

    this.settingsService.setState(SettingsStateEnum.open);
  }

  /**
   * Close the form
   */
  close() {

    this.isOpen = false;

    this.settingsService.setState(SettingsStateEnum.close);
  }

  /**
   * Submit the form
   */
  submit() {

    // Form is valid
    if (this.form.valid) {

      // Redirect to SERP page
      this
        .router
        .navigate(['/browse'], { queryParams: {
          url: this.form.get('url').value
        }})
      ;
    }
  }

  /**
   * Cancel the form modifications
   */
  cancel() {

    // Restore form to original URL list
    this.initForm(this.urlListOriginal);
  }

  /**
   * Clicked the overlay
   */
  onClickOverlay() {

    this.cancel();
    this.close();
  }

  /**
   * Clicked the cancel button
   */
  onClickCancel() {

    this.cancel();
    this.close();
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

  /**
   * Set settings state
   *
   * @param state
   */
  onSetStateSettings(state: SettingsStateEnum) {

    // Request for settings
    if (state === SettingsStateEnum.request) {

      return this.open();
    }
  }

  /**
   * Set settings URL list
   *
   * @param urlList
   */
  onSetUrlListSettings(urlList: string[]): void {

    // Backup original URL list
    this.urlListOriginal = urlList;

    // Initialize form
    this.initForm(urlList);
  }
}
