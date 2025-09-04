import { Pipe, PipeTransform } from '@angular/core';

/**
 * @description Thêm dấu phẩy phân chia phần nghìn cho số tiền
 */
@Pipe({
  name: 'currencyMask'
})
export class CurrencyMaskPipe implements PipeTransform {
  transform(value: string | number, isClean: boolean): string {
    if (value === 0) { return '0'; }
    if (!value) { return ''; }

    let valueStr = value.toString();

    const language = localStorage.getItem('currentLang');
    let thousandSeperator = ','; // Dấu phân cách ngàn mặc định là dấu phẩy
    if (language === 'en') {
      thousandSeperator = '.';  // Nếu ngôn ngữ là tiếng Anh, sử dụng dấu chấm
    }

    // Nếu không yêu cầu làm sạch, loại bỏ tất cả các ký tự không phải số
    if (!isClean) {
      valueStr = valueStr.replace(/\D/g, '');
    }

    // Chèn dấu phân cách ngàn
    return valueStr.replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeperator);
  }
}
