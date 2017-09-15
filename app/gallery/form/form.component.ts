import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';

@Component({
  moduleId: module.id,
  selector: 'app-wallpaper-form',
  styleUrls: ['./form.component.css'],
  templateUrl: './form.component.html'
})

export class GalleryFormComponent implements OnInit, OnDestroy {

  form: FormGroup;

  private subscriptions: Subscription[] = [];

  constructor(private router: Router,
              private formBuilder: FormBuilder
  ) {

  }

  ngOnInit() {

  }

  ngOnDestroy() {

    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  /**
   * Initialize the component
   */
  init() {

    // Initialize the form
    this.initForm();
  }

  initForm() {

    // Initialize form controls
    this.form = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3)]]
    });

    // Initialize form values
    /*this.form.setValue({
      name: this.wallpaper.name
    });*/
  }

  submit() {

    if (this.form.valid) {

      // Redirect
      this.router.navigate(['home']);
    }
  }

  onSubmit() {

    this.submit();
  }
}
