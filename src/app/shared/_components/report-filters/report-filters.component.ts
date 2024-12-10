import { Component, Input, OnChanges, OnInit } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-report-filters',
  templateUrl: './report-filters.component.html',
  styleUrls: ['./report-filters.component.scss'],
})
export class ReportFiltersComponent implements OnInit, OnChanges {
  constructor() {}
  public isCollapsed = false;

  @Input() filtersList = [];
  @Input() columnsList = [];
  @Input() primaryState = [];
  @Input() changedVisibityCoumns = [];
  @Input() readOnly = false;
  @Input() previewOnly = false;

  //currentFilters is for tracking the last state
  currentFilters = {};

  ngOnInit(): void {
    console.log('this.primaryState', this.primaryState);
    console.log('this.columnsList', this.columnsList);

    //for both preview and edit
    this.primaryState.forEach((st) => {
      let matchingCol = this.columnsList.find(
        (col) => col.datafield === st.operand
      );
      // console.log('matchingCol', matchingCol);

      if (matchingCol) {
        if (st.range) {
          matchingCol.rangeFields = Object.entries(st.dateRange);
          matchingCol.rangeFields = matchingCol.rangeFields.map((field) => [
            field[0],
            moment(field[1]).format('DD-MMM-YYYY'),
          ]);
          if (this.readOnly) {
            matchingCol.primaryOperator = true;
          }
        } else {
          matchingCol.primaryOperator = st.operator;
          Array.isArray(matchingCol.actualValues)
            ? matchingCol.actualValues.push(st.value)
            : (matchingCol.actualValues = [st.value]);
        }
      }
    });

    // for only edit
    if (!this.readOnly) {
      this.filtersList = this.filtersList.map((filter) => {
        return filter;
      });
    }
    // console.log('this.filtersList', this.filtersList);
    // console.log('this.columnsList', this.columnsList);
  }

  ngOnChanges(changes) {
    // console.log('changes', changes);
    // console.log(
    //   'changes',
    //   changes.length,
    //   changes?.filtersList,
    //   'this.columnsList',
    //   this.columnsList,
    //   changes?.filtersList?.currentValue,

    //   'this.currentFilters',
    //   this.currentFilters,
    //   changes?.filtersList?.currentValue.map((e) => ({
    //     ...e,
    //     CUSTOMFIELD: e.filter?.getfilters(),
    //   }))
    // );

    // if just preview return immediately
    if (this.readOnly) {
      return;
    }

    let newEditedFilters = changes?.filtersList?.currentValue;

    // if new state does not include any of the last filters means
    // that filter is removed by the user
    Object.keys(this.currentFilters).forEach((curFilt) => {
      if (!newEditedFilters.some((newFilt) => newFilt.datafield === curFilt)) {
        let prevState = this.currentFilters[curFilt];
        if (prevState.filtertype === 'range') {
          prevState.newRangeFields = [];
          prevState.newOperator = '';
          prevState.newValues = [null];
          prevState.removed = true;
        } else {
          if (
            prevState.filtertype === 'checkedlist' &&
            prevState.primaryOperator === 'EQUAL'
          ) {
            prevState.newValues = [
              ...prevState.dropDownValues,
              '...all others',
            ];
          } else prevState.newValues = [null];

          prevState.newOperator = '';

          // prevState.newOperator =
          //   prevState.filtertype === 'checkedlist' &&
          //   prevState.primaryOperator === 'EQUAL'
          //     ? ''
          //     : prevState.filtertype === 'checkedlist'
          //     ? 'EQUAL'
          //     : // : prevState.filtertype === 'date'
          //       // ? 'CONTAINS'
          //       '';
        }
      }
    });

    // Apply the new filters
    if (Array.isArray(changes?.filtersList?.currentValue)) {
      changes?.filtersList?.currentValue.forEach((newFilter) => {
        let matchingCol = this.columnsList.find(
          (col) => col.datafield === newFilter.datafield
        );

        // track the current filter for future
        this.currentFilters[newFilter.datafield] = matchingCol;

        /*for Range start*/
        if (matchingCol.filtertype === 'range') {
          matchingCol.removed = false;
          matchingCol.newRangeFields = newFilter.filter
            ?.getfilters()
            .map((fil) => [
              fil.condition,
              moment(fil.value).format('DD-MMM-YYYY'),
            ]);
        }
        /*for Range end*/

        /*for checkedlist start*/
        if (matchingCol.filtertype === 'checkedlist') {
          // console.log(newFilter.filter?.getfilters());
          matchingCol.newValues = newFilter.filter
            ?.getfilters()
            .map((fil) => fil.value);

          let actualValues = matchingCol.actualValues ?? [];

          matchingCol.dropDownValues = Array.from(
            new Set([...actualValues, ...matchingCol.newValues])
          );

          matchingCol.newOperator =
            matchingCol.primaryOperator ===
            newFilter.filter?.getfilters()[0]?.condition
              ? ''
              : newFilter.filter?.getfilters()[0]?.condition == 'NOT_NULL'
              ? 'NOT_EQUAL'
              : newFilter.filter?.getfilters()[0]?.condition;
        } else {
          /*for all non-checkedlist start*/

          let newEditedFilter = newFilter.filter?.getfilters()[0];

          // for dates format the value
          if (newEditedFilter.type === 'datefilter') {
            newEditedFilter.value = moment(newEditedFilter.value).format(
              'DD-MMM-YYYY'
            );
          }
          // check the operator/condition
          matchingCol.primaryOperator !== newEditedFilter?.condition
            ? (matchingCol.newOperator = newEditedFilter?.condition)
            : (matchingCol.newOperator = '');

          // if primary state and newvalue is same means filter did not change
          if (
            Array.isArray(matchingCol.actualValues) &&
            matchingCol.actualValues[0] === newEditedFilter?.value
          ) {
            matchingCol.newValues = [];
            return;
          }
          if (newFilter.filter?.getfilters().length === 1) {
            matchingCol.newValues = [newEditedFilter?.value];
          } else {
            matchingCol.newValues = newFilter.filter
              ?.getfilters()
              .map((fil) => {
                fil.value;
              });
          }
        }
      });
      // console.log(' this.columnsList', this.columnsList);
    }
  }
}
