import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProcNamesComponent } from './add-proc-names.component';

describe('AddProcNamesComponent', () => {
  let component: AddProcNamesComponent;
  let fixture: ComponentFixture<AddProcNamesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddProcNamesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddProcNamesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
