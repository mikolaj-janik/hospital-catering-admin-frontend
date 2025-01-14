import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewWardComponent } from './new-ward.component';

describe('NewWardComponent', () => {
  let component: NewWardComponent;
  let fixture: ComponentFixture<NewWardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewWardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewWardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
