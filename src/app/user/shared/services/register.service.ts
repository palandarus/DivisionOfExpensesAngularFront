import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, Subject} from 'rxjs';

import {map} from 'rxjs/operators';
import {environment} from '../../../../environments/environment';
import {Event, ExpenseIn, UserRegistrationTicket} from '../../../shared/interfaces';


@Injectable({providedIn: 'root'})
export class RegisterService {
    public error$: Subject<string> = new Subject<string>();
    constructor(private http: HttpClient) {
    }

    register(userRegistrationTicket: UserRegistrationTicket): Observable<UserRegistrationTicket> {
        console.log('create registration context: ', userRegistrationTicket);
        return this.http.post(`${environment.API_ENDPOINT}/registration`, userRegistrationTicket);
    }

    confirm(ticket: string): Observable<string> {
        console.log('confirm registration ticket: ', ticket);
        const r = this.http.get(`${environment.API_ENDPOINT}/registration/${ticket}`).pipe(
            map((response: string) => response));
        console.log(r.toPromise());
        return r;
    }
}
