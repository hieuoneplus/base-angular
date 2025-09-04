import { MAT_DIALOG_DEFAULT_OPTIONS, MatDialogConfig } from '@angular/material/dialog';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import {
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';

export const materialProviders = [
  {
    provide: MAT_DIALOG_DEFAULT_OPTIONS,
    useValue: {
      ...new MatDialogConfig(),
    },
  },
  {
    provide: DateAdapter,
    useClass: MomentDateAdapter,
    deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
  },
  // This will be overrided by runtime setting
  { provide: MAT_DATE_LOCALE, useFactory: () => navigator.language },
  {
    provide: MAT_DATE_FORMATS,
    useValue: {
      parse: {
        dateInput: 'DD/MM/YYYY',
      },
      display: {
        dateInput: 'DD/MM/YYYY',
        monthYearLabel: 'YYYY MMM',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'YYYY MMM',
      },
    },
  }
];
