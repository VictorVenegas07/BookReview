import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiPaginated } from '../../../Core/models/ApiPaginated';
import { Book } from '../../../Core/models/book';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private apiUrl = environment.API_URL;
  private booksUrl = `${this.apiUrl}/review`;
  constructor(private http: HttpClient) {}

  getReviwes(id: number, pageNumber: number, pageSize: number): Observable<ApiPaginated<Book>> {
    return this.http.get<ApiPaginated<Book>>(`${this.booksUrl}/book/${id}?PageNumber=${pageNumber}&PageSize=${pageSize}`);
  }

  addReview(bookId: number, review: string, rating: number): Observable<any> {
    const reviewData = { bookId, review, rating };
    return this.http.post(this.booksUrl, reviewData, {
      headers: {
        'Accept': 'text/plain',
        'Content-Type': 'application/json-patch+json'
      }
    });
  }

  updateReview(reviewId: number, reviewData: any): Observable<any> {
    
    const url = `${this.booksUrl}/${reviewId}`;
    return this.http.put(url, reviewData, {
      headers: {
        'Accept': 'text/plain',
        'Content-Type': 'application/json-patch+json'
      }
    });
  }

  deleteReview(reviewId: number): Observable<any> {
    const url = `${this.booksUrl}/${reviewId}`;
    return this.http.delete(url, {
      headers: {
        'Accept': 'text/plain',
        'Content-Type': 'application/json-patch+json'
      }
    });
  }

  getReviwesByUser( pageNumber: number, pageSize: number): Observable<ApiPaginated<Book>> {
    return this.http.get<ApiPaginated<Book>>(`${this.booksUrl}/byuser?PageNumber=${pageNumber}&PageSize=${pageSize}`);
  }

  
}
