import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Country } from '../common/country';
import { State } from '../common/state';

@Injectable({
  providedIn: 'root'
})
export class PottershopFormService {

  private countriesUrl = 'http://localhost:8080/api/countries';
  private statesUrl = 'http://localhost:8080/api/states';

  constructor(private http: HttpClient) { }

  getCountries(): Observable<Country[]>{
    return this.http.get<GetResponseCountries>(this.countriesUrl).pipe(
      map(response => response._embedded.countries)
    )
  }

  getStates(theCountryCode: string): Observable<State[]>{
    const searchStatesUrl = this.statesUrl+"/search/findByCountryCode?code=" + theCountryCode;

    return this.http.get<GetResponseStates>(searchStatesUrl).pipe(
      map(response => response._embedded.states)
    )
  }

  getCrediCardMonths(startMonth: number): Observable<number[]>{
    let data: number[] = [];

    // lista suspensa para mes comecando no mes atual
    for(let theMonth = startMonth; theMonth <=12; theMonth++){
      data.push(theMonth);
    }
    return of (data);
  }

  getCreditCardYears(): Observable<number[]>{
    let data: number[] = [];

    // lista suspensa para ano comecando no mes atual e pegar os proxs 10 anos
    const startYear: number = new Date().getFullYear();
    const endYear: number = startYear +1000;
    for (let theYear = startYear; theYear <= endYear; theYear++){
      data.push(theYear);
    }
    return of(data);
  }
}

interface GetResponseCountries{
  _embedded: {
    countries: Country[];
  }
}

interface GetResponseStates{
  _embedded: {
    states: State[];
  }
}

