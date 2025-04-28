import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReviewService } from '../../services/review.service';

@Component({
  selector: 'app-review-card',
  imports: [CommonModule, FormsModule],
  templateUrl: './review-card.component.html',
  styleUrl: './review-card.component.css'
})
export class ReviewCardComponent {
  @Input() review: any;
  @Input() canEdit: boolean = false;
  @Output() saveReviewEvent = new EventEmitter<any>();
  @Output() deleteReviewEvent = new EventEmitter<any>();

  editMode: boolean = false;
  updatedReview = { id: 0, bookId: 0, review: "", rating: 0 };

  constructor(private reviewService: ReviewService) {}

  editReview() {
    this.updatedReview = { ...this.review };
    this.editMode = true;
  }

  cancelEdit() {
    this.editMode = false;
  }
  

  saveReview() {
    
   this.updatedReview = {
      id: this.review.id,
      bookId: this.review.bookId,
      review: this.review.content,
      rating: this.updatedReview.rating
    };

    this.review.rating = this.updatedReview.rating;

    this.reviewService.updateReview(this.review.id, this.updatedReview).subscribe(
      (response) => {
        
        console.log('Reseña actualizada con éxito:', response);
        this.saveReviewEvent.emit(response); 
        this.editMode = false;  
      },
      (error) => {
        console.error('Error al actualizar la reseña:', error);
      }
    );
  }

  getStarRating(rating: number): number[] {
    return new Array(rating).fill(0);
  }

  deleteReview() {
    if (confirm('¿Estás seguro de que quieres eliminar esta reseña?')) {
      this.reviewService.deleteReview(this.review.id).subscribe(
        (response) => {
          console.log('Reseña eliminada con éxito:', response);
          this.deleteReviewEvent.emit({ deleted: true, id: this.review.id });
        },
        (error) => {
          console.error('Error al eliminar la reseña:', error);
        }
      );
    }
  }
  
  setRating(star: number) {
    this.updatedReview.rating  = star;
  }
}
