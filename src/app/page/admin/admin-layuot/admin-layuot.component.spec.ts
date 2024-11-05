import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminLayuotComponent } from './admin-layuot.component';

describe('AdminLayuotComponent', () => {
  let component: AdminLayuotComponent;
  let fixture: ComponentFixture<AdminLayuotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminLayuotComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminLayuotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
