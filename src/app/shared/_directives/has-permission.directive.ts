import { Directive, Input, ElementRef, TemplateRef, ViewContainerRef, Host, Optional } from '@angular/core';
import { NgbPanel } from '@ng-bootstrap/ng-bootstrap';

@Directive({
  selector: '[appHasPermission]'
})
export class HasPermissionDirective {

  private currentUser;
  private permissions = [];

  constructor(
    @Host() @Optional() private parent: NgbPanel,
    private element: ElementRef,
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef
  ) {
  }

  ngOnInit() {
    let user = localStorage.getItem('user');
    if(user){
      this.currentUser = JSON.parse(user);
      this.updateView();
    }
  }

  @Input()
  set appHasPermission(val) {
    this.permissions = val;
    this.updateView();
  }

  private updateView() {
    if (this.checkPermission()) {
      if(this.parent){
        this.parent.cardClass = "";
      }
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      if(this.parent){
        this.parent.cardClass = "d-none";
      }
      this.viewContainer.clear();
    }
  }

  private checkPermission() {
    let hasPermission = false;

    if (this.currentUser && this.currentUser.roles) {
      hasPermission = this.currentUser.roles.some(r => this.permissions.includes(r))
    }

    return hasPermission;
  }

}
