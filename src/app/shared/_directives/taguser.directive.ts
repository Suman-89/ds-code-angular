import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appTaguser]'
})
export class TaguserDirective {

  @Input('appTaguser') dataChanges: any;


  constructor(private el: ElementRef) {
  }

  @HostListener('keyup') onMouseEnter() {
    
  }
  
  @HostListener('mouseleave') onMouseLeave() {
    this.highlight(null);
  }
  
  private highlight(color: string) {
    this.el.nativeElement.style.backgroundColor = color;
  }

}
