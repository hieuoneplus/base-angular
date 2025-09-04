import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ActivityIndicatorComponent } from './activity-indicator-singleton.component';
import {TranslateModule} from "@ngx-translate/core";
@NgModule({
    imports: [
        CommonModule,
        TranslateModule
    ],
  declarations: [
    ActivityIndicatorComponent
  ],
  exports: [
    ActivityIndicatorComponent
  ],
  providers: [
  ]
})
export class ActivityIndicatorModule {}
