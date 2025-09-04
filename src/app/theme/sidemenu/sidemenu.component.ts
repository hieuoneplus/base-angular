import { Component, Input, ViewEncapsulation } from '@angular/core';
import { LocalStoreEnum, LocalStoreManagerService } from '@shared-sm';
import { MenuService } from 'src/app/shared/services/menu.service';

@Component({
  selector: 'app-sidemenu',
  templateUrl: './sidemenu.component.html',
  styleUrls: ['./sidemenu.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SidemenuComponent {
  // NOTE: Ripple effect make page flashing on mobile
  @Input() ripple = true;
  //url = 'http://10.63.130.244/DFORM/Account/Login';
  // url = environment.ipDformOld;
  url = 'http://10.1.27.43:9684/auth/login';
  menus = this.menu.getAll();
  winData;
  route;
  isLoad = false;
  constructor(private menu: MenuService,
    private localStore: LocalStoreManagerService) {
  }

  // Delete empty values and rebuild route
  buildRoute(routes: string[]) {
    let route = '';
    routes.forEach(item => {
      if (item && item.trim()) {
        route += '/' + item.replace(/^\/+|\/+$/g, '');
      }
    });
    return route;
  }


  loadUrl(route) {
    this.isLoad = true;
    this.route = route;
    this.winData = window.open(this.url, "_blank");
    window.addEventListener('message', this.load, false);
  }

  load = (event) => {
    if (this.isLoad && event.data && (typeof event.data === 'string' || event.data instanceof String) && event.data === 'ping') {
      const token = this.localStore.getData(LocalStoreEnum.Token_Jwt)
      this.winData.postMessage({ token, refUrl: this.route }, this.url);
      this.isLoad = false;
    }
  }

}
