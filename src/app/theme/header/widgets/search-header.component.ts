import { Component } from '@angular/core';

@Component({
  selector: 'dform-search-header',
  template: `
    <div class="div-search" fxLayout="row">
      <mat-icon fxFlex="10" class="mbb-icon fc-gray-600 ic-search md"></mat-icon>
      <input fxFlex="90" class="mat-input-element form-control" #inputElement matInput placeholder="Tìm kiếm dịch vụ">
    </div>
  `,
})
export class SearchHeaderComponent { }
