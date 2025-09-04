import { SelectControlComponent } from './select-control/select-control.component';
import { RadioControlComponent } from './radio-control/radio-control.component';
import { DropdownControlComponent } from './dropdown-control/dropdown-control.component';
import { DateControlComponent } from './date-control/date-control.component';
import { CheckboxControlComponent } from './checkbox-control/checkbox-control.component';
import { SlideToggleControlComponent } from './slide-toggle-control/slide-toggle-control.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormCurrencyDirective } from './directives/form-currency.directive';
import { FormTextDirective } from './directives/form-text.directive';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormRegexDirective } from './directives/form-regex.directive';
import { FormNunberPhoneDirective } from './directives/form-number-phone.directive';
import { TextControlComponent } from './text-control/text-control.component';
import { TextareaControlComponent } from './textarea-control/textarea-control.component';
import { FormGroupSlideToggleComponent } from './form-group-slide-toggle/form-group-slide-toggle.component';
import {TimeInputComponent} from "./time-input/time-input.component";
import { TextareaDynamicComponent } from './textarea-dynamic/textarea-dynamic.component';

const COMPONENTS_DYNAMIC = [
  TextControlComponent,
  TextareaControlComponent,
  SlideToggleControlComponent,
  CheckboxControlComponent,
  DateControlComponent,
  DropdownControlComponent,
  RadioControlComponent,
  SelectControlComponent,
  FormGroupSlideToggleComponent,
  TimeInputComponent,
  TextareaDynamicComponent
];

const DIRECTIVES = [
  FormRegexDirective,
  FormNunberPhoneDirective,
  FormTextDirective,
  FormCurrencyDirective
];

@NgModule({
  imports: [
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatCheckboxModule,
    MatRadioModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatSliderModule,
    MatSlideToggleModule,
    NgSelectModule,
    CommonModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    TranslateModule
  ],
  declarations: [...COMPONENTS_DYNAMIC, ...DIRECTIVES],
  exports: [...COMPONENTS_DYNAMIC],
  entryComponents: [
  ],
  providers: [
  ]
})
export class FormGroupDformModule { }
