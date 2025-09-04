import { coerceNumberProperty } from '@angular/cdk/coercion';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mbbCurrency'
})
export class MbbCurrencyPipe implements PipeTransform {

  private thousandSeperator = ',';
  private decimalPoint = '.';

  transform(value: any, currencyUnit: string = ''): string {
    value = coerceNumberProperty(value);
    if (!value) { return `${value} ${currencyUnit}`; }
    // if (CURRENCY_ALLOW_DECIMAL_POINT.includes(currencyUnit)) { value = parseFloat(value).toFixed(2); }
    const parts = value.toString().split(this.decimalPoint);
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, this.thousandSeperator);
    return `${parts.join(this.decimalPoint)} ${currencyUnit}`;
  }
}
