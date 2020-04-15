import {BrowserModule} from '@angular/platform-browser';
import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {ImageCropperModule} from 'ngx-image-cropper';
import {FileUploader, FileUploadModule} from 'ng2-file-upload';
import {HttpClientModule} from '@angular/common/http';
import { ImageCropperComponent } from './components/image-cropper/image-cropper.component';
import {RouterModule} from '@angular/router';

@NgModule({
  declarations: [
    AppComponent,
    ImageCropperComponent
  ],
  imports: [
    BrowserModule,
    RouterModule,
    AppRoutingModule,
    ImageCropperModule,
    FileUploadModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppModule {
}
