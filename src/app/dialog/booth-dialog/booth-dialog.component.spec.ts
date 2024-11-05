import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoothDialogComponent } from './booth-dialog.component';

describe('BoothDialogComponent', () => {
  let component: BoothDialogComponent;
  let fixture: ComponentFixture<BoothDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoothDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BoothDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
