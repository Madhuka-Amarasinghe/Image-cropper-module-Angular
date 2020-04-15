import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ImageCropperComponent} from './components/image-cropper/image-cropper.component';


const routes: Routes = [
  {
    path: '',
    component: ImageCropperComponent
  },
  {
    path: 'ImageCropperComponent',
    component: ImageCropperComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
