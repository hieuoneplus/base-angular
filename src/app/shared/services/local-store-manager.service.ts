import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import Utils from '../utils/utils';

/**
 * Created date: 2018/11/21
 * Provides a wrapper for accessing the web storage API and synchronizing session storage
 * across tabs/windows.
 */
@Injectable({
  providedIn: 'root'
})
export class LocalStoreManagerService {
  public static readonly DBKEY_USER_DATA = 'user_data';
  private static readonly DBKEY_SYNC_KEYS = 'sync_keys';
  private static reservedKeys: string[] =
    [
      'sync_keys',
      'addToSyncKeys',
      'removeFromSyncKeys',
      'getSessionStorage',
      'setSessionStorage',
      'addToSessionStorage',
      'removeFromSessionStorage',
      'clearAllSessionsStorage'
    ];


  constructor() { }

  private syncKeys: string[] = [];
  private initEvent = new Subject();


  /**
   * Clears all storage
   */
  public clearAllStorage() {
    this.clearAllSessionsStorage();
    this.clearLocalStorage();
  }

  /**
   * Clears all sessions storage
   */
  public clearAllSessionsStorage() {
    this.clearInstanceSessionStorage();

    // Remove DBKEY_SYNC_KEYS
    localStorage.removeItem(LocalStoreManagerService.DBKEY_SYNC_KEYS);

    // active trigger 'clearAllSessionsStorage' on other browser
    localStorage.setItem('clearAllSessionsStorage', '_dummy');
    localStorage.removeItem('clearAllSessionsStorage');
  }

  /**
   * Clears instance session storage
   */
  public clearInstanceSessionStorage() {
    sessionStorage.clear();
    this.syncKeys = [];
  }

  /**
   * Clears local storage
   */
  public clearLocalStorage() {
    localStorage.clear();
  }

  private syncKeysContains(key: string) {
    return this.syncKeys.some(x => x === key);
  }

  private loadSyncKeys() {
    if (this.syncKeys.length) {
      return;
    }

    this.syncKeys = this.getSyncKeysFromStorage();
  }

  private getSyncKeysFromStorage(defaultValue: string[] = []): string[] {

    const data = this.localStorageGetItem(LocalStoreManagerService.DBKEY_SYNC_KEYS);

    if (data == null) {
      return defaultValue;
    } else {
      return data as string[];
    }
  }

  private removeFromSyncKeysBackup(key: string) {

    const storedSyncKeys = this.getSyncKeysFromStorage();

    const index = storedSyncKeys.indexOf(key);

    if (index > -1) {
      storedSyncKeys.splice(index, 1);
      this.localStorageSetItem(LocalStoreManagerService.DBKEY_SYNC_KEYS, storedSyncKeys);
    }
  }

  private addToSyncKeysHelper(key: string) {
    if (!this.syncKeysContains(key)) {
      this.syncKeys.push(key);
    }
  }

  private removeFromSyncKeys(key: string) {
    this.removeFromSyncKeysHelper(key);
    this.removeFromSyncKeysBackup(key);

    localStorage.setItem('removeFromSyncKeys', key);
    localStorage.removeItem('removeFromSyncKeys');
  }

  private removeFromSyncKeysHelper(key: string) {
    const index = this.syncKeys.indexOf(key);

    if (index > -1) {
      this.syncKeys.splice(index, 1);
    }
  }

  /**
   * Saves session data
   */
  public saveSessionData(data: any, key = LocalStoreManagerService.DBKEY_USER_DATA) {
    console.log("saveSessionData", { key, data })
    this.testForInvalidKeys(key);
    this.removeFromSyncKeys(key);
    localStorage.removeItem(key);
    this.sessionStorageSetItem(key, data);
  }

  public saveSyncedSessionData(data: any, key = LocalStoreManagerService.DBKEY_USER_DATA) {
    this.testForInvalidKeys(key);
    localStorage.removeItem(key);
    this.addToSessionStorage(data, key);
  }

