import {BUTTON_CREATE, BUTTON_SAVE, BUTTON_UNDO, TYPE_BTN_FOOTER} from "../../../../public/constants";
import {DateTimeItem, TimeInput} from "@shared-sm";


export const BUTTON_BACK = {
  ...BUTTON_UNDO,
  title: 'Hủy',
  icon: null
};

export const BUTTON_CREATE_ROLE = {
  ...BUTTON_CREATE,
  title: 'Thêm mới',
  icon: null
};

export const BUTTON_UPDATE_ROLE = {
  ...BUTTON_SAVE,
  title: 'Cập nhật',
  icon: null
};

// Table view
export const displayedColumns: string[] = [
  'name', 'get', 'post', 'put', 'delete', 'history'
];

export const BUTTON_DELETE_USER = {
  title: 'Xóa tài khoản',
  classBtn: 'btn-light-blue',
  typeBtn: TYPE_BTN_FOOTER.TYPE_DELETE,
};

export const SELECT_DATE = () => new DateTimeItem({
  key: 'reopenTime',
  placeholder: 'dd/MM/yyyy',
  layout: '30',
  value: null,
  minDate: '0000-01-01',
  maxDate: '9999-12-12',
});

export const TIME = () => new TimeInput({
    key: 'fromTime',
    placeholder: '--:--:--',
    value: null,
    layout: '25',
});



export const JSON_EX = {
  "data": {

    "id": 0,
    "key": "transfer.channels.state",
    "value": {
      "$type": "transfer_channels_state",
      "transferChannelsState": [
        {
          "stt": 1,
          "transferChannel": "IBFT",
          "reopenTime": null,
          "closeDurationSecond": null,
          "active": false
        },
        {
          "stt": 2,
          "transferChannel": "BILATERAL",
          "reopenTime": null,
          "closeDurationSecond": null,
          "active": false
        },
        {
          "stt": 3,
          "transferChannel": "UNKNOWN",
          "reopenTime": null,
          "closeDurationSecond": null,
          "active": true
        }
        ]
    },
    "description": "641456",
  }
}

