import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, FormArray } from '@angular/forms';
import { SettingsService } from './settings.service';
import { SettingsStateEnum } from './settings-state.enum';
import { SettingsFormInterface } from './settings-form.interface';

@Component({
  selector: 'app-core-settings',
  styleUrls: ['./core-settings.component.css'],
  templateUrl: './core-settings.component.html'
})
export class CoreSettingsComponent implements OnInit {

  /**
   * Form definition
   */
  form: FormGroup;

  /**
   * List of URL inputs
   */
  urlInputList: FormArray;

  /**
   * Maximum number of URL inputs
   */
  urlInputMax: number = 3;

  /**
   * Number of active URL inputs
   */
  urlInputCount: number = 1;

  /**
   * Original list of URLs before opening the settings
   */
  urlListOriginal: string[] = [];

  /**
   * Is the form open ?
   */
  isOpen: boolean = false;

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

    // Initialize form controls
    this.form = this.formBuilder.group({
      url: this.formBuilder.array([])
    });

    this.urlInputList = <FormArray>this.form.get('url');

    for(let i=0; i<this.urlInputMax; i++) {

      // Set default input values
      const input = new FormControl();
      input.setValue('');

      this.urlInputList.push(input);
    }

    // Set settings state
    this.settingsService.setState$.subscribe(state => this.onSetStateSettings(state));

    // Set settings URL list
    this.settingsService.setUrlList$.subscribe(urlList => this.onSetUrlListSettings(urlList));

    // Change form value
    this.form.valueChanges.subscribe(form => this.onChangeForm(form));
  }

  /**
   * Set URL input values
   *
   * @param urlList
   */
  setInputValues(urlList: string[]) {

    // Update input count (always counting one additional empty input)
    this.urlInputCount = urlList.length + 1 < this.urlInputMax ? urlList.length + 1 : this.urlInputMax;

    // Always set max number of inputs
    for(let i=0; i<this.urlInputMax; i++) {

      // Set input value if different
      this.urlInputList.at(i).setValue(urlList[i] || '');
    }
  }

  /**
   * Open the form
   */
  open() {

    // Set URL input values
    this.setInputValues(this.urlListOriginal);

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
          url: this.form.get('url').value.filter(url => !!url)
        }})
      ;
    }
  }

  /**
   * Cancel the form modifications
   */
  cancel() {

    // Restore form to original URL list
    this.setInputValues(this.urlListOriginal);
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

    // Backup original URL list (clone it)
    this.urlListOriginal = urlList.slice(0);
  }

  /**
   * Changed form value
   *
   * @param form
   */
  onChangeForm(form: SettingsFormInterface) {

    // Input with value
    const urlList = form.url
      .map(url => (url || '').trim())
      .filter(url => !!url)
    ;

    // Same amount of inputs or max reached
    if (urlList.length + 1 === this.urlInputCount || urlList.length === this.urlInputMax) {
      return;
    }

    // Set new URL input values
    this.setInputValues(urlList);
  }
}
