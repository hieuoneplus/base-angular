import { Component, Injector, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ComponentAbstract, MessageSeverity } from '@shared-sm';
import { finalize, takeUntil } from 'rxjs/operators';
import { TOAST_DEFAULT_CONFIG } from 'src/app/public/constants';
import { FileService } from '../service/FileService';
import { IShareFileRequest } from './modal/interface';
import { TextboxItem } from '@shared-sm';

export interface FileShareDialogData {
  selectedFileIds: string[];
  selectedFileNames: string[];
}

@Component({
  selector: 'app-file-share-dialog',
  templateUrl: './file-share-dialog.component.html',
  styleUrls: ['./file-share-dialog.component.scss']
})
export class FileShareDialogComponent extends ComponentAbstract implements OnInit {
  
  $username = new TextboxItem({
    key: 'username',
    label: 'Tên người dùng',
    placeholder: 'Nhập tên người dùng',
    value: '',
    required: true
  });

  selectedFileIds: string[] = [];
  selectedFileNames: string[] = [];

  constructor(
    protected injector: Injector,
    private fileService: FileService,
    public dialogRef: MatDialogRef<FileShareDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: FileShareDialogData
  ) {
    super(injector);
  }

  protected componentInit(): void {
    this.selectedFileIds = this.data.selectedFileIds || [];
    this.selectedFileNames = this.data.selectedFileNames || [];
    
    this.form = this.itemControl.toFormGroup([
      this.$username
    ]);
  }

  onShare(): void {
    if (this.form.valid && this.selectedFileIds.length > 0) {
      this.indicator.showActivityIndicator();
      
      const shareRequest: IShareFileRequest = {
        username: this.form.get('username')?.value,
        fileIds: this.selectedFileIds
      };

      this.fileService.shareFile(shareRequest).pipe(
        takeUntil(this.ngUnsubscribe),
        finalize(() => this.indicator.hideActivityIndicator())
      ).subscribe(
        (response) => {
          if (response && response.status === 200) {
            this.toastr.showToastr(
              'Chia sẻ file thành công!',
              'Thông báo!',
              MessageSeverity.success,
              TOAST_DEFAULT_CONFIG
            );
            this.dialogRef.close(true);
          } else {
            this.toastr.showToastr(
              response.soaErrorDesc || 'Có lỗi xảy ra khi chia sẻ file.',
              'Thông báo!',
              MessageSeverity.error,
              TOAST_DEFAULT_CONFIG
            );
          }
        },
        (error) => {
          console.error('Error sharing file:', error);
          this.toastr.showToastr(
            'Có lỗi xảy ra khi chia sẻ file.',
            'Thông báo!',
            MessageSeverity.error,
            TOAST_DEFAULT_CONFIG
          );
        }
      );
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
