import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { Photo } from '@capacitor/camera';
import { BehaviorSubject } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';

export interface Greeting {
  id?: number;
  text: string;
  email: string;
  videoFile?: any;
  videoBuffer?: Blob;
  createdAt?: string;
}
export const TABLE_GREETINGS = 'greetings';
export const BUCKET_VIDEOS = 'videos';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private greetings: BehaviorSubject<Greeting[]> = new BehaviorSubject<
    Greeting[]
  >([]);

  private supabase: SupabaseClient;

  constructor(private sanitizer: DomSanitizer) {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );

    this.loadGreetings();
  }

  async loadGreetings(offset = 0) {
    const result = await this.supabase
      .from(TABLE_GREETINGS)
      .select('*')
      .range(offset, offset + 5)
      .order('createdAt');

    let videos = result.data || [];
    videos = videos.map((video) => {
      video.videoFile = this.downloadVideo(video.video);
      return video;
    });
    console.log('MY files: ', videos);

    this.greetings.next(videos);
  }

  async downloadVideo(filename: string) {
    const { data, error } = await this.supabase.storage
      .from(BUCKET_VIDEOS)
      .download(`${filename}`);

    console.log(data);

    const result = URL.createObjectURL(data!);
    console.log('return data: ', result);
    return this.sanitizer.bypassSecurityTrustUrl(result);
    result;
  }

  async addGreeting(greeting: Greeting) {
    const uploadResult = await this.uploadVideo(
      greeting.videoBuffer!,
      greeting.email
    );

    return this.supabase.from(TABLE_GREETINGS).insert([
      {
        text: greeting.text,
        email: greeting.email,
        video: uploadResult?.path,
      },
    ]);
  }

  async uploadVideo(blob: Blob, email: string) {
    const file = new File([blob], 'myfile', {
      type: blob.type,
    });

    const time = new Date().getTime();
    const fileName = `${email}-${Math.random() * 100}-${time}.webm`;

    // Upload the file to Supabase
    const { data, error } = await this.supabase.storage
      .from(BUCKET_VIDEOS)
      .upload(fileName, file);

    return data;
  }

  getGreetings() {
    return this.greetings.asObservable();
  }
}
