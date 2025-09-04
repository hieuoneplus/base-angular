import { AfterContentChecked, Directive } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AccordionItemTreeDirective } from './accordionItem-tree.directive';

@Directive({
  selector: '[navAccordion]',
})
export class AccordionTreeDirective implements AfterContentChecked {
  protected navlinks: Array<AccordionItemTreeDirective> = [];

  constructor(private router: Router) {
    // Fix: `ERROR Error: ExpressionChangedAfterItHasBeenCheckedError:
    // Expression has changed after it was checked`.
    setTimeout(() => this.checkOpenLinks());
  }

  ngAfterContentChecked(): void {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(e => this.checkOpenLinks());
  }

  addLink(link: AccordionItemTreeDirective): void {
    this.navlinks.push(link);
  }

  closeOtherLinks(openLink: AccordionItemTreeDirective): void {
    this.navlinks.forEach((link: AccordionItemTreeDirective) => {
      if (link !== openLink) {
        link.open = false;
      }
    });
  }

  removeGroup(link: AccordionItemTreeDirective): void {
    const index = this.navlinks.indexOf(link);
    if (index !== -1) {
      this.navlinks.splice(index, 1);
    }
  }

  checkOpenLinks() {
    this.navlinks.forEach((link: AccordionItemTreeDirective) => {
      if (link.group) {
        const routeUrl = this.router.url;
        const currentUrl = routeUrl.split('/');
        if (currentUrl.includes(link.group)) {
          link.open = true;
          this.closeOtherLinks(link);
        }
      }
    });
  }
}
