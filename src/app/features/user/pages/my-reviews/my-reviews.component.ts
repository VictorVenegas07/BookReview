import { Component } from '@angular/core';
import { ReviewAddComponent } from '../../../reviews/components/review-add/review-add.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReviewCardComponent } from '../../../reviews/components/review-card/review-card.component';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import { BookService } from '../../../book/services/book.service';
import { ReviewService } from '../../../reviews/services/review.service';

@Component({
  selector: 'app-my-reviews',
  imports: [CommonModule, FormsModule,ReviewCardComponent ],
  templateUrl: './my-reviews.component.html',
  styleUrl: './my-reviews.component.css'
})
export class MyReviewsComponent {
  book: any;
  reviews: any[] = [];
  currentPage: number = 1;
  isLoadingReviews: boolean = false;
  hasMoreReviews: boolean = true;
  currentUserId: number = 1;

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService, 
    private reviewService:ReviewService,
    private authService:AuthService ) {}

  ngOnInit(): void {
      this.loadReviews();
    
  }
  loadReviews(): void {
    if (!this.hasMoreReviews || this.isLoadingReviews) return;  

    this.isLoadingReviews = true;  
    
    this.reviewService.getReviwesByUser(this.currentPage, 10).subscribe((response) => {
      const newReviews = response.data;
      this.reviews = [...this.reviews, ...newReviews];  // Añadimos las nuevas reseñas
      this.currentPage++;  // Aumentamos la página para la siguiente carga

      // Si no hay más reseñas para cargar, establecemos `hasMoreReviews` como false
      if (newReviews.length === 0) {
        this.hasMoreReviews = false;
      }
      
      this.isLoadingReviews = false;  // Restablecemos el estado de carga
    });
  }



  canEditReview(review: any): boolean {
    let id = this.authService.userid;
    return review === id;
  }

  editReview(review: any) {
    review.isEditing = true;
  }

  addReview(newReview: any) {
    this.reviews.push(newReview);
  }

  saveReview(review: any) {
    review.isEditing = false;
    console.log('Reseña guardada:', review);
  }

  deleteReview(review: any) {
    this.reviews = this.reviews.filter((r) => r.id !== review.id);
    console.log('Reseña eliminada:', review);
  }
  
  onScroll(event: any): void {
    const scrollPosition = event.target.scrollTop + event.target.clientHeight;
    const scrollHeight = event.target.scrollHeight;

    // Si estamos cerca del final y hay más reseñas para cargar
    if (scrollHeight - scrollPosition < 100) {
      const bookId = this.route.snapshot.paramMap.get('id');
      if (bookId) {
        this.loadReviews();  // Cargamos más reseñas
      }
    }
  }
}
