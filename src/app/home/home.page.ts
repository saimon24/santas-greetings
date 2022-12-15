import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  greetingsForm = this.fb.group({
    greetings: ['', Validators.required],
  });

  constructor(private fb: FormBuilder) {}

  submit() {}
}
