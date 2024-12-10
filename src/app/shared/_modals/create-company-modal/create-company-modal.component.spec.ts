import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCompanyModalComponent } from './create-company-modal.component';

describe('CreateCompanyModalComponent', () => {
  let component: CreateCompanyModalComponent;
  let fixture: ComponentFixture<CreateCompanyModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateCompanyModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCompanyModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
