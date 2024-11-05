import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookBoothComponent } from './book-booth.component';

describe('BookBoothComponent', () => {
  let component: BookBoothComponent;
  let fixture: ComponentFixture<BookBoothComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookBoothComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BookBoothComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
