import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateExpenceComponent } from './create-expence.component';

describe('CreateExpenceComponent', () => {
  let component: CreateExpenceComponent;
  let fixture: ComponentFixture<CreateExpenceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateExpenceComponent]
    });
    fixture = TestBed.createComponent(CreateExpenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
