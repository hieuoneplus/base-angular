import * as moment from 'moment';
import { LocalStoreEnum } from '../enum/local-store.enum';
import Utils from './utils';

/**
 * Lấy dữ liệu từ local Store
 * @param key
 * @returns
 */
export function getDataLocalStorageByKey(key: string): any {
    const item = localStorage.getItem(key);
    if (item && item !== 'null') {
        return JSON.parse(item);
    } else {
        return [];
    }
}

export function getDataSessionStorageByKey(key: string): any {
    const item = sessionStorage.getItem(key);
    if (item && item !== 'null') {
        return JSON.parse(item);
    } else {
        return [];
    }
}

/**
 * chuyển kiểu
 * @param sText
 * @param pattern
 * @returns
 */
export function turnAlphanumberic(sText: string, pattern?: RegExp): string {
    let sNewText = sText;
    sNewText = Utils.removeVNAccent(sNewText);
    if (pattern) { sNewText = Utils.removeSpecialChar(sNewText, pattern); }
    else { sNewText = Utils.removeSpecialChar(sNewText); }
    return sNewText;
}

/**
 * hàm convertdate chuyển đổi từ dạng ngày có định dạng là dateFrom(VD: YYYY-MM-DD) thành dạng dateTo(VD: DD/MM/YYYY)
 * @param value
 * @param dateFrom
 * @param dateTo
 * @returns
 */
export function converDateToDate(value: any, dateFrom: string, dateTo: string): any {
    if (value) {
        return moment(value, dateFrom).format(dateTo);
    }
    return null;
}

/**
 * Hàm convert date lấy về từ server
 * Dạng date lấy về là dạng yyymmdd(dạng ngày không có phân cách)
 * @param date
 * @returns
 */
export function convertDateFromServer(date: string): any {
    if (date) {
        return date.slice(0, 4) + '/' + date.slice(4, 6) + '/' + date.slice(6);
    }
    return null;
}


/**
 * Lấy thông tin người dùng đăng nhập
 * @returns
 */
export function getUserInfo() {
    return getDataLocalStorageByKey('UI');
}


/**
 * checkToken
 * @param flagToken
 * @returns
 */
export function tokenValid(): boolean {
    const STORAGE: string[] = ['JWT', 'RJWT', 'UI', 'TE'];
    // Kiểm tra các biến môi trường token, refreshtoken, user_info
    for (const x of STORAGE) {
        if (!(localStorage.getItem(x) != null)) {
            return false;
        }
    }
    return true;
}
