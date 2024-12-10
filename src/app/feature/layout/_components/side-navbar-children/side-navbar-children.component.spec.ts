import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SideNavbarChildrenComponent } from './side-navbar-children.component';

describe('SideNavbarChildrenComponent', () => {
  let component: SideNavbarChildrenComponent;
  let fixture: ComponentFixture<SideNavbarChildrenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SideNavbarChildrenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SideNavbarChildrenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
