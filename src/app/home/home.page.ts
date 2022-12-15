import { AfterViewInit, Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import Snowflakes from 'magic-snowflakes';
import { SupabaseService } from '../services/supabase.service';

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

  constructor(
    private fb: FormBuilder,
    private supabaseService: SupabaseService
  ) {}

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

  async captureVideo() {
    const video = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      source: CameraSource.Photos,
      resultType: CameraResultType.Uri,
    });
    console.log(
      '🚀 ~ file: home.page.ts:41 ~ HomePage ~ captureVideo ~ video',
      video
    );
    const result = await this.supabaseService.uploadVideo(video);
    console.log('IM DONE: ', result);
  }
}
