import { Component, ElementRef, Injector, OnInit, ViewChild } from '@angular/core';
import { ComponentAbstract, MessageSeverity } from '@shared-sm';
import { MatDialogRef } from '@angular/material/dialog';
import { interval, Subscription } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { TOAST_DEFAULT_CONFIG } from 'src/app/public/constants';
import { FileHandle } from 'src/app/shared/directives/dragDrop.directive';
import ErrorUtils from 'src/app/shared/utils/ErrorUtils';
import { FileService } from '../service/FileService';

@Component({
  selector: 'app-file-upload-dialog',
  templateUrl: './file-upload-dialog.component.html',
  styleUrls: ['./file-upload-dialog.component.scss']
})
export class FileUploadDialogComponent extends ComponentAbstract implements OnInit {

  @ViewChild('file') myInputVariable: ElementRef;
  percent = 0;
  selectedFiles: File;
  subscribe_interval: Subscription;

  constructor(
    protected injector: Injector,
    private fileService: FileService,
    public dialogRef: MatDialogRef<FileUploadDialogComponent>
  ) {
    super(injector);
  }

  ngOnInit(): void {
    // Initialize component
  }

  protected componentInit(): void {
    // Initialize component
  }

  handleFileInput(event) {
    const lengthListFile = event.target.files.length;
    if (lengthListFile) {
      const fileName = (<File>event.target.files[0])?.name;
      // Support multiple file types for file management upload
      const allowedExtensions = ['.xlsx', '.xls', '.pdf', '.doc', '.docx', '.txt', '.csv', '.jpg', '.jpeg', '.png', '.gif'];
      const hasValidExtension = allowedExtensions.some(ext => fileName.toLowerCase().includes(ext));
      
      if (!hasValidExtension) {
        this.toastr.showToastr('Vui lòng chọn đúng định dạng file (xlsx, xls, pdf, doc, docx, txt, csv, jpg, jpeg, png, gif)', 'Thông báo!', MessageSeverity.error, TOAST_DEFAULT_CONFIG);
        return;
      }
      this.percent = 0;
      this.selectedFiles = <File>event.target.files[0];
    }
  }

  dragFileInput(files: FileHandle[]): void {
    const file = [files[0].file];
    if (file && file.length > 1) {
      this.toastr.showToastr('Chỉ cho phép chọn một file', 'Thông báo!', MessageSeverity.error, TOAST_DEFAULT_CONFIG);
      return;
    }
    if (file && file.length == 1) {
      const fileName = file[0].name;
      // Support multiple file types for file management upload
      const allowedExtensions = ['.xlsx', '.xls', '.pdf', '.doc', '.docx', '.txt', '.csv', '.jpg', '.jpeg', '.png', '.gif'];
      const hasValidExtension = allowedExtensions.some(ext => fileName.toLowerCase().includes(ext));
      
      if (!hasValidExtension) {
        this.toastr.showToastr('Vui lòng chọn đúng định dạng file (xlsx, xls, pdf, doc, docx, txt, csv, jpg, jpeg, png, gif)', 'Thông báo!', MessageSeverity.error, TOAST_DEFAULT_CONFIG);
        return;
      }
      this.percent = 0;
      this.selectedFiles = file[0];
    }
  }

  destroyFile() {
    this.myInputVariable.nativeElement.value = "";
    this.selectedFiles = null;
    this.percent = 0;
  }

  handleUploadFile() {
    if (!this.selectedFiles) {
      this.toastr.showToastr('Bạn chưa chọn file', 'Thông báo!', MessageSeverity.error, TOAST_DEFAULT_CONFIG);
      return;
    }

    this.indicator.showActivityIndicator();
    this.start_process_upload();

    // Use the file upload API
    this.fileService.uploadFile(this.selectedFiles).pipe(
      takeUntil(this.ngUnsubscribe),
      finalize(() => this.indicator.hideActivityIndicator())
    ).subscribe((res: any) => {
      this.end_process_upload(100);
      if (res && res.status === 200) {
        this.toastr.showToastr('Upload file thành công', 'Thông báo!', MessageSeverity.success, TOAST_DEFAULT_CONFIG);
        this.destroyFile();
        // Close dialog and refresh parent component
        this.dialogRef.close(true);
      } else {
        this.end_process_upload(0);
        this.toastr.showToastr(res.soaErrorDesc || 'Upload file không thành công', 'Thông báo!', MessageSeverity.error, TOAST_DEFAULT_CONFIG);
      }
    }, error => {
      this.createBatchError(0);
      this.toastr.showToastr(error?.error?.soaErrorDesc || 'Upload file không thành công', 'Thông báo!', MessageSeverity.error, TOAST_DEFAULT_CONFIG);
    });
  }

  start_process_upload() {
    const timer$ = interval(100);
    this.subscribe_interval = timer$.subscribe(second => {
      this.percent = second;
      if (this.percent === 100) {
        this.subscribe_interval.unsubscribe();
      }
    });
  }

  end_process_upload(percent) {
    this.percent = percent;
    this.subscribe_interval.unsubscribe();
  }

  createBatchError(percent) {
    this.end_process_upload(percent);
    this.myInputVariable.nativeElement.value = "";
  }

  onCancel() {
    this.dialogRef.close(false);
  }
}
