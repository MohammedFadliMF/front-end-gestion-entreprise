import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingTaxComponent } from './setting-tax.component';

describe('SettingTaxComponent', () => {
  let component: SettingTaxComponent;
  let fixture: ComponentFixture<SettingTaxComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SettingTaxComponent]
    });
    fixture = TestBed.createComponent(SettingTaxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
