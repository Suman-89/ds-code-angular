import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRefDataComponent } from './add-ref-data.component';

describe('AddRefDataComponent', () => {
  let component: AddRefDataComponent;
  let fixture: ComponentFixture<AddRefDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddRefDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRefDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
