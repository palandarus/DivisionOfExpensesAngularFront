import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {UserRegistrationTicket} from '../../shared/interfaces';
import {ActivatedRoute, Router} from '@angular/router';
import {RegisterService} from '../shared/services/register.service';
import {AlertService} from '../../shared/alert.service';
import {catchError} from 'rxjs/operators';
import {HttpErrorResponse} from '@angular/common/http';
import {Subscription, throwError} from 'rxjs';

@Component({
    selector: 'app-login-page',
    templateUrl: './register-page.component.html',
    styleUrls: ['./register-page.component.scss']
})
export class RegisterPageComponent implements OnInit, OnDestroy {

    form: FormGroup;
    submitted = false;
    message: string;

    constructor(
        public register: RegisterService,
        private router: Router,
        private route: ActivatedRoute,
        private alert: AlertService,
        private registerService: RegisterService
    ) {
    }

    ngOnInit() {
        this.form = new FormGroup({
            firstname: new FormControl(null, [
                Validators.required
            ]),
            lastname: new FormControl(null, [
                Validators.required
            ]),
            username: new FormControl(null, [
                Validators.required
            ]),
            password: new FormControl(null, [
                Validators.required
            ]),
            email: new FormControl(null, [
                Validators.required
            ])
        });
    }
    ngOnDestroy() {
    }

    submit() {
        if (this.form.invalid) {
            return;
        }

        this.submitted = true;

        const userRegistrationTicket: UserRegistrationTicket = {
            firstname: this.form.value.firstname,
            lastname: this.form.value.lastname,
            username: this.form.value.username,
            password: this.form.value.password,
            email: this.form.value.email
        };
        this.submitted = true;
        this.registerService.register(userRegistrationTicket).subscribe(() => {
            this.alert.success('Заявка была успешно обработана, проверьте свою почту для дальнейшей регистрации');
            this.submitted = false;
            this.router.navigate(['/user', 'dashboard']);
        }, () => {
            this.alert.danger('Пользователь с таким email или username уже зарегистрирован');
            this.submitted = false;
        });
    }
}

