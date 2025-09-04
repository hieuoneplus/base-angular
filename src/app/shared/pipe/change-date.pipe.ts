import { Pipe, PipeTransform } from '@angular/core';
import { converDateToDate, convertDateFromServer } from '../utils/utils.function';

@Pipe({ name: 'changeDatePipe' })
export class ChangeDatePipe implements PipeTransform {
  transform(date: string) {
    if (date) {
      if (date.includes('/')) {
        return date;
      } else if (date.includes('-')) {
        return converDateToDate(date, 'YYYY-MM-DD', 'DD/MM/YYYY');
      }
      return converDateToDate(convertDateFromServer(date), 'YYYY/MM/DD', 'DD/MM/YYYY');
    }
    return '';
  }
}
