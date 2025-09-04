import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-no-item',
  templateUrl: './no-item.component.html',
  styleUrls: ['./no-item.component.scss']
})
export class NoItemComponent implements OnInit {
  @Input() layout = 'column';
  @Input()
  title!: string;
  @Input() titleNo = 'Chưa đăng ký';
  @Input() fxStart = 'space-between center';
  @Input() showBtn = true;
  @Input() typeBtn = true;
  @Input()
  textBtnIcon!: string;
  @Input() textBtn = 'Đăng ký';
  @Input()
  styleClass!: string;
  @Input() isShowIconPlus = false;
  @Output() onCreate = new EventEmitter();

  constructor(
  ) {}

  ngOnInit() {
  }

  createService() {
    this.onCreate.emit();
  }
}
