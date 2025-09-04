import {Injector} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {ComponentAbstract} from './component.abstract';
import {FormType} from '@shared-sm';


export abstract class ComponentDialogAbstract extends ComponentAbstract {
  public infoItem: FormType<string>[];
  protected dialog: MatDialog;

  protected abstract saveData(): void;

  protected abstract closeDialog(): void;

  constructor(protected injector: Injector) {
    super(injector);
    this.dialog = injector.get(MatDialog);
  }
}
