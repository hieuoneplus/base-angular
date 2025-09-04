import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ActivityIndicatorModule } from './../shared/activity-indicator/activityIndicator.module';
import { DformLayoutComponent } from './dform-layout/dform-layout.component';
import { TranslateComponent } from './header/widgets/translate.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { SidemenuComponent } from './sidemenu/sidemenu.component';
import { AccordionModule } from './accordion/accordion.module';
import { PageHeaderComponent } from './page-header/page-header.component';
import { UserPanelComponent } from './sidebar/user-panel.component';
@NgModule({
  declarations: [
    DformLayoutComponent,
    SidebarComponent,
    SidemenuComponent,
    UserPanelComponent,
    TranslateComponent,
    PageHeaderComponent,
  ],
  imports: [
    CommonModule, 
    RouterModule,
    ActivityIndicatorModule,
    TranslateModule,
    MatMenuModule,
    MatIconModule,
    MatListModule,
    MatSidenavModule,
    MatToolbarModule,
    MatTabsModule,
    MatRippleModule,
    MatTooltipModule,
    MatBadgeModule,
    MatButtonModule,
    MatButtonToggleModule,
    FlexLayoutModule,
    AccordionModule,
  ],
})
export class ThemeModule { }
