import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {Hero, Publisher} from "../../interfaces/hero.interface";
import {HeroesService} from "../../services/heroes.service";
import {Router, ActivatedRoute} from "@angular/router";
import {filter, switchMap, tap} from "rxjs";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatDialog} from "@angular/material/dialog";
import {ConfirmDialogComponent} from "../../components/confirm-dialog/confirm-dialog.component";

@Component({
    selector: 'app-new-page',
    templateUrl: './new-page.component.html',
    styles: ``
})
export class NewPageComponent implements OnInit {

    // ActivatedRoute:
    //   Proporciona acceso a la información sobre la ruta que está activa en ese momento.
    // Permite acceder a parámetros de la ruta, datos, fragmentos y más.
    // Router:
    //   Permite la navegación programática dentro de la aplicación.
    // Proporciona métodos para navegar a diferentes rutas, redirigir, etc.etc

    constructor(
        private heroesService: HeroesService,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private snackbar: MatSnackBar,
        private dialog: MatDialog
    ) {
    }

// se crea para que el formulario se llene con los datos del heroe y sean de tipo hero para que se pueda usar en el formulario
    /*
     Los corchetes [] en Angular se utilizan para la vinculación de propiedades (property binding).
     Esto permite que el valor de una propiedad en el componente de TypeScript se vincule dinámicamente a un atributo en el HTML.
     En este caso, [src]="currentHero | heroImage" significa que el valor del atributo src de la etiqueta <img>
     se establecerá dinámicamente utilizando el valor de currentHero pasado a través del pipe heroImage.
   */
    get currentHero(): Hero {
        const hero = this.heroForm.value as Hero;
        return hero;
    }

    ngOnInit() {
        if (!this.router.url.includes('edit')) {
            return;
        }
        this.activatedRoute.params
            .pipe(
                switchMap(({id}) => this.heroesService.getHeroById(id)),
            ).subscribe(hero => {
            if (!hero) {
                return this.router.navigateByUrl('/');

            }
            this.heroForm.reset(hero);
            return;
        })
    }

    // crear formulario reactivo con formControl y formGroup
    public heroForm = new FormGroup({
        id: new FormControl<string>(''),
        superhero: new FormControl<string>('', {nonNullable: true}),
        publisher: new FormControl<Publisher>(Publisher.DCComics),
        alter_ego: new FormControl(''),
        first_appearance: new FormControl(''),
        characters: new FormControl(''),
        alt_img: new FormControl('')
    });


// este es para usarlo en el ngfor del select
    public publishers = [
        {
            id: 'DC Comics',
            desc: 'DC - Comics'
        },
        {
            id: 'Marvel Comics',
            desc: 'Marvel - Comics'
        },
    ]

    // se usa para conerctar el formulario con el select
    oneSubmit() {
        if (this.heroForm.invalid) return;

        if (this.currentHero.id) {
            this.heroesService.updateHero(this.currentHero)
                .subscribe(hero => {
                    this.showSnackbar(`${hero.superhero} updated`);
                });
            return;
        }

        this.heroesService.addHero(this.currentHero)
            .subscribe(hero => {
                //TODO: mostrar mensaje de creación
                this.router.navigate(['/heroes/edit', hero.id]).then(r => {

                    }
                ).catch(err => console.error(err));
                this.showSnackbar(`${hero.superhero} created`);
            });

    }

    oneDeleteHero() {
        if (!this.currentHero.id) throw new Error('Hero id is required');
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            data: this.heroForm.value
        });

        dialogRef.afterClosed()
            .pipe(
                filter((result:boolean) => result),
                switchMap(() => this.heroesService.deleteHeroById(this.currentHero.id)),
                filter((wasDeleted: boolean) => wasDeleted),
            )
            .subscribe(result => {
                this.router.navigate(['/heroes']);
            })
    }

    showSnackbar(message: string): void {
        this.snackbar.open(message, 'done', {
            duration: 2500
        })
    }

}
