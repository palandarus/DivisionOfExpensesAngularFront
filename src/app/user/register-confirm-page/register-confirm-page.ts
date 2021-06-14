import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Event} from '../../shared/interfaces';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {RegisterService} from '../shared/services/register.service';
import {AlertService} from '../../shared/alert.service';
import {switchMap} from 'rxjs/operators';


@Component({
    selector: 'app-login-page',
    templateUrl: './register-confirm-page.component.html',
    styleUrls: ['./register-confirm-page.scss']
})
export class RegisterConfirmPageComponent implements OnInit {

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
        this.route.params.pipe(
            switchMap((params: Params) => {
                return this.registerService.confirm(params.ticket);
            })
        ).subscribe((response: string) => {
            this.form = new FormGroup({
                message: new FormControl(response)
            });
        });
    }
}
