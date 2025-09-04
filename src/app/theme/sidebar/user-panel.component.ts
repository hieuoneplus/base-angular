import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '@env/environment';

@Component({
  selector: 'app-user-panel',
  template: `
    <div fxLayout="column" fxLayoutAlign="start start">
      <img
        class="{{class}}"
        src="{{imageUrl}}"
        alt="avatar"
      />
      <img
        class="dform-item-panel-avatar"
        src="assets/images/favicon.ico"
        alt="avatar"
      />
    </div>
  `,
  styleUrls: ['./user-panel.component.scss'],
})
export class UserPanelComponent {
  imageUrl: string = `${environment.base_url}/assets/images/logo_mb.svg`;
  class: string = 'dform-user-panel-avatar';
  constructor(private router: Router) {
  }
}
