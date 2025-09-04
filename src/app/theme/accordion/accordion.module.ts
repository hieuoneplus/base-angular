import { AccordionTreeDirective } from './accordion-tree.directive';
import { AccordionAnchorTreeDirective } from './accordionanchor-tree.directive';
import { AccordionItemTreeDirective } from './accordionItem-tree.directive';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    AccordionItemTreeDirective, 
    AccordionAnchorTreeDirective, 
    AccordionTreeDirective
  ],
  exports: [
    AccordionItemTreeDirective, 
    AccordionAnchorTreeDirective, 
    AccordionTreeDirective
  ],
  providers: [
  ]
})
export class AccordionModule {}
