import { Directive, HostListener, Inject } from '@angular/core';

import { AccordionItemTreeDirective } from './accordionItem-tree.directive';

@Directive({
  selector: '[navAccordionToggle]',
})
export class AccordionAnchorTreeDirective {
  protected navlink: AccordionItemTreeDirective;

  constructor(@Inject(AccordionItemTreeDirective) navlink: AccordionItemTreeDirective) {
    this.navlink = navlink;
  }

  @HostListener('click', ['$event'])
  onClick() {
    this.navlink.toggle();
  }
}
