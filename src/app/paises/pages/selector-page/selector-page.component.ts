import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaisesService } from '../../services/paises.service';
import { PaisSmall } from '../../interfaces/paises.interface';
import { switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styleUrls: ['./selector-page.component.css']
})
export class SelectorPageComponent implements OnInit {

  miFormulario: FormGroup = this.fb.group({
    region  : ['', Validators.required ],
    pais    : ['', Validators.required ],
    frontera: ['', Validators.required ]
  });

  // Llenar Selectores
  regiones  : string[] = [];
  paises    : PaisSmall[] = [];
  fronteras : PaisSmall[] = [];
  // UI
  cargando = false;

  constructor(  private fb: FormBuilder,
                private ps: PaisesService ) { }

  ngOnInit(): void {
    this.regiones = this.ps.regiones;


    // Cuando cambie la region

    // this.miFormulario.get('region')?.valueChanges
    //     .subscribe( region => {
    //       console.log(region);
    //       this.ps.getPaisesPorRegion(region)
    //               .subscribe( paises => {
    //                 this.paises = paises;
    //                 console.log(paises);

    //               });
    //     } );

    this.miFormulario.get('region')?.valueChanges
          .pipe(
            tap( ( _ ) => {
              this.miFormulario.get('pais')?.reset('');
              this.cargando = true;
            } ),
            switchMap( region => this.ps.getPaisesPorRegion(region) )
          )
          .subscribe( paises => {

            this.paises = paises;
            this.cargando = false;
          });

     // Cuando cambie el pais
    this.miFormulario.get('pais')?.valueChanges
    .pipe(
      tap(( _ ) => {

        this.miFormulario.get('frontera')?.reset('');
        this.cargando = true;
      } ),
      switchMap( codigo => this.ps.getPaisesPorCodigo( codigo ) ),
      switchMap( pais => this.ps.getPaisesPorCodigos( pais?.borders! ) )
    )
     .subscribe( paises => {

       this.fronteras = paises || [] ;
       this.cargando = false;

     });


  }

  guardar(): void {
    console.log(this.miFormulario.value);
  }

}
