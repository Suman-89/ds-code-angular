import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToggleSwitchTypeComponent } from './toggle-switch-type.component';

describe('ToggleSwitchTypeComponent', () => {
  let component: ToggleSwitchTypeComponent;
  let fixture: ComponentFixture<ToggleSwitchTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ToggleSwitchTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToggleSwitchTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
