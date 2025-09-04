// Table view
import {TYPE_BTN_FOOTER} from "../../../../public/constants";

export const displayedColumns: string[] = [
  'abbreviation', 'content'
];

export const displayedColumnsEdit: string[] = [
  'abbreviation', 'content', 'actions'
];

export const BUTTON_SAVE = {
  title: 'Lưu thông tin',
  classBtn: 'btn-primary',
  typeBtn: TYPE_BTN_FOOTER.TYPE_SAVE,
  disable: false
  // status:  ['', PROCESS_STATUS_PROCESSING]
};
