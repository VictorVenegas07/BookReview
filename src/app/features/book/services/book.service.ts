import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Book } from '../../../Core/models/book';
import { ApiPaginated } from '../../../Core/models/ApiPaginated';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment.development';
import { Category} from '../../../Core/models/Category';
import { APIResponse} from '../../../Core/models/APIResponse';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private apiUrl = environment.API_URL;
  private booksUrl = `${this.apiUrl}/book`;
  constructor(private http: HttpClient) {}

  searchBooks(pageNumber: number, pageSize: number, searchTerm?: string, category?: number | null): Observable<ApiPaginated<Book>> {
    const params: any = {
      PageNumber: pageNumber,
      PageSize: pageSize
    };

    if (searchTerm) {
      params.SearchTerm = searchTerm;
    }

    if (category !== null && category !== undefined && category !== 0) {
      params.Category = category;
    }

    return this.http.post<ApiPaginated<Book>>(`${this.booksUrl}/pagined?PageNumber=${pageNumber}&PageSize=${pageSize}`, {}, { params, observe: 'body' });
  }

  getBook(id: number): Observable<ApiPaginated<Book>> {
    return this.http.get<ApiPaginated<Book>>(`${this.booksUrl}/${id}`);
  }



  createBook(book: Book): Observable<Book> {
    return this.http.post<Book>('books', book);
  }


  getcategories(): Observable<APIResponse<Category>> {
    return this.http.get<APIResponse<Category>>(`${this.apiUrl}/category`);
  }
}
