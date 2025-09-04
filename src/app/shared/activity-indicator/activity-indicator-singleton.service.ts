import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ActivityIndicatorSingletonService {
  isLoadingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  isLoadingDialogSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  isFailedSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  tryAgainSubject: BehaviorSubject<any> = new BehaviorSubject<any>(() => {
    this.hideActivityIndicator();
  });

  isLoading = this.isLoadingSubject.asObservable();
  isLoadingDialog = this.isLoadingDialogSubject.asObservable();
  isFailed = this.isFailedSubject.asObservable();
  tryAgain = this.tryAgainSubject.asObservable();

  constructor() { }

  /**
   * @description Hiển thị Activity Indicator
   */
  showActivityIndicator(isScreen: boolean = true) {
    if (isScreen) {
      this.isLoadingSubject.next(true);
    } else {
      this.isLoadingDialogSubject.next(true);
    }
    this.isFailedSubject.next(false);
    this.tryAgainSubject.next(() => { });
  }

  /**
   * @description Ẩn Activity Indicator
   */
  hideActivityIndicator(isScreen: boolean = true) {
    if (isScreen) {
      this.isLoadingSubject.next(false);
    } else {
      this.isLoadingDialogSubject.next(false);
    }
    this.isFailedSubject.next(false);
  }

  /**
   * @description Hiển thị nút Try Again
   */
  showLoadFailed(isScreen: boolean = true) {
    if (isScreen) {
      this.isLoadingSubject.next(true);
    } else {
      this.isLoadingDialogSubject.next(true);
    }
    this.isFailedSubject.next(true);
  }

  /**
   * @description Cập nhật hàm tryAgain
   * @param callback;
   */
  updateTryAgain(callback: any) {
    this.tryAgainSubject.next(callback);
  }
}
