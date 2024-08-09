import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchError, Observable, of} from "rxjs";
import {Hero} from "../interfaces/hero.interface";
import {environments} from "../../../environments/environments";

@Injectable({providedIn: 'root'})
export class HeroesService {

  constructor(private httpClient: HttpClient) {
  }
  private baseUrl :string = environments.baseUrl;

  getHeroes() : Observable<Hero[]> {
    return this.httpClient.get<Hero[]>(`${this.baseUrl}/heroes`);
  }


  getHeroById(id: string) : Observable<Hero | undefined> {
    return this.httpClient.get<Hero>(`${this.baseUrl}/heroes/${id}`)
      .pipe(
        catchError(error => of(undefined))
      );

  }

  getSuggestions(query: string) : Observable<Hero[]> {
    if (!query.trim()) {
      return of([]);
    }
    return this.httpClient.get<Hero[]>(`${this.baseUrl}/heroes?q=${query}&_limit=6`);
  }

}
