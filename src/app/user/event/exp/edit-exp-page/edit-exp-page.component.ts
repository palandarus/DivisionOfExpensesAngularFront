import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Event, Expense} from '../../../../shared/interfaces';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {EventsService} from '../../../shared/events.service';
import {ExpensesService} from '../../../shared/expenses.service';
import {AlertService} from '../../../../shared/alert.service';
import {catchError, switchMap} from 'rxjs/operators';
import {HttpErrorResponse} from '@angular/common/http';
import {Subscription, throwError} from 'rxjs';

@Component({
    selector: 'app-edit-exp-page',
    templateUrl: './edit-exp-page.component.html',
    styleUrls: ['./edit-exp-page.component.scss']
})
export class EditExpPageComponent implements OnInit , OnDestroy{

    form: FormGroup;
    eventId: string;
    expense: Expense;
    directPayerMap: Map<string, string>;
    partitialPayerMap: Map<string, string>;
    directPayerArray: any;
    directPayerMapOut: {};
    partitialPayerMapOut: {};
    partitialPayerArray: any;
    eventUserList: any;
    event: Event;
    submitted = false;
    uSub: Subscription;


    constructor(
        private route: ActivatedRoute,
        private expensesService: ExpensesService,
        private eventsService: EventsService,
        private alert: AlertService,
        private router: Router
    ) {
    }

    ngOnInit() {
        this.route.params
            .pipe(
                switchMap((params: Params) => {
                    console.log('params.id ', params.id);
                    return this.expensesService.getById(params.id);
                })
            ).subscribe((expense: Expense) => {
            this.directPayerMap = new Map<string, string>();
            this.partitialPayerMap = new Map<string, string>();
            console.log('incoming expense ', expense);
            this.expense = expense;
            this.eventId = expense.event;
            this.eventsService.getById(this.eventId)
                .subscribe((event: Event) => {
                    this.eventUserList = event.eventUserList;
                });
            this.directPayerArray = expense.directPayerMap;
            this.partitialPayerArray = expense.partitialPayerMap;
            this.convertDirectPayerMapFromJson();
            this.convertPartitialPayerMapFromJson();
            console.log('directPayerMap initialised ', this.directPayerMap);
            console.log('partitialPayerMap initialised ', this.partitialPayerMap);
            this.form = new FormGroup({
                comment: new FormControl(this.expense.comment, Validators.required),
                date: new FormControl(this.expense.expenseDate, Validators.required),
                selectedBuyer: new FormControl(this.expense.buyer),
                totalExpenseSum: new FormControl(this.expense.totalExpenseSum, [Validators.required, Validators.pattern(/^[.\d]+$/)]),
                newDirectUser: new FormControl(null, Validators.required),
                newDirectSum: new FormControl(null, [Validators.required, Validators.pattern(/^[.\d]+$/)]),
                newPartitialUser: new FormControl(null, Validators.required),
                newPartitialCoef: new FormControl(null, [Validators.required, Validators.pattern(/^[.\d]+$/)])
            });
        });
    }

    ngOnDestroy() {
        if (this.uSub) {
            this.uSub.unsubscribe();
        }
    }

    submit() {
        this.convertDirectPayerMapToJson();
        this.convertPartitialPayerMapToJson();
        this.submitted = true;
        this.uSub = this.expensesService.update({
            ...this.expense,
            totalExpenseSum: this.form.value.totalExpenseSum,
            comment: this.form.value.comment,
            event: this.eventId,
            expenseDate: this.form.value.date,
            buyer: this.form.value.selectedBuyer,
            directPayerMap: this.directPayerMapOut,
            partitialPayerMap: this.partitialPayerMapOut
        }).pipe(
            catchError((error: HttpErrorResponse) => {
                if (error.status === 202) {
                    this.submitted = false;
                    this.alert.success('expense был обновлен');
                    this.router.navigate(['/user', 'event', this.eventId, 'exp']);
                } else if (error.status === 403) {
                    this.alert.danger(`ошибка, изменения не сохранены. ${error.message.toString()}`);
                } else if (error.status === 406){
                    this.alert.danger(`ошибка, вы не можете править чужую трату. ${error.message.toString()}`);
                }
                this.submitted = false;
                return throwError(error);
            })
        ).subscribe(() => {
            this.submitted = false;
            this.alert.success('expense был обновлен');
            this.router.navigate(['/user', 'event', this.eventId, 'exp']);
        });
    }


    addDirectPayer(newDirectUser: string, newDirectSum: string) {
        this.directPayerMap.set(newDirectUser, newDirectSum);
        this.form.get('newDirectUser').reset();
        this.form.get('newDirectSum').reset();

    }

    addPartitialPayer(newPartitialUser: string, newPartitialCoef: string) {
        this.partitialPayerMap.set(newPartitialUser, newPartitialCoef);
        this.form.get('newPartitialUser').reset();
        this.form.get('newPartitialCoef').reset();
    }


    removeDirectPayer(directUser: string) {
        this.directPayerMap.delete(directUser);
        console.log(this.directPayerMap);
    }

    removePartitialPayer(partitialUser: string) {
        this.partitialPayerMap.delete(partitialUser);
        console.log(this.partitialPayerMap);
    }

    convertDirectPayerMapToJson() {
        const convDPMap = {};
        this.directPayerMap.forEach(((value, key) => {
            convDPMap[key] = value;
        }));
        console.log('convDPMap', convDPMap);
        this.directPayerMapOut = convDPMap;
    }

    convertPartitialPayerMapToJson() {
        const convPPMap = {};
        this.partitialPayerMap.forEach(((value, key) => {
            convPPMap[key] = value;
        }));
        this.partitialPayerMapOut = convPPMap;
    }

    convertPartitialPayerMapFromJson() {
        // tslint:disable-next-line:forin
        for (const key in this.partitialPayerArray) {
            console.log(key, this.partitialPayerArray[key]);
            this.partitialPayerMap.set(key, this.partitialPayerArray[key]);
        }
    }

    convertDirectPayerMapFromJson() {
        // tslint:disable-next-line:forin
        for (const key in this.directPayerArray) {
            console.log(key, this.directPayerArray[key]);
            this.directPayerMap.set(key, this.directPayerArray[key]);
        }
    }
}
