import { Component, HostBinding, OnInit, Input } from '@angular/core';
import { ActivityIndicatorSingletonService } from './activity-indicator-singleton.service';
import { activityIndicatorAnimation } from './activityIndicatorAnimation';

@Component({
  selector: 'dform-activity-indicator-singleton',
  templateUrl: './activity-indicator-singleton.component.html',
  styleUrls: ['./activity-indicator-singleton.component.scss'],
  animations: [activityIndicatorAnimation]
})
export class ActivityIndicatorComponent implements OnInit {
  @HostBinding('class.isHidden') isHidden = true;
  // tslint:disable-next-line:variable-name
  @Input() IsDialog;
  constructor(public activityIndicatorService: ActivityIndicatorSingletonService) { }
  isLoading = false;
  isFailed = false;
  tryAgain: any;
  state = 'loop1';
  timeout: any;

  ngOnInit() {
    this.activityIndicatorService.isLoading.subscribe((res) => {
      this.isLoading = res && !this.IsDialog;
      clearTimeout(this.timeout);
      if (this.isLoading === false) {
        this.state = 'stop';
        this.timeout = setTimeout(() => {
          this.isHidden = true;
        }, 1400);
      } else {
        this.isHidden = false;
        this.state = 'loop1';
      }
    });

    this.activityIndicatorService.isLoadingDialog.subscribe((res) => {
      this.isLoading = res && this.IsDialog;
      clearTimeout(this.timeout);
      if (this.isLoading === false) {
        this.state = 'stop';
        this.timeout = setTimeout(() => {
          this.isHidden = true;
        }, 1400);
      } else {
        this.isHidden = false;
        this.state = 'loop1';
      }
    });

    this.activityIndicatorService.isFailed.subscribe((res) => {
      this.isFailed = res;
    });

    this.activityIndicatorService.tryAgain.subscribe((res) => {
      this.tryAgain = res;
    });
  }

  click() {
    this.tryAgain();
  }
}
