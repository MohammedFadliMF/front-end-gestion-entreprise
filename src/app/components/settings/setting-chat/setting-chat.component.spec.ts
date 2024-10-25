import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingChatComponent } from './setting-chat.component';

describe('SettingChatComponent', () => {
  let component: SettingChatComponent;
  let fixture: ComponentFixture<SettingChatComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SettingChatComponent]
    });
    fixture = TestBed.createComponent(SettingChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
