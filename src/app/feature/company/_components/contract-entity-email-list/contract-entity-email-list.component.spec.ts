import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractEntityEmailListComponent } from './contract-entity-email-list.component';

describe('ContractEntityEmailListComponent', () => {
  let component: ContractEntityEmailListComponent;
  let fixture: ComponentFixture<ContractEntityEmailListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractEntityEmailListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractEntityEmailListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
