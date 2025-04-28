import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {FormsModule} from '@angular/forms';
import { BookService } from '../../services/book.service';
import { ReviewCardComponent } from '../../../reviews/components/review-card/review-card.component';
import { ReviewAddComponent } from '../../../reviews/components/review-add/review-add.component';
import { ReviewService } from '../../../reviews/services/review.service';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-book-deatil',
  imports: [CommonModule, FormsModule,ReviewCardComponent, ReviewAddComponent  ],
  templateUrl: './book-deatil.component.html',
  styleUrl: './book-deatil.component.css'
})
export class BookDeatilComponent implements OnInit {
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
    const bookId = this.getBookId();  // Obtiene el ID del libro de la ruta activa
    if (bookId) {
      this.loadBookDetails(bookId);
      this.loadReviews(bookId);
    }
  }

  getBookId(): number  {
    let id =  this.route.snapshot.paramMap.get('id');  
    if (id) {
      return Number(id);  // Convierte el ID a número
    } else {
      return 0;  // Devuelve 0 si no se encuentra el ID
    }
  }
  loadReviews(bookId: number): void {
    if (!this.hasMoreReviews || this.isLoadingReviews) return;  // Evita nuevas peticiones si no hay más reseñas o estamos cargando

    this.isLoadingReviews = true;  // Indicamos que estamos cargando
    this.reviewService.getReviwes(bookId, this.currentPage, 10).subscribe((response) => {
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

  loadBookDetails(bookId: number ) {
   this.bookService.getBook(bookId).subscribe((book) => {
      this.book = book.data;
    });
  }

  canEditReview(userid: any): boolean {
    let id = this.authService.userid;
    return userid === id;
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
      const bookId = this.getBookId();  // Obtenemos el ID del libro de la ruta activa
      if (bookId) {
        this.loadReviews(bookId);  // Cargamos más reseñas
      }
    }
  }
}