  private addToSessionStorage(data: any, key: string) {
    this.addToSessionStorageHelper(data, key);
    this.addToSyncKeysBackup(key);

    this.localStorageSetItem('addToSessionStorage', { key, data });
    localStorage.removeItem('addToSessionStorage');
  }

  private addToSyncKeysBackup(key: string) {
    const storedSyncKeys = this.getSyncKeysFromStorage();

    if (!storedSyncKeys.some(x => x === key)) {
      storedSyncKeys.push(key);
      this.localStorageSetItem(LocalStoreManagerService.DBKEY_SYNC_KEYS, storedSyncKeys);
    }
  }

  private addToSessionStorageHelper(data: any, key: string) {
    this.addToSyncKeysHelper(key);
    this.sessionStorageSetItem(key, data);
  }

  private sessionStorageSetItem(key: string, data: any) {
    sessionStorage.setItem(key, JSON.stringify(data));
  }

  public savePermanentData(data: any, key = LocalStoreManagerService.DBKEY_USER_DATA) {
    this.testForInvalidKeys(key);
    this.removeFromSessionStorage(key);
    this.localStorageSetItem(key, data);
    this.initEvent.next('changed');
  }

  private localStorageSetItem(key: string, data: any) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  private removeFromSessionStorage(keyToRemove: string) {
    this.removeFromSessionStorageHelper(keyToRemove);
    this.removeFromSyncKeysBackup(keyToRemove);

    localStorage.setItem('removeFromSessionStorage', keyToRemove);
    localStorage.removeItem('removeFromSessionStorage');
  }

  private removeFromSessionStorageHelper(keyToRemove: string) {
    sessionStorage.removeItem(keyToRemove);
    this.removeFromSyncKeysHelper(keyToRemove);
  }

  public moveDataToSessionStorage(key = LocalStoreManagerService.DBKEY_USER_DATA) {
    this.testForInvalidKeys(key);

    const data = this.getData(key);

    if (data == null) { return; }

    this.saveSessionData(data, key);
  }

  public moveDataToSyncedSessionStorage(key = LocalStoreManagerService.DBKEY_USER_DATA) {

    this.testForInvalidKeys(key);

    const data = this.getData(key);

    if (data == null) {
      return;
    }

    this.saveSyncedSessionData(data, key);
  }

  public moveDataToPermanentStorage(key = LocalStoreManagerService.DBKEY_USER_DATA) {

    this.testForInvalidKeys(key);

    const data = this.getData(key);

    if (data == null) {
      return;
    }

    this.savePermanentData(data, key);
  }

  public exists(key = LocalStoreManagerService.DBKEY_USER_DATA) {

    let data = sessionStorage.getItem(key);

    if (data == null) { data = localStorage.getItem(key); }

    return data != null;
  }

  public getData(key = LocalStoreManagerService.DBKEY_USER_DATA) {

    this.testForInvalidKeys(key);

    let data = this.sessionStorageGetItem(key);

    if (data == null) {
      data = this.localStorageGetItem(key);
    }

    return data;
  }

  private localStorageGetItem(key: string) {
    return Utils.JSonTryParse(localStorage.getItem(key));
  }

  private sessionStorageGetItem(key: string) {
    return Utils.JSonTryParse(sessionStorage.getItem(key));
  }

  public getDataObject<T>(key = LocalStoreManagerService.DBKEY_USER_DATA, isDateType = false): T | null {

    let data = this.getData(key);

    if (data != null) {
      if (isDateType) {
        data = new Date(data);
      }

      return data as T;
    } else {
      return null;
    }
  }

  public deleteData(key = LocalStoreManagerService.DBKEY_USER_DATA) {

    console.log("deleteData", key)
    this.testForInvalidKeys(key);

    this.removeFromSessionStorage(key);
    localStorage.removeItem(key);
    // this.initEvent.next('changed');
  }

  private testForInvalidKeys(key: string) {
    if (!key) {
      throw new Error('key cannot be empty');
    }

    if (LocalStoreManagerService.reservedKeys.some(x => x === key)) {
      throw new Error(`The storage key '${key}' is reserved and cannot be used. Please use a different key`);
    }
  }
}
