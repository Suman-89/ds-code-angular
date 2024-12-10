import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractingEntitiesComponent } from './contracting-entities.component';

describe('ContractingEntitiesComponent', () => {
  let component: ContractingEntitiesComponent;
  let fixture: ComponentFixture<ContractingEntitiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractingEntitiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractingEntitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
