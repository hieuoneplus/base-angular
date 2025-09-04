import { TranslateModule } from '@ngx-translate/core';
import { NoItemComponent } from './no-item/no-item.component';
import { FooterComponent } from './footer/footer.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NoDataComponent } from './no-data/no-data.component';

@NgModule({
  imports: [
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    CommonModule,
    FlexLayoutModule,
    TranslateModule
  ],
  declarations: [
    NoDataComponent,
    FooterComponent,
    NoItemComponent
  ],
  exports: [
    NoDataComponent,
    FooterComponent,
    NoItemComponent
  ],
  entryComponents: [
  ],
  providers: [
  ]
})
export class TemplateModule { }
