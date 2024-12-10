import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyActionComponent } from './company-action.component';

describe('CompanyActionComponent', () => {
  let component: CompanyActionComponent;
  let fixture: ComponentFixture<CompanyActionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyActionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
