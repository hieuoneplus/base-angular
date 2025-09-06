import { Component, Input, OnDestroy, OnInit, ViewEncapsulation, HostListener, ElementRef } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { LocalStoreEnum, LocalStoreManagerService } from '@shared-sm';
import * as _ from 'lodash';
import { Subscription } from 'rxjs';
import { MenuService } from 'src/app/shared/services/menu.service';

@Component({
  selector: 'page-header',
  host: {
    class: 'dform-page-header',
  },
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PageHeaderComponent implements OnInit, OnDestroy {
  @Input() title = '';
  @Input() subtitle = '';
  @Input() nav: string[] = [];
  @Input() showBreadCrumb = true;
  @Input() isSubMenu = false;
  a = 'Đăng kí dịch vụ'
  navBar;
  routerSub: Subscription;
  
  // User profile properties
  userName: string = '';
  isUserMenuOpen: boolean = false;

  constructor(
    private router: Router,
    private menu: MenuService,
    private localStore: LocalStoreManagerService,
    private elementRef: ElementRef
  ) { }

  ngOnInit() {
    this.nav = Array.isArray(this.nav) ? this.nav : [];
    this.routerSub = this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        // see also
        this.genBreadcrumb(val.urlAfterRedirects);
      }
    });
    if (this.nav.length === 0) {
      this.genBreadcrumb(this.router.url);
    }

    this.title = this.title || this.nav[this.nav.length - 1];
    
    // Get user name from local storage
    this.getUserName();
  }

  trackByNavlink(index: number, navlink): string {
    return navlink.name;
  }

  /**
   * Xử lý lấy thông tin Breadcrumb
   * @param url;
   */
  genBreadcrumb(url: string) {
    console.log("URL", url);
    
    if (!url || (url && url.includes('emb') && url.includes('auth'))) { return; }
    url = this.menu.removeURLParameter(url);
    const menus = this.localStore.getData(LocalStoreEnum.Menu_List);

    const linkBread = (menus || []).find(element => {
      return element.route === url.substring(1);
    });
    console.log("linkBread", linkBread);
    if (linkBread) {
      const menuss = this.getMenuBreadcrumb(menus, linkBread.parentId);
      menuss.push(linkBread);
      this.navBar = menuss;
    } else {
      this.navBar = [];
    }
  }

  private getMenuBreadcrumb(menus, parentId) {
    console.log("getMenuBreadcrumb", menus,parentId);
    const listBread = [];
    const linkBread = (menus || []).find(element => {
      return element.id === parentId;
    });
    console.log("bread 1", listBread);
    if (linkBread) {
      const parentList = this.getMenuBreadcrumb(menus, linkBread.parentId);
      return [...parentList, ..._.castArray(linkBread)];
    }
    console.log("bread 2", listBread);
    
    return listBread;
  }

  /**
   * Get user name from local storage
   */
  getUserName() {
    this.userName = this.localStore.getData(LocalStoreEnum.USER_NAME) || 'User';
  }

  /**
   * Toggle user menu dropdown
   */
  toggleUserMenu() {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  /**
   * Close user menu when clicking outside
   */
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isUserMenuOpen = false;
    }
  }

  closeUserMenu() {
    this.isUserMenuOpen = false;
  }

  /**
   * Get user initials for avatar
   */
  getUserInitials(): string {
    if (!this.userName) return 'U';
    const names = this.userName.split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[names.length - 1][0]).toUpperCase();
    }
    return this.userName[0].toUpperCase();
  }

  /**
   * Logout method - clears local storage and navigates to welcome screen
   */
  logout() {
    // Clear all authentication related data from local storage
    this.localStore.clearAllStorage();
    // this.localStore.removeData(LocalStoreEnum.RefreshToken);
    // this.localStore.removeData(LocalStoreEnum.Menu_List);
    // this.localStore.removeData(LocalStoreEnum.pmp_permissions);
    // this.localStore.removeData(LocalStoreEnum.USER_NAME);
    // this.localStore.removeData(LocalStoreEnum.User_Infor);
    // this.localStore.removeData(LocalStoreEnum.Bilateral_User_Infor);
    // this.localStore.removeData(LocalStoreEnum.pmp_verified_otp);
    
    // Navigate to welcome screen
    this.router.navigate(['/welcome']);
  }

  ngOnDestroy() {
    if (this.routerSub) {
      this.routerSub.unsubscribe();
    }
  }
}
