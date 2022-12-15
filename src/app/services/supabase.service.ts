import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { Photo } from '@capacitor/camera';

export interface Greeting {
  id?: number;
  text: string;
  email: string;
  video: string;
}
export const TABLE_GREETINGS = 'greetings';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );
  }

  async uploadVideo(video: Photo) {
    const blob = await fetch(video.webPath!).then((r) => r.blob());
    const file = new File([blob], 'myfile', {
      type: blob.type,
    });

    const time = new Date().getTime();
    const bucketName = 'videos';
    const fileName = `${Math.random() * 1000}-${time}.webp`;

    // Upload the file to Supabase
    const { data, error } = await this.supabase.storage
      .from(bucketName)
      .upload(fileName, file);

    return data;
  }

  addGreeting(greeting: Greeting) {}
}
