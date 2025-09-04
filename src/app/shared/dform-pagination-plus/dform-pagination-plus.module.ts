import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { DformPaginationPlusComponent } from './dform-pagination-plus.component';


@NgModule({
  imports: [
    CommonModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatPaginatorModule,
    MatSelectModule,
    FormsModule,
  ],
  exports: [DformPaginationPlusComponent],
  declarations: [DformPaginationPlusComponent]
})
export class DformPaginationPlusModule { }
