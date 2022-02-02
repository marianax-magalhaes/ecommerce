import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PottershopFormService {

  constructor() { }

  getCredicardMonths(startMonth: number): Observable<number[]>{
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
