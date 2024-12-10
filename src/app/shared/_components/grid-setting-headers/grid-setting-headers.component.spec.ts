import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridSettingHeadersComponent } from './grid-setting-headers.component';

describe('GridSettingHeadersComponent', () => {
  let component: GridSettingHeadersComponent;
  let fixture: ComponentFixture<GridSettingHeadersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GridSettingHeadersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GridSettingHeadersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
