import {Component, Inject, Injector} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ComponentAbstract, MessageSeverity} from '@shared-sm';
import {finalize, takeUntil} from 'rxjs/operators';
import ErrorUtils from 'src/app/shared/utils/ErrorUtils';
import {IDetailHistoryConfig} from '../../modal/interface';
import {ProvinceService} from "../../../service/ProvinceService";

@Component({
  selector: 'app-detail-province-history',
  templateUrl: './detail-history.component.html',
  styleUrls: ['./detail-history.component.scss']
})
export class DetailHistoryProvinceComponent extends ComponentAbstract{

  dataHistoryConfig: IDetailHistoryConfig
  private dataLoaded = false;

  constructor(
    protected injector: Injector,
    public dialogRef: MatDialogRef<DetailHistoryProvinceComponent>,
    private provinceService: ProvinceService,
    @Inject(MAT_DIALOG_DATA) private data: any,

  ) {
    super(injector);
   }

   protected componentInit(): void {
    if (!this.dataLoaded) {
      this.getDetailHistoryConfig();
    }
  }

  getDetailHistoryConfig() {
    this.indicator.showActivityIndicator();
    this.provinceService.getDetailHistory(this.data.id).pipe(
      finalize(() => {
        this.indicator.hideActivityIndicator();
      }),
      takeUntil(this.ngUnsubscribe)
    ).subscribe({
      next: (res) => {
        if (res && res.data) {
          this.dataHistoryConfig = res.data
          this.dataLoaded = true;
        }
      },
      error: (err) => {
        this.closeDialog()
        const errMessage = ErrorUtils.getErrorMessage(err)
        this.toastr.showToastr(errMessage.join('\n'), "Thông báo", MessageSeverity.error)
      }
    })
  }

  closeDialog() {
    if (this.dialogRef.close) { this.dialogRef.close(null); }
  }
}
