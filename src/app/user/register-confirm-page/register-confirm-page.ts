import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {RegisterService} from '../shared/services/register.service';
import {AlertService} from '../../shared/alert.service';
import {catchError, switchMap} from 'rxjs/operators';
import {HttpErrorResponse} from '@angular/common/http';
import {throwError} from 'rxjs';


@Component({
    selector: 'app-login-page',
    templateUrl: './register-confirm-page.component.html',
    styleUrls: ['./register-confirm-page.scss']
})
export class RegisterConfirmPageComponent implements OnInit {
    submitted = false;
    message: string;
    ticket: string;

    constructor(
        public register: RegisterService,
        private router: Router,
        private route: ActivatedRoute,
        private alert: AlertService,
        private registerService: RegisterService
    ) {
    }

    ngOnInit() {
        this.route.params.pipe(
            switchMap((params: Params) => this.ticket = params.ticket)
        );
        this.registerService.confirm(this.ticket).pipe(
            catchError((error: HttpErrorResponse) => {
                if (error.status === 201) {
                    this.submitted = false;
                    this.alert.success('Пользователь был успешно зарегистрирован');
                    this.router.navigate(['/user', 'dashboard']);
                } else if (error.status === 404) {
                    this.alert.danger(`ошибка, регистрационный тикет не найден. ${error.message.toString()}`);
                }
                this.submitted = false;
                return throwError(error);
            })
        ).subscribe(() => {
            this.submitted = false;
            this.alert.success('Пользователь был успешно зарегистрирован');
            this.router.navigate(['/user', 'dashboard']);
        });
        }
}

