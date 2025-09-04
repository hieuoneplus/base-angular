import { Pipe, PipeTransform } from '@angular/core';
const unitViLst = ['không', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'];
const thousandLst = ['', 'thousand', 'million', 'billion', 'trillion', 'thousand', 'million', 'billion', 'trillion trillion', 'thousand', 'million', 'billion', 'trillion trillion trillion', 'thousand', 'million', 'billion', 'trillion trillion trillion trillion', 'thousand', 'million', 'billion'];
const unitEnLst = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
const tenthLst = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
const dozenEnLst = ['twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

@Pipe({
  name: 'amountByWords'
})
export class AmountByWords implements PipeTransform {

  dozenWords(s: number, n: boolean): string {
    let o = '';
    const a = Math.floor(s / 10);
    const e = s % 10;
    return a > 1 ? (o = ' ' + unitViLst[a] + ' mươi', 1 === e && (o += ' mốt')) : 1 === a ? (o = ' mười', 1 === e && (o += ' một')) : n && e > 0 && (o = ' lẻ'), 5 === e && a >= 1 ? o += ' lăm' : (e > 1 || 1 === e && 0 === a) && (o += ' ' + unitViLst[e]), o;
    // return a > 1 ? (o = ' ' + unitViLst[a] + ' mươi', 1 === e && (o += ' mốt')) : 1 === a ? (o = ' mười', 1 === e && (o += ' một')) : n && e > 0 && (o = ' lẻ'), 5 === e && a >= 1 ? o += ' lăm' : 4 === e && a >= 1 ? o += ' tư' : (e > 1 || 1 === e && 0 === a) && (o += ' ' + unitViLst[e]), o;
  }

  hundredWords(n: number, o: boolean) {
    let a = '';
    const e = Math.floor(n / 100);
    const m = n % 100;
    return o || e > 0 ? (a = ' ' + unitViLst[e] + ' trăm', a += this.dozenWords(m, !0)) : a = this.dozenWords(m, !1), a;
  }

  thousandWords(tt: number, s: boolean) {
    let o = '';
    const a = Math.floor(tt / 1e6);
    const t0 = tt % 1e6;
    if (a > 0) {
      o = this.hundredWords(a, s) + ' triệu';
      s = !0;
    }
    const e = Math.floor(t0 / 1e3);
    const t1 = t0 % 1e3;
    return e > 0 && (o += this.hundredWords(e, s) + ' nghìn', s = !0), t1 > 0 && (o += this.hundredWords(t1, s)), o;
  }

  covertViWords(s: any) {
    s = s.toString();
    s = s.replace(/[\, ]/g, '');
    let n = '';
    let a = '';
    let ty = 0;
    do {
      ty = s.length >= 9 ? +s.substring(s.length - 9) : +s;
      s = s.length >= 9 ? s.substring(0, s.length - 9) : '';
      if (s.length > 0 && this.thousandWords(ty, !0).length > 0) {
        n = this.thousandWords(ty, !0) + a + n;
      } else if (s.length <= 0 && this.thousandWords(ty, !1).length > 0) {
        n = this.thousandWords(ty, !1) + a + n;
      }
      a += ' tỷ';
    } while (s.length > 0);
    return n.replace(/\s+/g, ' ');
  }

  covertEnWords(s: any): string {
    const query = s.length;
    if (query > 57) { return 'too big'; }
    const n = s.split('');
    let str = '';
    let mjk = 0;
    for (let ld = 0; ld < query; ld++) {
      if ((query - ld) % 3 === 2) {
        if (n[ld] === '1') {
          str += tenthLst[Number(n[ld + 1])] + ' ';
          ld++;
          mjk = 1;
        } else if (+n[ld] !== 0) {
          if (+n[ld + 1] !== 0) {
            str += dozenEnLst[+n[ld] - 2] + '-';
            str += unitEnLst[+n[ld + 1]] + ' ';
            if ((query - ld) % 3 === 0) { str += 'hundred '; }
            ld++;
          } else {
            str += dozenEnLst[+n[ld] - 2] + ' ';
          }
          mjk = 1;
        }
      } else if (+n[ld] !== 0) {
        str += unitEnLst[+n[ld]] + ' ';
        if ((query - ld) % 3 === 0) { str += 'hundred '; }
        mjk = 1;
      }
      if ((query - ld) % 3 === 1) {
        if (mjk) { str += thousandLst[(query - ld - 1) / 3] + ' '; }
        mjk = 0;
      }
    }
    return str.replace(/\s+/g, ' ');
  }

  transform(value: number | string, pipeArg: any = null) {
    const language = localStorage.getItem('currentLang');
    value = value?.toString();
    if (value?.includes('.')) {
      const lstVlaue = value?.split('.');
      let leftValue = lstVlaue[0];
      leftValue = leftValue?.replace(/[\, ]/g, '');
      if (!/^[0-9]*$/.test(leftValue)) { return ''; }
      if (leftValue === '0') { return language !== 'en' ? 'Không' : 'Zero'; }
      if (leftValue === '1') { return language !== 'en' ? 'Một' : 'One'; }
      if (!leftValue) { return 'Không'; }
      const leftfullText = language === 'en' ? this.covertEnWords(leftValue) + ' dollars.' : this.covertViWords(leftValue);

      let rightValue = lstVlaue[1];
      rightValue = rightValue?.replace(/[\, ]/g, '');
      if (!/^[0-9]*$/.test(rightValue)) { return ''; }
      if (rightValue === '0') { return language !== 'en' ? 'Không' : 'Zero'; }
      if (rightValue === '1') { return language !== 'en' ? 'Một' : 'One'; }
      if (!rightValue) { return 'Không'; }
      const rightfullText = language === 'en' ? this.covertEnWords(rightValue) + ' dollars.' : this.covertViWords(rightValue) + (pipeArg ? ' ' + pipeArg : ' đồng.');
      return leftfullText && rightfullText ? leftfullText + ' phảy ' + rightfullText : '';
    } else {
      value = value?.replace(/[\, ]/g, '');
      if (!/^[0-9]*$/.test(value)) { return ''; }
      if (value === '0') { return language !== 'en' ? (pipeArg ? 'Không ' + pipeArg + '.' : 'Không đồng.') : 'Zero dollar.'; }
      if (value === '1') { return language !== 'en' ? (pipeArg ? 'Một ' + pipeArg + '.' : 'Một đồng.') : 'One dollar.'; }
      if (!value) { return ''; }
      return language === 'en' ? this.covertEnWords(value) + ' dollars.' : this.covertViWords(value) + (pipeArg ? ' ' + pipeArg + '.' : ' đồng.');
    }
  }
}
