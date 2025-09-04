import { FormType } from './form-type.model';

export class DropdownItem extends FormType<string> {
  controlType = 'dropdown';
}

export class RadioItem extends FormType<string> {
  controlType = 'radio';
}

export class TextAreaItem extends FormType<string> {
  controlType = 'textarea';
}

export class DateTimeItem extends FormType<string> {
  controlType = 'datetime';
}


export class TextboxItem extends FormType<string> {
  controlType = 'textbox';
}


export class CheckboxItem extends FormType<string> {
  controlType = 'checkbox';
}

export class NgSelectItem extends FormType<string> {
  controlType = 'ngselect';
}

export class AutoComplateItem extends FormType<string> {
  controlType = 'autocomplate';
}

export class HiddenItem extends FormType<string> {
  controlType = 'hidden';
}

export class SlideItem extends FormType<boolean> {
  controlType = 'slide';
}

export class Template extends FormType<string> {
  controlType = 'template';
}

export class TimeInput extends FormType<string> {
  controlType = 'timeinput';
}
