import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VmtTabsViewComponent } from './vmt-tabs-view.component';

describe('VmtTabsViewComponent', () => {
  let component: VmtTabsViewComponent;
  let fixture: ComponentFixture<VmtTabsViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VmtTabsViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VmtTabsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
