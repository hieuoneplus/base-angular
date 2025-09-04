import { Component, Output, EventEmitter, Input, ViewEncapsulation } from '@angular/core';
import { SettingsService } from 'src/app/shared/services/settings.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SidebarComponent {
  @Input() showToggle = true;
  options = this.settings.getOptions();
  constructor(private settings: SettingsService) {}
}
