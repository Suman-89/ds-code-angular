import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InstancePanelComponent } from './instance-panel.component';

describe('InstancePanelComponent', () => {
  let component: InstancePanelComponent;
  let fixture: ComponentFixture<InstancePanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InstancePanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstancePanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
