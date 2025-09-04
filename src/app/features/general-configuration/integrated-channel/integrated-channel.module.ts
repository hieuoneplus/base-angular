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
import { IntegratedChannelRoutingModule } from './integrated-channel-routing.module';
import { IntegratedChannelComponent } from './integrated-channel.component';
import { AddIntegratedChannelComponent } from './add-integrated-channel/add-integrated-channel.component';
import { EditIntegratedChannelComponent } from './edit-integrated-channel/edit-integrated-channel.component';

@NgModule({
  declarations: [
    IntegratedChannelComponent,
    AddIntegratedChannelComponent,
    EditIntegratedChannelComponent,
  ],
  imports: [
    ThemeModule,
    CommonModule,
    TranslateModule,
    SharedSMModule,
    MatIconModule,
    MatTableModule,
    MatCheckboxModule,
    MatTooltipModule,
    MaterialModule,
    IntegratedChannelRoutingModule,
  ],
})
export class IntegratedChannelModule {}
