import { Component } from '@angular/core';
import {FormControl} from "@angular/forms";
import {Hero} from "../../interfaces/hero.interface";
import {HeroesService} from "../../services/heroes.service";

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styles: ``
})
export class SearchPageComponent {
  constructor( private herosService: HeroesService) {
  }
 public searchInput = new FormControl('');
 public heroes: Hero[] = [];

 searchHero() {
   const value:string = this.searchInput.value || '';
    console.log(value);
    this.herosService.getSuggestions(value)
      .subscribe(heroes => this.heroes = heroes);
    console.log(this.heroes);
 }
}
