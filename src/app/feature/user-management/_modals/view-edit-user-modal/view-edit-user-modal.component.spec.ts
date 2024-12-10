import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewEditUserModalComponent } from './view-edit-user-modal.component';

describe('ViewEditUserModalComponent', () => {
  let component: ViewEditUserModalComponent;
  let fixture: ComponentFixture<ViewEditUserModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewEditUserModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewEditUserModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
