import {Component, OnDestroy, OnInit} from '@angular/core';
import {Hero} from "../../interfaces/hero.interface";
import {HeroesService} from "../../services/heroes.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-list-page',
  templateUrl: './list-page.component.html',
  styles: ``
})
export class ListPageComponent implements OnInit, OnDestroy {

  constructor(private heroesService: HeroesService) {


  }

  public heroes: Hero[] = [];
  private subscription: Subscription | undefined;

  ngOnInit(): void {
    this.subscription = this.heroesService.getHeroes().subscribe(heroes => this.heroes = heroes);

  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
