import {
  ChangeDetectionStrategy, Component,


  EventEmitter, OnInit,
  Output,



  ViewEncapsulation
} from '@angular/core';
import { LocalStoreManagerService } from '@core';
import { environment } from '@env/environment';
import { LocalStoreEnum } from '@shared';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit {
  opened = false;
  ipDform = environment.ipDform;

  route;
  winData;
  url = environment.ipDformOld;
  isLoad = true;
  @Output() toggleSidenav = new EventEmitter<void>();
  @Output() toggleCollapsed = new EventEmitter<void>();
  @Output() toggleMenu = new EventEmitter<any>();
  constructor(
    private localStore: LocalStoreManagerService
  ) { }

  ngOnInit() { }

  toggleFullscreen() {
  }

  toggleMenuChange($event) {
    this.toggleMenu.emit($event);
  }

  useMode(mode) {
    this.toggleMenu.emit(mode);
    this.opened = !this.opened;
  }

  onOpened(opened) {
    this.opened = !opened;
  }

  loadUrl() {
    this.isLoad = true;
    this.route = '';
    this.winData = window.open(this.url, "_blank");
    window.addEventListener('message', this.load, false);
  }

  load = (event) => {
    if (this.isLoad && event.data && (typeof event.data === 'string' || event.data instanceof String) && event.data === 'ping') {
      const token = this.localStore.getData(LocalStoreEnum.Token)
      this.winData.postMessage({ token, refUrl: this.route }, this.url);
      this.isLoad = false;
    }
  }
}
