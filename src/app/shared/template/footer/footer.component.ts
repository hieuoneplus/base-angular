import { AfterViewChecked, ChangeDetectorRef, Component, EventEmitter, Input, Output, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import * as $ from 'jquery';

/**
 * Màn hình danh sách button all bot
 */
@Component({
  selector: 'dform-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit, AfterViewChecked {

  @ViewChild('footerButton')
  footerButton!: ElementRef;
  @Input() limitSelected: any;
  @Input() isShowSelection = false;
  @Input() selection = new BehaviorSubject<any>('');
  @Input() listButton = new Observable<any[]>();
  @Input() disabled = false;
  @Output() eventClick = new EventEmitter();
  isShow!: boolean;
  selectionNumber = 0;
  width = 0;
  constructor(private cdRef: ChangeDetectorRef) {
  }

  // tslint:disable-next-line:typedef
  ngOnInit() {
    const elem = $('.dform-child-content');
    if (elem && elem.length > 0) {
      this.refreshWith();
      const resizeObserver = new ResizeObserver(() => {
        this.refreshWith();
      });
      resizeObserver.observe(elem[0]);
    }
    if (this.selection) {
      this.selection.subscribe(res => {
        if (res) this.selectionNumber = res;
        else this.selectionNumber = 0;
      });
    }
  }

  refreshWith(): void {
    if ($('.dform-child-content') && $('.footer-item')) {
      const data = $('.dform-child-content').width();
      if (data && data > 0) {
        $('.footer-item').width(data);
        this.width = data;
      }
    }
  }

  /**
   * Xử lý hiển thị danh sách button footer
   */
  ngAfterViewChecked(): void {
    this.listButton.subscribe(res => {
      if (res && res.length > 0) this.isShow = true;
      this.cdRef.detectChanges();
    });

  }

  onClick(type: any): void {
    this.eventClick.emit(type);
  }
}
