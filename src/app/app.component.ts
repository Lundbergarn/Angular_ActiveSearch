import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { debounceTime, filter, distinct } from 'rxjs/operators';
import { Subscription } from "rxjs";

interface Items {
    total_count: number,
    incomplete_results: boolean,
    items: Array<object>
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy{
  title="Instant Search"
  searchTerm: string;
  latestSearch = new Subject<string>();
  results: Array<object>;

  private subscription: Subscription;
  
  constructor(public http: HttpClient) {
    this.subscription = this.latestSearch.pipe(
      debounceTime(500),
      distinct(),
      filter(res => !!res)
      )
      .subscribe(term => {
        this.http.get<Items>('https://api.github.com/search/repositories?q=' + term)
        .subscribe(res => {
          this.results = res.items;
          console.log(res)
        });
      }
    )
  }
  
  newSearch(term) {
    this.latestSearch.next(term);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
