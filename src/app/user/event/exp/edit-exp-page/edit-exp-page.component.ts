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

  }

  submit() {



  }




}
