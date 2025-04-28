import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReviewService } from '../../services/review.service';

@Component({
  selector: 'app-review-add',
  imports: [CommonModule, FormsModule],
  templateUrl: './review-add.component.html',
  styleUrl: './review-add.component.css'
})
export class ReviewAddComponent {
  @Output() saveReviewEvent = new EventEmitter<any>(); 
  @Input() bookId: number = 0;  // ID del libro al que se le está agregando la reseña

  newReview = {
    content: '',
    rating: 5
  };

  constructor(private reviewService: ReviewService) {}

  onSubmit() {
    
    this.reviewService.addReview(this.bookId, this.newReview.content, this.newReview.rating)
      .subscribe(
        response => {
          console.log('Reseña agregada con éxito:', response.data);
          this.saveReviewEvent.emit(response.data);  // Emitir la reseña agregada para actualizar la UI
          this.newReview = { content: '', rating: 5 };  // Limpiar el formulario
        },
        error => {
          console.error('Error al agregar reseña:', error);
        }
      );
  }

  setRating(star: number) {
    this.newReview.rating = star;
  }

}
