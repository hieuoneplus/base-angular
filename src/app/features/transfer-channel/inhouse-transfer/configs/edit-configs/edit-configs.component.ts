import {Component, Inject, Injector} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {DFORM_CONFIRM_STATUS} from 'src/app/public/constants';
import {SELECT_DATE, TIME} from "../constant";
import {ComponentAbstract} from "@shared-sm";
import * as moment from "moment";

@Component({
  selector: 'edit-configs-inhouse',
  templateUrl: './edit-configs.component.html',
  styleUrls: ['./edit-configs.component.scss']
})
export class EditConfigsComponent extends ComponentAbstract {
  confirm!: string;
  isRequired = false;
  characterNumberandTex = /[^A-Za-z0-9 ]/g;
  timeInput: string;
  valid: string;
  timeValue: string;

  $selectDate = SELECT_DATE();
  $time = TIME();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    protected injector: Injector,
    public dialogRef: MatDialogRef<EditConfigsComponent>,
  ) {
    super(injector);
    this.dialogRef.disableClose = true;
  }

  protected componentInit(): void {
    // this.enableActions(ModuleKeys.)
    this.form = this.itemControl.toFormGroup([
      this.$selectDate, this.$time
    ]);
    if(this.data.dateTime) {
      let [date, time] = this.data?.dateTime.split(' ');
      this.form.get("reopenTime").patchValue(moment(date).startOf('day'));
      this.timeInput = time;
      this.form.get("fromTime").patchValue(this.timeInput);

    } else {
    }

    this.trackSelectDate()


  }

  trackSelectDate() {
    this.form.get('reopenTime').valueChanges.subscribe(e => {
      if(this.timeInput === undefined || this.timeInput === "" || e === null) {
        this.valid = undefined
        return
      } else {
        let timeStr = this.timeInput;
        let [hours, minutes, seconds] = timeStr.split(':').map(Number);
        let date = e;
        date.set({
          hour: hours,
          minute: minutes,
          second: seconds,
          millisecond: 0
        });
        let secondsDiff = date.diff(moment(), 'seconds');
        if(date.isBefore(moment(), 'day') || secondsDiff <= 0) {
          this.valid = 'Thời gian nhập phải sau thời gian hiện tại';
        } else {
          this.valid = undefined
        }
      }


    })
  }


  onCancelConfirm() {
    if (!this.confirm && this.data?.description && this.data?.closeBtn != 'btn.cancel') {
      this.isRequired = true;
    } else {
      if (this.dialogRef.close) {
        this.dialogRef.close({ status: DFORM_CONFIRM_STATUS.CANCELED, data: this.confirm});
      }
    }
  }

  onUpdateConfirm() {
    if (!this.confirm && this.data?.description && this.data?.acceptBtn !== 'btn.accept') {
      this.isRequired = true;
    } else {
      if (this.dialogRef.close) {
        if(this.form.get('reopenTime')?.value) {
          if(this.timeInput === null || this.timeInput === '' || this.timeInput === undefined) {
            this.valid = 'Vui lòng nhập thời gian';
          } else {
            let timeStr = this.timeInput;
            let [hours, minutes, seconds] = timeStr.split(':').map(Number);
            let date = this.form.get('reopenTime')?.value;
            date.set({
              hour: hours,
              minute: minutes,
              second: seconds,
              millisecond: 0
            });
            let secondsDiff = date.diff(moment(), 'seconds');
            if (date.isBefore(moment(), 'day') || secondsDiff <= 0) {
              this.valid = 'Thời gian nhập phải sau thời gian hiện tại';
            } else {
              if (Math.abs(secondsDiff) > 86400) {
                this.valid = 'Thời gian bật vượt quá 24 giờ kể từ thời điểm chỉnh sửa. Vui lòng kiểm tra lại';
              } else {
                if (!this.valid) {
                  this.dialogRef.close({
                    status: DFORM_CONFIRM_STATUS.CONFIRMED,
                    data: this.confirm,
                    dateTime: date.format('YYYY-MM-DD HH:mm:ss'),
                    durationSecond: secondsDiff
                  });
                }
              }
            }
          }
        } else {
          if((this.timeInput !== null && this.timeInput !== '' && this.timeInput !== undefined) || (this.form.get('reopenTime')?.invalid && this.data.active)) {
            this.valid = 'Vui lòng nhập thời gian';
          }
          if(!this.valid) {
            this.dialogRef.close({ status: DFORM_CONFIRM_STATUS.CONFIRMED, data: this.confirm, dateTime: null, durationSecond: null });
          }
        }
      }
    }
  }

  closeDialog() {
    if (this.dialogRef.close) { this.dialogRef.close({ status: 0 }); }
  }

  ngModelChange() {
    this.confirm = this.confirm.trim();
  }

  handleTimeChange(timeChange: string) {
    this.timeInput = timeChange;
    if(!this.validateTime(timeChange)) {
      this.valid = undefined;
      return
    } else {
      let timeStrs = this.timeInput;
      let [hourss, minutess, secondss] = timeStrs.split(':').map(Number);
      let time = this.form.get('reopenTime')?.value;
      if(time === null) {
        this.valid = undefined
        return;
      }
      time.set({
        hour: hourss,
        minute: minutess,
        second: secondss,
        millisecond: 0
      });
      let secondsDiff = time.diff(moment(), 'seconds');
      if (secondsDiff <= 0) {
        this.valid = 'Thời gian nhập phải sau thời gian hiện tại';
      } else {
          this.valid = undefined
      }
    }
  }
  validateTime(timeStr) {
    const regex = /^([0-1]?[0-9]|2[0-3]):([0-5]?[0-9]):([0-5]?[0-9])$/;
    return regex.test(timeStr);
  }
}
