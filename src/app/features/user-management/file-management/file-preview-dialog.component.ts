import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

export interface FilePreviewData {
  fileName: string;
  fileUrl: string;
  fileType: string;
  blob: Blob;
}

@Component({
  selector: 'app-file-preview-dialog',
  templateUrl: './file-preview-dialog.component.html',
  styleUrls: ['./file-preview-dialog.component.scss', './overlay-buttons.scss']
})
export class FilePreviewDialogComponent implements OnInit {
  safeFileUrl: SafeResourceUrl;
  fileContent: string = '';
  isTextFile: boolean = false;
  isImageFile: boolean = false;
  isPdfFile: boolean = false;
  isUnsupportedFile: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<FilePreviewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: FilePreviewData,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.safeFileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.data.fileUrl);
    this.setupFilePreview();
  }

  private setupFilePreview() {
    switch (this.data.fileType) {
      case 'pdf':
        this.isPdfFile = true;
        break;
      case 'image':
        this.isImageFile = true;
        break;
      case 'text':
      case 'json':
      case 'xml':
        this.isTextFile = true;
        this.loadTextContent();
        break;
      default:
        this.isUnsupportedFile = true;
        break;
    }
  }

  private loadTextContent() {
    const reader = new FileReader();
    reader.onload = (e) => {
      this.fileContent = e.target?.result as string;
    };
    reader.readAsText(this.data.blob);
  }

  downloadFile() {
    const link = document.createElement('a');
    link.href = this.data.fileUrl;
    link.download = this.data.fileName;
    link.click();
  }

  closeDialog() {
    this.dialogRef.close();
  }

  getFileIcon(): string {
    switch (this.data.fileType) {
      case 'pdf':
        return 'picture_as_pdf';
      case 'image':
        return 'image';
      case 'text':
        return 'description';
      case 'json':
        return 'code';
      case 'xml':
        return 'code';
      case 'excel':
        return 'table_chart';
      case 'word':
        return 'description';
      case 'powerpoint':
        return 'slideshow';
      default:
        return 'insert_drive_file';
    }
  }
}
