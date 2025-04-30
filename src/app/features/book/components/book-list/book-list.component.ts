import { Component } from '@angular/core';
import { Book } from '../../../../Core/models/book';
import { BookService } from '../../services/book.service';
import { CommonModule } from '@angular/common';
import { RouterLinkWithHref } from '@angular/router';
import { Category } from '../../../../Core/models/Category';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';


@Component({
  selector: 'app-book-list',
  imports: [CommonModule, FormsModule, RouterLinkWithHref],
  templateUrl: './book-list.component.html',
  styleUrl: './book-list.component.css'
})
export class BookListComponent {
  books: Book[] = [];
  isLoading: boolean = false;
  pageNumber: number = 1;
  pageSize: number = 10;
  searchTerm: string = '';
  category: number | null = null;
  hasMore: boolean = true;
  filteredBooks = [];
  categories: Category[] = [];
  private searchSubject = new Subject<string>();

  constructor(private bookService: BookService) {
    console.log('BookListComponent initialized');
  }

  ngOnInit(): void {
    this.loadBooks();
    this.loadCategories(); 
    this.searchSubject
    .pipe(
      debounceTime(1000),
      distinctUntilChanged()
    )
    .subscribe((searchTerm) => {
      this.searchTerm = searchTerm;
      this.resetPagination();
      this.loadBooks();
    });
  }

  loadBooks(): void {
    this.isLoading = true; 
    this.isLoading = true;
  
    this.bookService.searchBooks(this.pageNumber, this.pageSize, this.searchTerm, this.category).subscribe((response:any) => {

        this.books = [...this.books, ...response.data]; 
        this.pageNumber++; 
        this.isLoading = false;

        if (response.length === 0) {
          this.hasMore = false;
        }
    }, error => {
      console.error('Error al cargar libros:', error);  
      this.isLoading = false;
    });
  }

  loadCategories(): void {
    this.bookService.getcategories().subscribe((response: any) => {
      if (response && response.data) {
        this.categories = response.data;
      }
    }, error => {
      console.error('Error al cargar categorías:', error);
    });
  }
  
  onScroll(event: any): void {
    const scrollPosition = event.target.scrollTop + event.target.clientHeight;
    const scrollHeight = event.target.scrollHeight;
  
    if (scrollHeight - scrollPosition < 100 && !this.isLoading && this.hasMore) {
      this.loadBooks();
    }
  }

  onSearchChange(): void {
    this.searchSubject.next(this.searchTerm);
  }
  
  onCategoryChange(): void {
    this.resetPagination();
    this.loadBooks();
  }

  resetPagination(): void {
    this.pageNumber = 1;
    this.books = [];
    this.hasMore = true;
  }




}
