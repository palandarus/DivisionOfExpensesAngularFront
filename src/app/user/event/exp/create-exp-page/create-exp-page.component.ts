import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ExpenseIn} from '../../../../shared/interfaces';
import {Expense} from '../../../../shared/interfaces';
import {ExpensesService} from '../../../shared/expenses.service';
import {Event} from '../../../../shared/interfaces';
import {EventsService} from '../../../shared/events.service';
import {AlertService} from '../../../../shared/alert.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {switchMap} from 'rxjs/operators';


@Component({
  selector: 'app-create-page',
  templateUrl: './create-exp-page.component.html',
  styleUrls: ['./create-exp-page.component.scss']
})
export class CreateExpensePageComponent implements OnInit {

  form: FormGroup;
  event: Event;
  directPayerMap: Map<string, string>;
  partitialPayerMap: Map<string, string>;
  directPayerMapOut: {};
  partitialPayerMapOut: {};
  eventUserList: any;


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
              return this.eventsService.getById(params.id);
            })
        ).subscribe((event: Event) => {
      this.event = event;
      this.eventUserList = this.event.eventUserList;
      this.directPayerMap = new Map<string, string>();
      this.partitialPayerMap = new Map<string, string>();
      console.log('directPayerMap initialised ', this.directPayerMap);
      console.log('partitialPayerMap initialised ', this.partitialPayerMap);
    });
    this.form = new FormGroup({
      comment: new FormControl(null, Validators.required),
      date: new FormControl(null, Validators.required),
      selectedBuyer: new FormControl(null),
      totalExpenseSum: new FormControl(null, [Validators.required, Validators.pattern(/^[.\d]+$/)]),
      newDirectUser: new FormControl(null, Validators.required),
      newDirectSum: new FormControl(null, [Validators.required, Validators.pattern(/^[.\d]+$/)]),
      newPartitialUser: new FormControl(null, Validators.required),
      newPartitialCoef: new FormControl(null, [Validators.required, Validators.pattern(/^[.\d]+$/)])
    });
  }

  submit() {
    this.convertDirectPayerMapToJson();
    this.convertPartitialPayerMapToJson();
    const expense: Expense = {
      totalExpenseSum: this.form.value.totalExpenseSum,
      comment: this.form.value.comment,
      event: this.form.value.event,
      expenseDate: new Date(this.form.value.date),
      buyer: this.form.value.selectedBuyer,
      directPayerMap: this.directPayerMapOut,
      partitialPayerMap: this.partitialPayerMapOut
    };

    this.expensesService.create(expense, this.event.id).subscribe(() => {
      this.form.reset();
      this.alert.success('Новая трата была успешно создана.');
      this.router.navigate(['/user', 'event', this.event.id, 'exp']);
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
  convertDirectPayerMapToJson() {
    const convDPMap = {};
    this.directPayerMap.forEach(((value, key) => {
      convDPMap[key] = value;
    }));
    this.directPayerMapOut = convDPMap;
  }

  convertPartitialPayerMapToJson() {
    const convPPMap = {};
    this.partitialPayerMap.forEach(((value, key) => {
      convPPMap[key] = value;
    }));
    this.partitialPayerMapOut = convPPMap;
  }

}
