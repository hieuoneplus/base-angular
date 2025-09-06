import { Component, Injector, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ComponentAbstract } from '@shared-sm';

export interface FileInfoDialogData {
  fileName: string;
  fileInfo: string;
}

@Component({
  selector: 'app-file-info-dialog',
  templateUrl: './file-info-dialog.component.html',
  styleUrls: ['./file-info-dialog.component.scss']
})
export class FileInfoDialogComponent extends ComponentAbstract {
  
  sensitiveDataItems: any[] = [];
  fileName: string = '';

  constructor(
    protected injector: Injector,
    public dialogRef: MatDialogRef<FileInfoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: FileInfoDialogData
  ) {
    super(injector);
  }

  protected componentInit(): void {
    this.fileName = this.data.fileName || 'Unknown File';
    this.parseFileInfo(this.data.fileInfo);
  }

  private parseFileInfo(fileInfo: string): void {
    if (!fileInfo) {
      this.sensitiveDataItems = [];
      return;
    }

    try {
      const parsedData = JSON.parse(fileInfo);
      if (Array.isArray(parsedData)) {
        this.sensitiveDataItems = parsedData.map((item, index) => ({
          index: index + 1,
          sensitiveData: item.sensitiveData || '',
          position: item.position || '',
          id: `item-${index}`
        }));
      } else {
        this.sensitiveDataItems = [];
      }
    } catch (error) {
      console.error('Error parsing fileInfo JSON:', error);
      this.sensitiveDataItems = [];
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }

  getTotalCount(): number {
    return this.sensitiveDataItems.length;
  }

  trackByIndex(index: number, item: any): any {
    return item.id || index;
  }
}
