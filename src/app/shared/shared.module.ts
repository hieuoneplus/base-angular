import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslateModule } from '@ngx-translate/core';
import { DformPaginationPlusModule } from './dform-pagination-plus/dform-pagination-plus.module';
import { DformDialogModule } from './dform-dialogs/dialog.module';
import { ActivityIndicatorModule } from './activity-indicator/activityIndicator.module';
import { FormGroupDformModule } from './form-group/form-group.module';
import { TemplateModule } from './template/template.module';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DisableControlDirective } from './directives/disable-control.directive';
import { DragDirective } from './directives/dragDrop.directive';
import { DformPaginationRoleModule } from './dform-pagination-role/dform-pagination-role.module';
import { CurrencyMaskPipe } from './pipe/currency-mask.pipe';

const DIRECTIVES = [DisableControlDirective, DragDirective];
const PIPES = [
  CurrencyMaskPipe
]

@NgModule({
  declarations: [...DIRECTIVES, ...PIPES],
  imports: [
    FormGroupDformModule,
    TemplateModule,
    ActivityIndicatorModule,
    DformDialogModule,
    DformPaginationPlusModule,
    DformPaginationRoleModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    FlexLayoutModule
  ],
  exports: [
    FormGroupDformModule,
    TemplateModule,
    ActivityIndicatorModule,
    DformDialogModule,
    DformPaginationPlusModule,
    DformPaginationRoleModule,
    TranslateModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    DisableControlDirective,
    DragDirective,
    ...PIPES
  ],
  providers: [...PIPES],

})
export class SharedSMModule {
}
