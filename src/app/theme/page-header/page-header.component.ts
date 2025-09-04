import { Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
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

  constructor(
    private router: Router,
    private menu: MenuService,
    private localStore: LocalStoreManagerService
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

  ngOnDestroy() {
    if (this.routerSub) {
      this.routerSub.unsubscribe();
    }
  }
}
