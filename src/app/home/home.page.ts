import { AfterViewInit, Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import Snowflakes from 'magic-snowflakes';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements AfterViewInit {
  greetingsForm = this.fb.nonNullable.group({
    greetings: ['', Validators.required],
    email: ['', [Validators.email, Validators.required]],
  });
  snowflakes!: Snowflakes;

  constructor(private fb: FormBuilder) {}

  ngAfterViewInit() {
    this.startSnow();
  }

  startSnow() {
    this.snowflakes = new Snowflakes({
      color: '#fff',
    });
  }

  submit() {
    const { greetings } = this.greetingsForm.getRawValue();
  }

  selectImage() {}
}
