import { Directive, HostBinding, Inject, Input, OnInit, OnDestroy } from '@angular/core';

import { AccordionTreeDirective } from './accordion-tree.directive';

@Directive({
  selector: '[navAccordionItem]',
})
export class AccordionItemTreeDirective implements OnInit, OnDestroy {
  protected OPEN = false;
  protected nav: AccordionTreeDirective;

  @Input() group: any;
  @Input() type: 'link' | 'sub' | 'sub-none-link' | 'extLink' | 'extTabLink';

  @HostBinding('class.open')
  @Input()
  get open(): boolean {
    return this.OPEN;
  }
  set open(value: boolean) {
    // Only sub menu can be open
    this.OPEN = (this.type === 'sub' || this.type === 'sub-none-link') && value;
    if (value) {
      this.nav.closeOtherLinks(this);
    }
  }

  constructor(@Inject(AccordionTreeDirective) nav: AccordionTreeDirective) {
    this.nav = nav;
  }

  ngOnInit(): any {
    this.nav.addLink(this);
  }

  ngOnDestroy(): any {
    this.nav.removeGroup(this);
  }

  toggle(): any {
    this.open = !this.open;
  }
}
