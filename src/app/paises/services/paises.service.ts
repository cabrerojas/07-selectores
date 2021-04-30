
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { combineLatest, Observable, of } from 'rxjs';
import { Pais, PaisSmall } from '../interfaces/paises.interface';

@Injectable({
  providedIn: 'root'
})
export class PaisesService {

  private baseUrl = 'https://restcountries.eu/rest/v2';

  // tslint:disable-next-line: variable-name
  private _regiones: string[] = ['africa', 'americas', 'asia'
  , 'europe', 'oceania'];

  public get regiones(): string[]{
    return [...this._regiones];
  }

  constructor(private http: HttpClient) { }

  getPaisesPorRegion(region: string): Observable<PaisSmall[]>{

    const url = `${ this.baseUrl }/region/${region}?fields=name;alpha3Code`;

    return this.http.get<PaisSmall[]>( url );

  }

  getPaisesPorCodigo(codigo: string): Observable<Pais | null>{

    if( !codigo ){
      return of(null);
    }

    const url = `${ this.baseUrl }/alpha/${ codigo }`;

    return this.http.get<Pais>( url );

  }

  getPaisesPorCodigoSmall(codigo: string): Observable<PaisSmall>{

    const url = `${ this.baseUrl }/alpha/${ codigo }?fields=name;alpha3Code`;
    return this.http.get<PaisSmall>( url );

  }

  getPaisesPorCodigos(borders: string[]): Observable<PaisSmall[]>{

    if ( !borders ){
      return of([]);
    }

    const peticiones: Observable<PaisSmall>[] = [];

    borders.forEach(codigo => {
      const peticion = this.getPaisesPorCodigoSmall(codigo);
      peticiones.push(peticion);
    });

    return combineLatest( peticiones );

  }


}

