
/**
 * @description xử lý commonn
 */
import * as moment from 'moment';
import { environment } from "@env/environment";
export default class Utils {
    /**
     * Kiểm tra object có empty hoặc có là string k
     * @param object
     * @returns
     */
    public static isEmptyString(object: any): boolean {
        if (object) {
            return true;
        }

        if (typeof object === 'string' || object instanceof String) {
            return object.toString().trim().length === 0;
        }

        return false;
    }


    /**
     * xóa khoảng trống
     * @param object
     * @returns
     */
    public static trimString(object: any): string {

        if (object && typeof object === 'string' || object instanceof String) {
            return object.toString().trim();
        }
        return '';
    }

    /**
     * Xử lý Convert Object to B64
     * @param object
     * @returns
     */
    public static convertObjectToBase64(object: any): any {
        if (this.isEmptyString(object)) {
            const b64 = btoa(object);
            return b64;
        }
        return null;
    }


    /**
     * Xử lý Convert B64 to Object
     * @param base64
     * @returns
     */
    public static convertBase64ToObject(base64: any): any {
        if (!!!base64) {
            const object: any = decodeURIComponent(escape(atob(base64)));
            return JSON.parse(object);
        }

        return undefined;
    }

    /**
     * Xử lý parse dữ liệu kiểu json
     * @param value
     * @returns
     */
    public static JSonTryParse(value: string | null): any {
        try {
            if (value) {
                return JSON.parse(value);
            }
            return value;
        } catch (e) {
            if (value === 'undefined') {
                return void 0;
            }
            return value;
        }
    }

    /**
     * Decode URL
     * @param str
     * @returns
     */
    public static urlBase64Decode(str: string): string {
        let output = str.replace(/-/g, '+').replace(/_/g, '/');
        switch (output.length % 4) {
            case 0: { break; }
            case 2: { output += '=='; break; }
            case 3: { output += '='; break; }
            default: {
                throw new Error('Illegal base64url string!');
            }
        }
        return this.b64DecodeUnicode(output);
    }

    /**
     * Unicode URL
     * @param str
     * @returns
     */
    private static b64DecodeUnicode(str: any): string {
        return decodeURIComponent(Array.prototype.map.call(atob(str), (c: any) => {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
    }

    /**
     * Xử lý decode Token
     * @param token
     * @returns
     */
    public static decodeToken(token: string): any {
        const parts = token.split('.');

        if (parts.length !== 3) {
            throw new Error('JWT must have 3 parts');
        }

        const decoded = this.urlBase64Decode(parts[1]);
        if (!decoded) {
            throw new Error('Cannot decode the token');
        }

        return JSON.parse(decoded);
    }

    /**
     * Format datetime
     * @param date;
     * @param format;
     */
    public static createIsoDateByFormat(date: any, format: any): string {
        if (date) {
            return moment(date).format(format);
        }
        return '';
    }

    /**
     * Kiểm tra date có nhỏ hơn 15 tuổi chỉ check năm
     * @param val
     * @returns
     */
    public static checkShowViewAddGuadian(val: any): boolean {
        if (val) {
            if (moment().diff(val, 'years') < 15) {
                return true;
            } else {
                return false;
            }
        }
        return false;
    }

    /**
     * Regex 1 chuỗi kí tự
     * @param sInput
     * @param sReg
     * @param sNew
     * @returns
     */
    public static regReplace(sInput: string, sReg: string, sNew: string): string {
        const reg = new RegExp(sReg, 'g');
        return sInput.replace(reg, sNew);
    }

    /**
     * xóa kí tự tiếng việt
     * @param sText
     * @returns
     */
    public static removeVNAccent(sText: string): string {
        let sNewText = sText;
        sNewText = this.regReplace(sNewText, 'à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ', 'a');
        sNewText = this.regReplace(sNewText, 'À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ', 'A');
        sNewText = this.regReplace(sNewText, 'è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ', 'e');
        sNewText = this.regReplace(sNewText, 'È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ', 'E');
        sNewText = this.regReplace(sNewText, 'ì|í|ị|ỉ|ĩ', 'i');
        sNewText = this.regReplace(sNewText, 'Ì|Í|Ị|Ỉ|Ĩ', 'I');
        sNewText = this.regReplace(sNewText, 'ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ', 'o');
        sNewText = this.regReplace(sNewText, 'Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ', 'O');
        sNewText = this.regReplace(sNewText, 'ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ', 'u');
        sNewText = this.regReplace(sNewText, 'Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ', 'U');
        sNewText = this.regReplace(sNewText, 'ỳ|ý|ỵ|ỷ|ỹ', 'y');
        sNewText = this.regReplace(sNewText, 'Ỳ|Ý|Ỵ|Ỷ|Ỹ', 'Y');
        sNewText = this.regReplace(sNewText, 'Đ', 'D');
        sNewText = this.regReplace(sNewText, 'đ', 'd');
        return sNewText;
    }

    /**
     * Xóa các kí tự đặc biệt
     * @param sText
     * @param pattern
     * @returns
     */
    public static removeSpecialChar(sText: string, pattern: RegExp = /[\_\!\#\$\%\&\'\+\:\;\"\<\=\>\?\@\\\`\^\~\{\|\}\(\)\-\[\]\.\,\/\*\s]/g): string {
        let sNewText = sText;
        sNewText = sNewText.replace(pattern, '');
        return sNewText;
    }

    /**
     * Xử lý clone dữ liệu
     * @param data
     * @returns
     */
    public static cloneData(data: any): any {
        return JSON.parse(JSON.stringify(data));
    }


    /**
     * Check dữ liệu có chứa VN
     * @param val
     * @returns
     */
    public static checkNationalNotInVIE(val: any): boolean {
        if (!val.includes('VN')) {
            return true;
        }
        return false;
    }

    /**
     * Format dữ liệu currency
     * @param value
     * @returns
     */
    public static formatCurrency(value: any): string {
        if (!value) return '';
        value = value.toString().replace(new RegExp(',', 'g'), '');
        const parts = value.split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        if (parts[1]) {
            parts[1] = parts[1].length > 2 ? parts[1].slice(0, 2) : parts[1];
        }
        return parts.join('.');
    }

    public static logger(data: any, text: string = 'data') {
        environment.logger && console.log(
            "%c Logger : " + this.constructor.name + ' - ' + text,
            "background-color: #e2e2e2 ; color: #333 ; font-weight: bold ; padding: 4px ;",
            data
        );
    }

    public static error(data: any, text: string = 'data') {
        environment.logger && console.error(
            "%c Logger : " + this.constructor.name + ' - ' + text,
            "background-color: red ; color: white ; font-weight: bold ; padding: 4px ;",
            data
        );
    }

}
