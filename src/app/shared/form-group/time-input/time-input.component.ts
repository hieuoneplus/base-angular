import {Component, Input, Output, EventEmitter, OnInit, AfterViewInit, ViewChild} from '@angular/core';
import { FormGroupAbstractComponent } from '../form-group.abstract.component';
import * as moment from "moment/moment";

@Component({
    selector: 'app-time-input',
    templateUrl: './time-input.component.html',
    styleUrls: ['./time-input.component.scss']
})
export class TimeInputComponent extends FormGroupAbstractComponent implements AfterViewInit {
  @Input() placeholder: string = '--:--:--'; // Đổi placeholder thành "--:--:--"
  @Input() initialTime: string | null = null; // Thời gian ban đầu (dạng "HH:mm:ss")

  @Output() timeChange = new EventEmitter<string>();
  @ViewChild('inputElement') inputElement: any;

  rawTime: string[] = ['-', '-', '-', '-', '-', '-']; // Chỉ số từ 0-5 (HH:MM:SS)
  formattedTime: string = this.placeholder;

  constructor() {
    super();
  }

  ngOnInit() {
    if (this.initialTime) {
      this.setTime(this.initialTime);
    }
  }

  setTime(time: string): void {
    const parts = time.split(':'); // Tách chuỗi "HH:mm:ss" thành giờ, phút và giây
    if (parts.length === 3) {
      const [hour, minute, second] = parts;
      if (
        hour.length === 2 &&
        minute.length === 2 &&
        second.length === 2 &&
        this.isValidFirstDigit(hour[0]) &&
        this.isValidSecondDigit(hour[0], hour[1]) &&
        this.isValidThirdDigit(minute[0]) &&
        this.isValidFourthDigit(minute[1]) &&
        this.isValidFifthDigit(second[0]) &&
        this.isValidSixthDigit(second[1])
      ) {
        this.rawTime = [hour[0], hour[1], minute[0], minute[1], second[0], second[1]];
        this.updateFormattedTime(); // Cập nhật thời gian hiển thị
      } else {
        console.error('Invalid initialTime format');
      }
    }
  }

  ngAfterViewInit() {
    if (this.item.focus) {
      setTimeout(() => {
        this.inputElement.nativeElement.focus();
      }, 100);
    }
    if (this.initialTime) {
      this.setTime(this.initialTime);
    }
  }

  // Kiểm tra tính hợp lệ của chữ số thứ năm (s1) cho giây
  isValidFifthDigit(s1: string): boolean {
    return ['0', '1', '2', '3', '4', '5'].includes(s1); // s1 phải từ 0-5
  }

  // Kiểm tra tính hợp lệ của chữ số thứ sáu (s2) cho giây
  isValidSixthDigit(s2: string): boolean {
    return /^[0-9]$/.test(s2); // s2 có thể là bất kỳ con số
  }

  // Kiểm tra tính hợp lệ của chữ số nhập vào
  isValidDigitAt(index: number): boolean {
    const hour1 = this.rawTime[0];
    const hour2 = this.rawTime[1];
    const minute1 = this.rawTime[2];
    const minute2 = this.rawTime[3];
    const second1 = this.rawTime[4];
    const second2 = this.rawTime[5];

    switch (index) {
      case 0: // Chữ số đầu tiên
        return this.isValidFirstDigit(hour1);
      case 1: // Chữ số thứ hai
        return this.isValidSecondDigit(hour1, hour2);
      case 2: // Chữ số thứ ba
        return this.isValidThirdDigit(minute1);
      case 3: // Chữ số thứ tư
        return this.isValidFourthDigit(minute2);
      case 4: // Chữ số thứ năm (giây)
        return this.isValidFifthDigit(second1);
      case 5: // Chữ số thứ sáu (giây)
        return this.isValidSixthDigit(second2);
      default:
        return false;
    }
  }

  onKeydown(event: KeyboardEvent): void {
    const inputChar = event.key;
    if (/\d/.test(inputChar)) {
      const index = this.rawTime.findIndex((char) => char === '-');
      if (index !== -1) {
        this.rawTime[index] = inputChar;

        const isValid = this.isValidDigitAt(index);

        if (isValid) {
          this.updateFormattedTime();
        } else {
          this.rawTime[index] = '-';
        }
      }
    }

    if (event.key === 'Backspace') {
      const index = [...this.rawTime]
        .reverse()
        .findIndex(char => char !== '-' && char !== null);

      const actualIndex = index !== -1 ? this.rawTime.length - 1 - index : -1;

      if (actualIndex !== -1) {
        this.rawTime[actualIndex] = '-';
        this.updateFormattedTime();
      }
    }

    event.preventDefault();
  }

  private updateFormattedTime(): void {
    const hour = `${this.rawTime[0]}${this.rawTime[1]}`;
    const minute = `${this.rawTime[2]}${this.rawTime[3]}`;
    const second = `${this.rawTime[4]}${this.rawTime[5]}`;

    if (this.isValidTime()) {
      this.formattedTime = `${hour}:${minute}:${second}`;
      this.timeChange.emit(this.formattedTime); // Phát ra sự kiện timeChange với thời gian hợp lệ
    } else {
      this.formattedTime = `${hour}:${minute}:${second}`;
      this.timeChange.emit(''); // Phát ra giá trị rỗng nếu không hợp lệ
    }
  }

  isValidTime(): boolean {
    const hour1 = this.rawTime[0];
    const hour2 = this.rawTime[1];
    const minute1 = this.rawTime[2];
    const minute2 = this.rawTime[3];
    const second1 = this.rawTime[4];
    const second2 = this.rawTime[5];

    return (
      this.isValidFirstDigit(hour1) &&
      this.isValidSecondDigit(hour1, hour2) &&
      this.isValidThirdDigit(minute1) &&
      this.isValidFourthDigit(minute2) &&
      this.isValidFifthDigit(second1) &&
      this.isValidSixthDigit(second2)
    );
  }

  clearTime(): void {
    this.rawTime = ['-', '-', '-', '-', '-', '-'];
    this.formattedTime = this.placeholder;
    this.timeChange.emit('');
  }



    // Kiểm tra tính hợp lệ của chữ số đầu tiên (h1)
    isValidFirstDigit(digit: string): boolean {
        return ['0', '1', '2'].includes(digit);
    }

    // Kiểm tra tính hợp lệ của chữ số thứ hai (h2)
    isValidSecondDigit(h1: string, h2: string): boolean {
        if (h1 === '2') {
            return ['0', '1', '2', '3'].includes(h2); // Nếu h1 là 2, h2 phải từ 0-3
        }
        return true; // Nếu h1 là 0 hoặc 1, h2 có thể là bất kỳ
    }

    // Kiểm tra tính hợp lệ của chữ số thứ ba (m1)
    isValidThirdDigit(m1: string): boolean {
        return ['0', '1', '2', '3', '4', '5'].includes(m1); // m1 phải từ 0-5
    }

    // Kiểm tra tính hợp lệ của chữ số thứ tư (m2)
    isValidFourthDigit(m2: string): boolean {
        return /^[0-9]$/.test(m2); // m2 có thể là bất kỳ con số
    }

}
