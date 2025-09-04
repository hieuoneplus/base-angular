import { coerceNumberProperty } from '@angular/cdk/coercion';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'dform-pagination-role',
  templateUrl: './dform-pagination-role.component.html',
  styleUrls: ['./dform-pagination-role.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DformPaginationRoleComponent implements OnInit, OnDestroy {
  @Input() isLoadServer = false;
  @Input() totalItem?: number;
  @Input() showTextPage = true;
  @Input() pageSizeList = [5, 10, 20, 50];
  @Input() showPageSizeList = false;
  @Input()
  get pageSize(): number { return this._pageSize; }
  set pageSize(value: number) {
    this._pageSize = Math.max(coerceNumberProperty(value), 0);
    if (this.paginator) {
      this.paginator.pageSize = this.pageSize ? this.pageSize : 0;
    }
  }
  private _pageSize = 0;

  @Input()
  get pageIndex(): number { return this._pageIndex; }
  set pageIndex(value: number) {
    this._pageIndex = Math.max(coerceNumberProperty(value), 0);
  }
  private _pageIndex = 0;

  @Input()
  get length(): number { return this._length; }
  set length(value: number) {
    this._length = Math.max(coerceNumberProperty(value), 0);
    if (this.paginator) {
      this.paginator.length = value ? value : 0;
    }
    this.setPageData();
  }
  private _length = 0;
  @ViewChild('page', { static: true }) paginator: MatPaginator;

  @Output() readonly page: EventEmitter<PageEvent> = new EventEmitter<PageEvent>();

  pages: any;
  pageItemsPerView = 10;
  allPages: [{ label: any, value: any }];

  private startPageItem: number;
  private endPageItem: number;
  private initilzed: boolean;
  private readonly breakpoints: any = {
    'max-576': '(max-width: 576px)',
    'min-577': '(min-width: 577px)'
  };
  private _pageListLabel = this.translateService.instant('lbl.goto_page');
  get pageListLbable(): string { return this._pageListLabel; }
  set pageListLbable(label: string) { this._pageListLabel = label; }
  pageSizeName = 2;

  subscription: Subscription;

  @ViewChild('input') input: ElementRef<HTMLInputElement>;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private cdRef: ChangeDetectorRef,
    private translateService: TranslateService
  ) {
  }

  // tslint:disable-next-line: use-lifecycle-interface
  ngOnChanges(change: any) {
    // refresh index pagin to 0
    if (change.totalItem && change.totalItem.currentValue !== change.totalItem.previousValue) {
      this.buildPaginator(this.pageIndex);
      if (this.paginator) {
        this.paginator.pageIndex = this._pageIndex;
      }
    }
  }

  ngOnInit() {
    this.initilzed = true;
    this.onWindowResize();
    this.buildPaginator();
    this.setPageList();
    this.setPageData();
  }

  getTranlateService() { return this.translateService; }

  get numberOfPages(): number {
    const pageSize = coerceNumberProperty(this.pageSize);
    return (this.totalItem && pageSize) ? Math.ceil(this.totalItem / this.pageSize) : 0;
  }

  private get middleIndex() {
    return this.pageItemsPerView % 2 === 0 ?
      Math.ceil(this.pageItemsPerView / 2) : Math.floor(this.pageItemsPerView / 2);
  }

  private setPageData() {
    if (!this.initilzed) { return; }
    this.setPageList();
    this.pageIndex > 0 ? this.buildPaginator(this.pageIndex) : this.buildPaginator(0);
  }

  private setPageList() {
    if (this.showPageSizeList) {
      this.allPages = [] as any;
      for (let i = 1; i <= this.numberOfPages; i++) {
        this.allPages.push({ value: i, label: i });
      }
    }
    this.cdRef.detectChanges();
  }

  buildPaginator(pageIndex?: number) {
    this.pages = [];
    if (this.numberOfPages > 7) {
      if (pageIndex > 3) {
        this.pages.push({ value: 1, label: 1 });
        this.pages.push({ value: 2, label: 2 });
        this.pages.push({ value: 0, label: '...' });
        this.startPageItem = pageIndex;
        this.endPageItem = this.numberOfPages - pageIndex > 3 ? pageIndex + 3 : this.numberOfPages;
        for (let i = this.startPageItem; i <= this.endPageItem; i++) {
          this.pages.push({ value: i, label: i });
        }
      } else {
        if (pageIndex > 0) {
          this.pages.push({ value: pageIndex, label: pageIndex });
          this.startPageItem = pageIndex + 1;
          for (let i = this.startPageItem; i <= this.startPageItem + 1; i++) {
            this.pages.push({ value: i, label: i });
          }
        } else {
          this.startPageItem = pageIndex + 1;
          for (let i = this.startPageItem; i <= this.startPageItem + 2; i++) {
            this.pages.push({ value: i, label: i });
          }
        }
        this.pages.push({ value: 0, label: '...' });
        for (let i = this.numberOfPages - 1; i <= this.numberOfPages; i++) {
          this.pages.push({ value: i, label: i });
        }
      }
    } else {
      this.startPageItem = pageIndex + 1;
      this.endPageItem = this.numberOfPages;
      for (let i = 1; i <= this.endPageItem; i++) {
        this.pages.push({ value: i, label: i });
      }
    }
    this.cdRef.detectChanges();
  }

  private setPageItemsPerView(pageItemsPerView: number, pageIndex: number) {
    this.pageItemsPerView = pageItemsPerView;
    this.buildPaginator(pageIndex);
  }

  private onWindowResize() {
    this.subscription = this.breakpointObserver.observe([
      this.breakpoints['max-576'],
      this.breakpoints['min-577']
    ]).subscribe((state: BreakpointState) => {
      if (state.breakpoints[this.breakpoints['max-576']]) {
        this.setPageItemsPerView(5, this.paginator.pageIndex);
      } else if (state.breakpoints[this.breakpoints['min-577']]) {
        this.setPageItemsPerView(10, this.paginator ? this.paginator.pageIndex : 0);
      }
    });
  }

  setPageIndex(pageIndex: number, isClicked: boolean = false) { /* set pages on zero-based ( index start with 0 ) */
    if (pageIndex >= 0 && pageIndex !== this.pageIndex) {
      if (this.paginator.pageIndex === pageIndex && isClicked) { return; }
      pageIndex = pageIndex >= this.numberOfPages ? this.numberOfPages - 1 : pageIndex;
      this.paginator.pageIndex = pageIndex;
      this.buildPaginator(pageIndex);
      if (!this.isLoadServer) {
        this.pageIndex = pageIndex;
        this.paginator.page.emit({
          previousPageIndex: pageIndex - 1,
          pageIndex,
          pageSize: this.paginator.pageSize,
          length: this.paginator.length
        });
      } else {
        this.page.emit({
          previousPageIndex: pageIndex - 1,
          pageIndex,
          pageSize: this.paginator.pageSize,
          length: this.paginator.length
        });
      }
    }
  }

  emitDataPagination() {

  }

  onPageChange(event: PageEvent) {
    this.page.emit(event);
  }

  goto(pageSize: number, pageIndex: number = 0) {
    this.pageSize = pageSize === -1 ? this.totalItem : pageSize;
    this.pageIndex = pageIndex;
    this.setPageData();
    if (this.input) {
      this.input.nativeElement.value = '';
    }
    if (!this.isLoadServer) {
      this.paginator.page.emit({
        previousPageIndex: pageIndex - 1,
        pageIndex,
        pageSize: this.paginator.pageSize,
        length: this.paginator.length
      });
    } else {
      this.page.emit({
        previousPageIndex: - 1,
        pageIndex,
        pageSize: this.paginator.pageSize,
        length: this.paginator.length
      });
    }
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
