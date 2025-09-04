import { Component } from '@angular/core';

@Component({
  selector: 'app-notification',
  template: `
    <button color="primary" mat-icon-button class="dform-toolbar-button" [matMenuTriggerFor]="menu">
      <mat-icon class="mbb-icon ic-notification md"> </mat-icon>
    </button>

    <mat-menu #menu="matMenu">
      <mat-nav-list>
        <mat-list-item *ngFor="let message of messages">
          <a matLine href="#">{{ message }}</a>
          <button mat-icon-button color="primary">
            <mat-icon class="mbb-icon ic-notification fc-error"> </mat-icon>
          </button>
        </mat-list-item>
      </mat-nav-list>
    </mat-menu>
  `,
})
export class NotificationComponent {
  messages = ['Thông báo', 'Thông báo', 'Thông báo'];
}
