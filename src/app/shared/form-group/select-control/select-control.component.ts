import { AfterViewInit, Component, ViewChild,Input } from '@angular/core';
import { FormGroupAbstractComponent } from '../form-group.abstract.component';

@Component({
  selector: 'sm-select-control',
  templateUrl: './select-control.component.html',
  styleUrls: ['./select-control.component.scss']
})
export class SelectControlComponent extends FormGroupAbstractComponent implements AfterViewInit {
  @ViewChild('selectElement') selectElement: any;
  @Input() maxLengthView = false;
  isExist = false;
  constructor() {
    super();
  }

  ngAfterViewInit() {
    if (this.item.focus) {
      setTimeout(() => {
        this.selectElement.nativeElement.focus();
      }, 100);
    }
  }

  onSelectChange(selectedValue: any) {
    // if(this.item.type !== 'multiple') {
    //   this.f[this.item.key].patchValue(selectedValue?.key !== undefined ? selectedValue?.key : null); ;
    if(this.item.type === 'multiple'){
      const keys = selectedValue.map((item: any) => item.key);
      this.f[this.item.key].patchValue(keys);
      this.selectElement.searchTerm = '';
      this.selectElement.close();
      this.selectElement.open();
    }
    
  }

  onBlur() {
    if (this.item.type === 'multiple') {
      this.selectElement.close();
    }
  }

  onClear() {
    if (this.item.type !== 'multiple') {
      this.f[this.item.key].patchValue(null);
    } else {
      this.f[this.item.key].patchValue([]);
    }
  }

  makeChoice(e) {
    if (this.item.type !== 'multiple') {
      const totalOptions = this.selectElement.dropdownPanel?.contentElementRef?.nativeElement?.children;
      if (totalOptions) {
        for (let i = 0; i < totalOptions.length; i++) {
          if (totalOptions[i].classList.value.includes('ng-option-marked')) {
            if (e.key === 'ArrowDown') {
              if (i === totalOptions.length - 1) {
                this.f[this.item.key].patchValue(this.item.options[0].key);
              } else {
                this.f[this.item.key].patchValue(this.item.options[i + 1].key);
              }
            } else if (e.key === 'ArrowUp') {
              if (i === 0) {
                this.f[this.item.key].patchValue(this.item.options[totalOptions.length - 1].key);
              } else {
                this.f[this.item.key].patchValue(this.item.options[i - 1].key);
              }
            }
          }
        }
      }
    }
  }

  onSearch($event) {
    if ($event) {
      const selectedItems = this.selectElement.itemsList?.selectedItems;
      if (selectedItems && selectedItems.length > 0) {
        const selectedEmail = selectedItems.map(x => x.label);
        if (selectedEmail.includes($event.term)) {
          this.isExist = true;
        } else {
          this.isExist = false;
        }
      } else {
        this.isExist = false;
      }
    } else {
      this.isExist = false;
    }
  }
}
