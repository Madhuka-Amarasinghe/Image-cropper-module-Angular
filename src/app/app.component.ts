import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ImageCroppedEvent} from 'ngx-image-cropper';
import {environment} from '../environments/environment';
import {FileuploadService} from './services/fileupload.service';
import {of, Subscription} from 'rxjs';
import {HttpClient, HttpErrorResponse, HttpEventType, HttpRequest} from '@angular/common/http';
import {catchError, last, map} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app-count';
  imageChangedEvent: any = '';
  croppedImage: any = '';
  uploadedFiles: any [] = [];
  sourceUrl = environment.resourceUrl;
  color3 = '#ebd3f5';
  imagePathCropped: string;

  /** Link text */
  @Input() text = 'Upload';
  /** Name used in form which will be sent in HTTP request. */
  @Input() param = 'file';
  /** Target URL for file uploading. */
  @Input() target = environment.fileService + '/upload/image' + '?size=default';
  /** File extension that accepted, same as 'accept' of <input type="file" />.By the default, it's set to 'image/*'. */
  @Input() accept = 'image/*';
  /** Allow you to add handler after its completion. Bubble up response text from remote. */
  @Output()  completed = new EventEmitter<string>();

  files: Array<FileUploadModel> = [];
  files1: Array<FileUploadModel> = [];

  constructor(private fileuploadService: FileuploadService, private http: HttpClient) {
  }


  // file uploader
  onClick() {
    // const fileUpload = document.getElementById('fileUpload') as HTMLInputElement;
    // fileUpload.onchange = () => {
    //   for (let index = 0; index < fileUpload.files.length; index++) {
    //     const file = fileUpload.files[index];
    //     this.files.push({
    //       data: file, state: 'in',
    //       inProgress: false, progress: 0, canRetry: false, canCancel: true
    //     });
    //   }
    //   this.uploadFiles();
    // };
    // fileUpload.click();

    const file: File = new File([this.dataURItoBlob(this.croppedImage)], 'filename.png');
    this.files.push({
      data: file, state: 'in',
      inProgress: false, progress: 0, canRetry: false, canCancel: true
    });
    console.log(JSON.stringify(this.files));
    this.uploadFiles();
  }

  // cancelFile(file: FileUploadModel) {
  //   file.sub.unsubscribe();
  //   this.removeFileFromArray(file);
  // }

  // cancelFile1(file1: FileUploadModel) {
  //   // file1.sub.unsubscribe();
  //   this.removeFileFromArray1(file1);
  // }

  // private removeFileFromArray1(file: FileUploadModel) {
  //   const index = this.files1.indexOf(file);
  //   if (index > -1) {
  //     this.files1.splice(index, 1);
  //     this.fileuploaderService.deleteImage(file.state).subscribe((result) => {
  //       this.loading();
  //       this.destinationsService.deleteDestinationImage(file.state)
  //         .subscribe((result) => {
  //           if (result) {
  //             Swal.close();
  //             Swal.fire(
  //               'Success!',
  //               'Image Removed successfully!'
  //             );
  //           } else {
  //             Swal.close();
  //             Swal.fire({
  //               type: 'error',
  //               title: 'Oops...',
  //               text: 'Something went wrong!'
  //             });
  //           }
  //         });
  //     });
  //   }
  // }

  retryFile(file: FileUploadModel) {
    this.uploadFile(file);
    file.canRetry = false;
  }

  private uploadFile(file: FileUploadModel) {
    const fd = new FormData();
    fd.append(this.param, file.data);

    const req = new HttpRequest('POST', this.target, fd, {
      reportProgress: true
    });

    file.inProgress = true;
    file.sub = this.http.request(req).pipe(
      map(event => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            file.progress = Math.round(event.loaded * 100 / event.total);
            break;
          case HttpEventType.Response:
            return event;
        }
      }),
      last(),
      catchError((error: HttpErrorResponse) => {
        file.inProgress = false;
        file.canRetry = true;
        return of(`${file.data.name} upload failed.`);
      })
    ).subscribe(
      (event: any) => {
        console.log('hhhhhh' + event);
        if (typeof (event) === 'object') {
          console.log('uuid=' + event.body.state);
          file.state = event.body.state;
          this.imagePathCropped = event.body.state;
          // this.removeFileFromArray(file);    // uncomment to the enable, remove progrees bar after file upload
          this.completed.emit(event.body);
          // this.image = new DestinationImagesDTO();
          // this.image.imagePathId = file.state;
          // this.imagesDto.push(this.image);
          // console.log(this.imagesDto);
        }
      }
    );
  }

  private uploadFiles() {

    const fileUpload = document.getElementById('fileUpload') as HTMLInputElement;
    fileUpload.value = '';

    this.files.forEach(file => {
      this.uploadFile(file);
    });
  }

  // private removeFileFromArray(file: FileUploadModel) {
  //   const index = this.files.indexOf(file);
  //   if (index > -1) {
  //     this.files.splice(index, 1);
  //     console.log('File state  ==' + file.state);
  //     this.fileuploaderService.deleteImage(file.state).subscribe((result) => {
  //       console.log('result' + result);
  //     });
  //
  //   }
  // }


  // onFileComplete(data: any) {
  //   console.log(data); // We just print out data bubbled up from event emitter.
  // }

  // file uploder

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
    console.log(JSON.stringify(this.param));
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
    console.log(JSON.stringify(this.croppedImage));
    console.log(JSON.stringify(event.file));
  }

  imageLoaded() {
    // show cropper
  }

  cropperReady() {
    // cropper ready
  }

  loadImageFailed() {
    // show message
  }

  dataURItoBlob(dataURI): Blob {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], {type: mimeString});
  }

  uploadAttachmentToServer() {
    const fileToUpload: File = new File([this.dataURItoBlob(this.croppedImage)], 'filename.png');
    console.log(fileToUpload);
    // this.fileuploadService.uploadImage(fileToUpload).subscribe(data => {
    //   if (data) {
    //
    //   } else {
    //
    //   }
    // });
  }



  // onUpload(event) {
  //   for (const file of event.files) {
  //     console.log(file);
  //     this.uploadedFiles.push(file);
  //   }
  // }
}

export class FileUploadModel {
  data: File;
  state: string;
  inProgress: boolean;
  progress: number;
  canRetry: boolean;
  canCancel: boolean;
  sub?: Subscription;
}
