import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { LoadingController, ToastController } from '@ionic/angular';
import Snowflakes from 'magic-snowflakes';
import { Observable } from 'rxjs';
import { Greeting, SupabaseService } from '../services/supabase.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements AfterViewInit {
  @ViewChild('video') captureElement!: ElementRef;
  mediaRecorder!: MediaRecorder;

  greetingsForm = this.fb.nonNullable.group({
    greetings: ['', Validators.required],
    email: ['', [Validators.email, Validators.required]],
  });
  snowflakes!: Snowflakes;
  isRecording = false;
  videoBlob?: Blob;
  greetings = this.supabaseService.getGreetings();
  constructor(
    private fb: FormBuilder,
    private supabaseService: SupabaseService,
    private loadingController: LoadingController,
    private toastController: ToastController
  ) {}

  ngAfterViewInit() {
    this.startSnow();
  }

  startSnow() {
    this.snowflakes = new Snowflakes({
      color: '#fff',
    });
  }

  async submit() {
    const { greetings, email } = this.greetingsForm.getRawValue();
    const greeting: Greeting = {
      text: greetings,
      email,
      videoBuffer: this.videoBlob,
    };
    const loading = await this.loadingController.create({
      message: 'Uploading to Santa...',
      duration: 2000,
      spinner: 'bubbles',
    });
    await loading.present();

    const result = await this.supabaseService.addGreeting(greeting);
    loading.dismiss();

    const toast = await this.toastController.create({
      message: 'Thanks for your greetings!',
      duration: 2000,
    });
    toast.present();
  }

  async captureVideo() {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: 'user',
      },
      audio: true,
    });

    // Show the stream inside our video object
    this.captureElement.nativeElement.srcObject = stream;

    var options = { mimeType: 'video/webm' };
    this.mediaRecorder = new MediaRecorder(stream, options);
    let chunks: any[] = [];

    // Store the video on stop
    this.mediaRecorder.onstop = async (event) => {
      this.videoBlob = new Blob(chunks, { type: 'video/webm' });
      console.log('got video: ', this.videoBlob);
      // const result = await this.supabaseService.uploadVideo(videoBuffer);
    };

    // Store chunks of recorded video
    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) {
        chunks.push(event.data);
      }
    };

    // Start recording wth chunks of data
    this.mediaRecorder.start(100);
    this.isRecording = true;
  }

  stopRecording() {
    this.mediaRecorder.stop();
    this.captureElement.nativeElement.srcObject = null;
    this.isRecording = false;
  }

  async capturePhoto() {
    // const video = await Camera.getPhoto({
    //   quality: 90,
    //   allowEditing: true,
    //   source: CameraSource.Photos,
    //   resultType: CameraResultType.Uri,
    // });
    // console.log(
    //   '🚀 ~ file: home.page.ts:41 ~ HomePage ~ captureVideo ~ video',
    //   video
    // );
    // const result = await this.supabaseService.uploadVideo(video);
    // console.log('IM DONE: ', result);
  }
}
