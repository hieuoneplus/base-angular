import { Directionality } from '@angular/cdk/bidi';
import { BreakpointObserver } from '@angular/cdk/layout';
import { OverlayContainer } from '@angular/cdk/overlay';
import { DOCUMENT } from '@angular/common';
import {
  Component,
  ElementRef, HostBinding,
  HostListener,
  Inject, OnDestroy, OnInit,
  Optional, ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { MatSidenav, MatSidenavContent } from '@angular/material/sidenav';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import * as $ from 'jquery';
import { DformDialogService, LocalStoreEnum, LocalStoreManagerService } from '@shared-sm';
import { MenuService } from 'src/app/shared/services/menu.service';
import { SettingsService } from 'src/app/shared/services/settings.service';
import { AppDirectionality } from 'src/app/shared/services/directionality.service';
import { AppSettings } from 'src/app/shared/services/settings';
import { environment } from '@env/environment';


export const MOBILE_MEDIAQUERY = 'screen and (max-width: 599px)';
export const TABLET_MEDIAQUERY = 'screen and (min-width: 600px) and (max-width: 959px)';
export const MONITOR_MEDIAQUERY = 'screen and (min-width: 960px)';

@Component({
  selector: 'app-dform-layout',
  templateUrl: './dform-layout.component.html',
  styleUrls: ['./dform-layout.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DformLayoutComponent implements OnInit, OnDestroy {
  @ViewChild('sidenav', { static: true }) sidenav: MatSidenav;
  @ViewChild('content', { static: true }) content: MatSidenavContent;
  routerSub: Subscription;
  options = this.settings.getOptions();

  private layoutChangesSubscription: Subscription;

  private isMobileScreen = false;
  get isOver(): boolean {
    return this.isMobileScreen;
  }

  private contentWidthFix = true;
  @HostBinding('class.dform-content-width-fix') get isContentWidthFix() {
    return (
      this.contentWidthFix &&
      this.options.navPos === 'side' &&
      this.options.sidenavOpened &&
      !this.isOver
    );
  }

  private collapsedWidthFix = true;
  @HostBinding('class.dform-sidenav-collapsed-fix') get isCollapsedWidthFix() {
    return (
      this.collapsedWidthFix &&
      (this.options.navPos === 'top' || (this.options.sidenavOpened && this.isOver))
    );
  }

  constructor(
    private router: Router,
    private breakpointObserver: BreakpointObserver,
    private overlay: OverlayContainer,
    private element: ElementRef,
    private dialogService: DformDialogService,
    private menu: MenuService,
    private localStore: LocalStoreManagerService,
    private settings: SettingsService,
    @Optional() @Inject(DOCUMENT) private document: Document,
    @Inject(Directionality) public dir: AppDirectionality
  ) {
    this.dir.value = this.options.dir;
    this.document.body.dir = this.dir.value;

    this.layoutChangesSubscription = this.breakpointObserver
      .observe([MOBILE_MEDIAQUERY, TABLET_MEDIAQUERY, MONITOR_MEDIAQUERY])
      .subscribe(state => {
        // this.isMobileScreen = state.breakpoints[MOBILE_MEDIAQUERY] || state.breakpoints[TABLET_MEDIAQUERY];
        // this.options.sidenavCollapsed = state.breakpoints[TABLET_MEDIAQUERY];
        // this.contentWidthFix = state.breakpoints[MONITOR_MEDIAQUERY];

        // SidenavOpened must be reset true when layout changes
        this.isMobileScreen = false;
        this.options.sidenavOpened = this.isOver ? false : true;
        this.resetCollapsedState();
      });

    this.settings.notify.subscribe(res => {
      if (res && res.type === 'collapsed') {
        setTimeout(() => {
          this.options.sidenavCollapsed = res.value;
        }, 0);
      }
    });

    this.routerSub = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((evt: NavigationEnd) => {
        this.content.scrollTo({ top: 0 });
        if (evt.urlAfterRedirects.includes(environment.key)) {
          console.log("NavigationEnd");
          const menus = this.localStore.getData(LocalStoreEnum.Menu_List);
          this.setMenuDform(menus);
        }
      });
  }

  ngOnInit() {
    setTimeout(() => (this.contentWidthFix = this.collapsedWidthFix = false));
  }

  ngOnDestroy() {
    this.layoutChangesSubscription.unsubscribe();
  }

  toggleCollapsed() {
    this.options.sidenavCollapsed = !this.options.sidenavCollapsed;
    this.resetCollapsedState();
  }

  resetCollapsedState(timer = 400) {
    // TODO: Trigger when transition end
    setTimeout(() => {
      this.settings.setNavState('collapsed', this.options.sidenavCollapsed);
    }, timer);
  }

  sidenavCloseStart() {
    this.contentWidthFix = false;
  }

  sidenavOpenedChange(isOpened: boolean) {
    this.options.sidenavOpened = isOpened;
    this.settings.setNavState('opened', isOpened);

    this.collapsedWidthFix = !this.isOver;
    this.resetCollapsedState();
  }

  /** Demo purposes only */
  receiveOptions(options: AppSettings): void {
    this.options = options;
    this.toggleDarkTheme(options);
    this.toggleDirection(options);
  }

  toggleDarkTheme(options: AppSettings) {
    if (options.theme === 'dark') {
      this.element.nativeElement.classList.add('theme-dark');
      this.overlay.getContainerElement().classList.add('theme-dark');
    } else {
      this.element.nativeElement.classList.remove('theme-dark');
      this.overlay.getContainerElement().classList.remove('theme-dark');
    }
  }

  toggleDirection(options: AppSettings) {
    this.dir.value = options.dir;
    this.document.body.dir = this.dir.value;
  }

  /**
   * Xử lý thay đổi mode giữa EMB và DFORM
   * @param $event;
   */
  toggleMenuChange($event) {
    switch ($event) {
      case 1:
        const menusDform = this.localStore.getData(LocalStoreEnum.Menu_List);
        if (!menusDform) {
          this.dialogService.error({
            title: 'dialog.notification',
            message: 'error.dform-error-connect'
          }, result => {
            if (result) {
            }
          });
          return;
        }
        this.router.navigate(['']);
        break;
      default:
        break;
    }
  }

  /**
   * Xử lý set thông tin menu Dform
   * @param menus;
   */
  setMenuDform(menus) {
    this.routerSub.unsubscribe();
    const menusData = this.menu.mapMenu(menus, 0);
    this.menu.set(menusData);
    this.options.menuMode = 1;
  }


  @HostListener("window:scroll", [])
  onWindowScroll($event) {
    const clientHeight = document.getElementById("content") && document.getElementById("content").clientHeight
    if ($event.srcElement.scrollTop > 200 && clientHeight > 1080) {
      $('#header-cutomer').addClass('sticky');
      $('.dform-col-left').addClass('dform-fixed')
    } else {
      $('#header-cutomer').removeClass('sticky');
      $('.dform-col-left').removeClass('dform-fixed')
    }
  }
}
