import { Component, Injector } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ComponentAbstract, MessageSeverity } from '@shared-sm';
import { MatDialog } from '@angular/material/dialog';
import * as moment from 'moment';
import { finalize, takeUntil } from 'rxjs/operators';
import { TOAST_DEFAULT_CONFIG } from 'src/app/public/constants';
import { ModuleKeys } from 'src/app/public/module-permission.utils';
import ErrorUtils from 'src/app/shared/utils/ErrorUtils';
import {
  COLUMS,
  CREATION_DATE_TIME,
  TO_CREATION_DATE_TIME,
  FILE_NAME, STATUS_FORM
} from './modal/constant';
import {HttpResponse} from "@angular/common/http";
import {FileService} from "../service/FileService";
import { FilePreviewDialogComponent } from './file-preview-dialog.component';

@Component({
  selector: 'app-file',
  templateUrl: './file-management.component.html',
  styleUrls: ['./file-management.component.scss']
})
export class FileManagementComponent extends ComponentAbstract {

  displayedColumns = COLUMS;

  $fileName = FILE_NAME();
  $creationDateTime = CREATION_DATE_TIME();
  $toCreationDateTime = TO_CREATION_DATE_TIME();
  hasDataSource = false;
  requestParams: any

  constructor(
    protected injector: Injector,
    private fileManagementService: FileService,
    public dialog: MatDialog
  ) {
    super(injector);
  }

  protected componentInit(): void {
    this.enableActions(ModuleKeys.file);
    this.form = this.itemControl.toFormGroup([
      this.$fileName,
      this.$creationDateTime,
      this.$toCreationDateTime,
    ]);
    this.search();
  }


  search() {
    const params = Object.assign(
      {},
      Object.entries(this.form.value).reduce((acc, [key, value]) => {
        if (key === 'toDate' || key === 'endDate') {
          const rawDate = this.form.get(key)?.value;
          if (rawDate) {
            const date = moment(rawDate).startOf('day').format('YYYY-MM-DD');
            acc[key] = date;
          } else {
            acc[key] = null;
          }
        } else {
            acc[key] = typeof value === 'string' && value.trim() !== '' ? value.trim() : null;
        }
        return acc;
      }, {})
    );

    this.options = {
      params: {
        ...params,
      }
    };
    this.requestParams = {
      page: this.pageIndex,
      pageSize: this.pageSize,
    }

    this.dformPagination.goto(this.pageSize, this.pageIndex);
  }

  QueryData() {
    this.indicator.showActivityIndicator();
    this.fileManagementService.queryFile(this.options.params, this.requestParams).pipe(
      takeUntil(this.ngUnsubscribe),
      finalize(() => this.indicator.hideActivityIndicator())
    ).subscribe((res) => {
      // Gọi API thành công và có data trả về
      if (res && res.status === 200) {
        this.hasDataSource = true;
        const page = this.pageIndex * this.pageSize;
        const data = res.data.files.map((obj, index) => {
          obj.stt = page + index + 1;
          return obj;
        });

        this.dataSource = new MatTableDataSource(data);
        this.totalItem = res.data.total;
      } else {
        this.hasDataSource = false;
        this.totalItem = 0;
        this.toastr.showToastr(
          res.soaErrorDesc ? res.soaErrorDesc : 'Lỗi hệ thống.',
          'Thông báo!',
          MessageSeverity.error,
          TOAST_DEFAULT_CONFIG
        )
      }
      this.dataSource.sort = this.sort;
    }, error => {
      console.log('error');
      this.hasDataSource = false;
      const messageError = ErrorUtils.getErrorMessage(error);
      this.toastr.showToastr(
        messageError.join('\n'),
        'Thông báo!',
        MessageSeverity.error,
        TOAST_DEFAULT_CONFIG
      )
    });
  }




  changePageIndex($event) {
    this.pageSize = $event.pageSize;
    this.pageIndex = $event.pageIndex;
    this.options = {
      params: {
        ...this.options.params,
      }
    };
    this.requestParams = {
      page: this.pageIndex,
      size: this.pageSize,
    }
    this.QueryData();
  }

  resetFormSearch() {
    this.form.reset();
  }


  downloadFile(element) {

    this.indicator.showActivityIndicator()
    this.fileManagementService.downLoadFile(element.id).pipe(
      finalize(() => {
        this.indicator.hideActivityIndicator()
      }),
      takeUntil(this.ngUnsubscribe)
    ).subscribe({
      next: (res) => {
        if (res instanceof HttpResponse) {
          const blob = new Blob([res.body], { type: res.headers.get('Content-Type') });
          let url = window.URL.createObjectURL(blob);
          var a = document.createElement("a");
          a.href = url;
          a.download = element.fileName;
          a.click();
          window.URL.revokeObjectURL(url);
        }
      },
      error: (err) => {
        const messsageError = ErrorUtils.getErrorMessage(err);
        this.toastr.showToastr(
          messsageError.join('\n'),
          'Thông báo!',
          MessageSeverity.error,
          TOAST_DEFAULT_CONFIG
        );
      }
    })
  }
  getLabel($state) {
    const status = STATUS_FORM.find((item) => item.key === $state);
    return `<label class="wf-status ${status.class}">${status.value}</label>`;
  }

  previewFile(element) {
    this.indicator.showActivityIndicator();
    this.fileManagementService.downLoadFile(element.id).pipe(
      finalize(() => {
        this.indicator.hideActivityIndicator();
      }),
      takeUntil(this.ngUnsubscribe)
    ).subscribe({
      next: (res) => {
        if (res instanceof HttpResponse) {
          const blob = new Blob([res.body], { type: res.headers.get('Content-Type') });
          const fileUrl = window.URL.createObjectURL(blob);
          const fileType = this.getFileType(element.mineType || res.headers.get('Content-Type'));
          
          this.openFilePreviewDialog(element.fileName, fileUrl, fileType, blob);
        }
      },
      error: (err) => {
        const messageError = ErrorUtils.getErrorMessage(err);
        this.toastr.showToastr(
          messageError.join('\n'),
          'Thông báo!',
          MessageSeverity.error,
          TOAST_DEFAULT_CONFIG
        );
      }
    });
  }

  private getFileType(mimeType: string): string {
    if (!mimeType) return 'unknown';
    
    if (mimeType.includes('pdf')) return 'pdf';
    if (mimeType.includes('image/')) return 'image';
    if (mimeType.includes('text/')) return 'text';
    if (mimeType.includes('application/json')) return 'json';
    if (mimeType.includes('application/xml') || mimeType.includes('text/xml')) return 'xml';
    if (mimeType.includes('application/vnd.ms-excel') || mimeType.includes('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')) return 'excel';
    if (mimeType.includes('application/vnd.ms-powerpoint') || mimeType.includes('application/vnd.openxmlformats-officedocument.presentationml.presentation')) return 'powerpoint';
    if (mimeType.includes('application/msword') || mimeType.includes('application/vnd.openxmlformats-officedocument.wordprocessingml.document')) return 'word';
    
    return 'unknown';
  }

  private openFilePreviewDialog(fileName: string, fileUrl: string, fileType: string, blob: Blob) {
    const dialogRef = this.dialog.open(FilePreviewDialogComponent, {
      width: '90vw',
      height: '90vh',
      maxWidth: '1200px',
      maxHeight: '800px',
      data: {
        fileName: fileName,
        fileUrl: fileUrl,
        fileType: fileType,
        blob: blob
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      // Clean up the object URL when dialog is closed
      if (fileUrl) {
        window.URL.revokeObjectURL(fileUrl);
      }
    });
  }
}
