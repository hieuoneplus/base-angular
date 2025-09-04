import {DateTimeItem, NgSelectItem, SlideItem, TextboxItem} from "@shared-sm";
import * as moment from "moment";
export const ACTIVE_SLIDE = () => new SlideItem({
  key: 'activeSlide',
  label: 'Status',
  value: true
});

export const SUB_PRODUCT_SLIDE = () => new SlideItem({
  key: 'subProductSlide',
  label: 'Sub product required',
  value: true
});

export const CHANNEL = () => new TextboxItem({
  key: 'channel',
  label: 'Channel',
  placeholder: 'CITAD (default)',
  value: 'CITAD',
  layout: '25',
  maxLength: 50
});

export const CATEGORY = () => new TextboxItem({
  key: 'category',
  label: 'Category',
  placeholder: 'Category',
  value: '',
  layout: '25',
  maxLength: 50,
  // customDirectives: /[`~!@#$%^&*()\-_=+\[\]{}\\|;:'",<.>\/?]/
});

export const CODE = () => new TextboxItem({
  key: 'code',
  label: 'Code',
  placeholder: 'Code',
  value: '',
  layout: '25',
  maxLength: 50
});

export const SUBPRODUCT = () => new TextboxItem({
  key: 'subProduct',
  label: 'Sub product',
  placeholder: 'Sub product',
  value: '',
  layout: '25',
  maxLength: 50
});

export const STATUS = () => new NgSelectItem({
  key: 'active',
  label: 'Status',
  placeholder: 'Status',
  value: null,
  options: [
    {
      key: null,
      value: 'Tất cả',
    },
    {
      value: 'Hoạt động',
      key: 'true',
    },
    {
      value: 'Dừng hoạt động',
      key: 'false',
    },
  ],
  layout: '50',
  maxLength: 50
});

export const SUB_PRODUCT_REQUIRED = () => new NgSelectItem({
  key: 'subProductRequired',
  label: 'Sub Product Required',
  placeholder: 'Sub Product Required',
  value: null,
  options: [
    {
      key: null,
      value: 'Tất cả',
    },
    {
      value: 'Có',
      key: 'true',
    },
    {
      value: 'Không',
      key: 'false',
    },
  ],
  layout: '50',
  maxLength: 50
});

export const JSON_EX = {
  "data": {

    "page": 0,
    "size": 10,
    "total": 20,
    "content": [
      {
        "stt": 0,
        "accountNumber": "25619819",
        "id": "0",
        "key": "FT46548686",
        "accountType": "VTM",
        "active": true,
        "urlName": "/integration-payoo/partner/api/get-account",
        "protocol": "https1-3",
        "urlCallback": "/integration-payoo/partner/api/noti-trans"

      }
    ]
  }
}

export const UPDATED_FROM = () => new DateTimeItem({
  key: 'updatedAtFrom',
  label: 'Thời gian sửa đổi từ ngày',
  placeholder: 'Nhập thời gian sửa đổi từ ngày',
  minDate: '1900-01-01',
  value: null,
});

export const UPDATED_TO = () => new DateTimeItem({
  key: 'updatedAtTo',
  label: 'Thời gian sửa đổi đến ngày',
  placeholder: 'Nhập thời gian sửa đổi đến ngày',
  minDate: '1900-01-01',
  value: null,
});

export const UPDATED_BY = () => new TextboxItem({
  key: 'updatedBy',
  label: 'Người sửa đổi',
  placeholder: 'Nhập người sửa đổi',
  value: '',
  layout: '25',
  maxLength: 50
});

export const WHITELIST_IDS = () => new TextboxItem({
  key: 'whitelistCategoryIds',
  label: 'Whitelist Category ID',
  placeholder: 'Whitelist Category ID',
  value: '',
  layout: '25',
  maxLength: 50
});
