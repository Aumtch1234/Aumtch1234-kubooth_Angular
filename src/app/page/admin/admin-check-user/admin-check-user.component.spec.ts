import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCheckUserComponent } from './admin-check-user.component';

describe('AdminCheckUserComponent', () => {
  let component: AdminCheckUserComponent;
  let fixture: ComponentFixture<AdminCheckUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminCheckUserComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminCheckUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
