import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Event} from '../../../../shared/interfaces';
import {Expense} from '../../../../shared/interfaces';
import {Subscription, throwError} from 'rxjs';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {EventsService} from '../../../shared/events.service';
import {ExpensesService} from '../../../shared/expenses.service';
import {AlertService} from '../../../../shared/alert.service';
import {catchError, switchMap} from 'rxjs/operators';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'app-edit-exp-page',
  templateUrl: './edit-exp-page.component.html',
  styleUrls: ['./edit-exp-page.component.scss']
})
export class EditExpPageComponent implements OnInit {

  form: FormGroup;
  expense: Expense;
  directPayerMap: Map<string, string>;
  partitialPayerMap: Map<string, string>;
  directPayerMapJson: string;
  partitialPayerMapJson: string;


  constructor(
      private route: ActivatedRoute,
      private expensesService: ExpensesService,
      private eventsService: EventsService,
      private alert: AlertService
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
      this.expense = expense;
      this.directPayerMap = this.expense.directPayerMap;
      this.partitialPayerMap = this.expense.partitialPayerMap;
      console.log('directPayerMap was loaded ', this.directPayerMap);
      console.log('partitialPayerMap was loaded ', this.partitialPayerMap);
      this.form = new FormGroup({
        comment: new FormControl(expense.comment, Validators.required),
        date: new FormControl(expense.expenseDate, Validators.required),
        selectedBuyer: new FormControl(this.expense.buyer),
        totalExpenseSum: new FormControl(this.expense.totalExpenseSum, [Validators.required, Validators.pattern(/^[.\d]+$/)]),
        newDirectUser: new FormControl(null, Validators.required),
        newDirectSum: new FormControl(null, [Validators.required, Validators.pattern(/^[.\d]+$/)]),
        newPartitialUser: new FormControl(null, Validators.required),
        newPartitialCoef: new FormControl(null, [Validators.required, Validators.pattern(/^[.\d]+$/)])
      });
    });
  }

  submit() {
    const expense: Expense = {
      totalExpenseSum: this.form.value.totalExpenseSum,
      comment: this.form.value.comment,
      event: this.form.value.event,
      expenseDate: new Date(this.form.value.date),
      buyer: this.form.value.selectedBuyer,
      directPayerMap: this.directPayerMap,
      partitialPayerMap: this.partitialPayerMap
    };

    this.expensesService.update(expense).subscribe(() => {
      this.form.reset();
      this.alert.success('Трата была успешно обновлена.');
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
    this.partitialPayerMap.delete(directUser);
    console.log(this.partitialPayerMap);
  }

  removePartitialPayer(partitialUser: string) {
    this.partitialPayerMap.delete(partitialUser);
    console.log(this.partitialPayerMap);
  }
  convertDirectPayerMapToJson(directPayerMap: Map<string, string>) {
    directPayerMap.forEach(((value, key) => (this.directPayerMapJson)[key] = value));
  }

  convertPartitialPayerMapToJson(partitialPayerMap: Map<string, string>) {
    partitialPayerMap.forEach(((value, key) => (this.partitialPayerMapJson)[key] = value));
  }

}
