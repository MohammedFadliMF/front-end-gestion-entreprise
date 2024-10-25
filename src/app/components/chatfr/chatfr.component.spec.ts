import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatfrComponent } from './chatfr.component';

describe('ChatfrComponent', () => {
  let component: ChatfrComponent;
  let fixture: ComponentFixture<ChatfrComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChatfrComponent]
    });
    fixture = TestBed.createComponent(ChatfrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
