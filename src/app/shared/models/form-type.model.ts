/**
 * Với tham số paramData - Không sử dụng invalid và validations là tên biến (Đang sử dụng để check validate)
 */
export class FormType<T> {
  value: T | T[];
  key: string;
  label: string;
  required: boolean;
  max?: string;
  min?: string;
  maxLength: string | number | null;
  minLength: string | number | null;
  maxDate?: string;
  minDate?: string;
  order: number;
  controlType: string;
  focus: boolean;
  type: string;
  placeholder: string;
  options: { key: string, value: string, checked?: boolean }[];
  layout: string;
  directives: string;
  customDirectives: string | RegExp;
  customValidate: string | string[];
  updateOn: string;
  template: string;
  reset: boolean;
  paramData: any; // Không sử dụng invalid và validations là tên biến (Đang sử dụng để check validate)
  title: boolean;
  pattern: string;
  checked: boolean; // Sử dụng cho checkboxItem
  readOnly?: boolean;
  searchable?: boolean; // Sử dụng cho Select
  toolTipInfo?: string;
  constructor(options: {
    value: T | T[];
    key?: string;
    label?: string;
    required?: boolean;
    max?: string;
    min?: string;
    maxLength?: string | number | null;
    minLength?: string | number | null;
    maxDate?: string;
    minDate?: string;
    order?: number;
    controlType?: string;
    focus?: boolean;
    type?: string;
    placeholder?: string;
    options?: { key: string, value: string }[];
    layout?: string;
    directives?: string;
    customDirectives?: string | RegExp;
    customValidate?: string | string[];
    updateOn?: string;
    template?: string;
    reset?: boolean;
    paramData?: any; // Không sử dụng invalid và validations là tên biến (Đang sử dụng để check validate)
    title?: boolean
    pattern?: string;
    checked?: boolean; // Sử dụng cho checkboxItem
    readOnly?: boolean;
    searchable?: boolean; // Sử dụng cho Select
    toolTipInfo?: string;
  }) {
    this.value = options.value;
    this.key = options.key || '';
    this.label = options.label || '';
    this.required = !!options.required;
    this.max = options.max;
    this.min = options.min;
    this.maxLength = options.maxLength ? options.maxLength : null;
    this.minLength = options.minLength ? options.minLength : null;
    this.maxDate = options.maxDate;
    this.minDate = options.minDate;
    this.order = options.order === undefined ? 1 : options.order;
    this.controlType = options.controlType || '';
    this.type = options.type || '';
    this.placeholder = options.placeholder || '';
    this.focus = !!options.focus;
    this.options = options.options || [];
    this.layout = options.layout || '100';
    this.directives = options.directives || '';
    this.customDirectives = options.customDirectives || '';
    this.customValidate = options.customValidate || '';
    this.updateOn = options.updateOn || '';
    this.template = options.template || '';
    this.reset = !!options.reset;
    this.paramData = options.paramData;
    this.title = !!options.title;
    this.pattern = options.pattern || '';
    this.checked = !!options.checked;
    this.readOnly = options.readOnly;
    this.searchable = options.searchable;
    this.toolTipInfo = options.toolTipInfo
  }
}
