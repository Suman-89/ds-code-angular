import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RulesetInputTypeComponent } from './ruleset-input-type.component';

describe('RulesetInputTypeComponent', () => {
  let component: RulesetInputTypeComponent;
  let fixture: ComponentFixture<RulesetInputTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RulesetInputTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RulesetInputTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
