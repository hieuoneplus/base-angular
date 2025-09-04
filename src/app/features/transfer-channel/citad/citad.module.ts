import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslateModule } from '@ngx-translate/core';
import { SharedSMModule } from '@shared-sm';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTableModule } from '@angular/material/table';
import { ThemeModule } from 'src/app/theme/theme.module';
import { MaterialModule } from '../../../shared/material.module';
import { CitadRoutingModule } from './citad-routing.module';
import { CitadMainComponent } from './citad-main.component';

const COMPONENTS = [
  CitadMainComponent,
];
const COMPONENTS_DYNAMIC = [];
const SERVICE = [];

@NgModule({
  imports: [
    ThemeModule,
    CommonModule,
    CitadRoutingModule,
    TranslateModule,
    SharedSMModule,
    MatIconModule,
    MatTableModule,
    MatCheckboxModule,
    MatTooltipModule,
    MaterialModule,
  ],
  declarations: [...COMPONENTS, ...COMPONENTS_DYNAMIC],
  entryComponents: COMPONENTS_DYNAMIC,
  providers: [...SERVICE]
})
export class CitadModule {
}
