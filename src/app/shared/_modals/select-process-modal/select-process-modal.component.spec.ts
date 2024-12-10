import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectProcessModalComponent } from './select-process-modal.component';

describe('SelectProcessModalComponent', () => {
  let component: SelectProcessModalComponent;
  let fixture: ComponentFixture<SelectProcessModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectProcessModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectProcessModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
