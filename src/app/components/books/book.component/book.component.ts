import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs';

import { Book } from '../../../models/book.model';
import { User } from '../../../models/user.model';

import { Store } from '@ngrx/store';
import * as fromStore from '../../../state-management/reducers/store';
import * as BookActions from '../../../state-management/actions/book.actions';

@Component({
    selector: 'app-book-component',
    templateUrl: './book.component.html',
    styleUrls: ['./book.component.scss']
})

export class BookComponent implements OnInit {
    book: Observable<Book>;
    loading: Observable<boolean>;
    loggedInUser: Observable<User>;
    loggedInUsername: string;

    constructor(private route: ActivatedRoute,
                private store: Store<fromStore.State>) {}

    ngOnInit() {
        this.book = this.store.select(fromStore.getSelectedBook);
        this.loading = this.store.select(fromStore.getLoading);

        this.route.params.map(params => params.id)
                        .do((id) => this.store.dispatch(new BookActions.GetBook(id)))
                        .subscribe();

        this.loggedInUser = this.store.select(fromStore.getLoggedInUser);
        this.loggedInUser.subscribe(res => this.loggedInUsername = res.name).unsubscribe();
    }

    setLoaned(book: Book) {
        book.loanedOut = true;
        book.loanedBy = this.loggedInUsername;
        this.store.dispatch(new BookActions.LoanBook(book));
    }

    bringBack(book: Book) {
        if (book.loanedBy === this.loggedInUsername){
            book.loanedOut = false;
            book.loanedBy = '';
            this.store.dispatch(new BookActions.BringBack(book));
        } else {
            alert('you don\'t have this book');
        }
    }
}
