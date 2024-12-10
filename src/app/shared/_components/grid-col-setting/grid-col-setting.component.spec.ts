import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridColSettingComponent } from './grid-col-setting.component';

describe('GridColSettingComponent', () => {
  let component: GridColSettingComponent;
  let fixture: ComponentFixture<GridColSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GridColSettingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GridColSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
