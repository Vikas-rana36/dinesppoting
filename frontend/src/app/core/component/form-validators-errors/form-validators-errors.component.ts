import { Component, Input, OnInit } from '@angular/core';
import { ValidationErrors } from '@angular/forms';

@Component({
  selector: 'app-form-validators-errors',
  templateUrl: './form-validators-errors.component.html',
  styleUrls: ['./form-validators-errors.component.css']
})
export class FormValidatorsErrorsComponent implements OnInit {
  @Input() errorPrefix: string;
  @Input() minLength: any;
  @Input() maxLength: string;
  @Input() min: number;
  @Input() max: number;
  @Input() minValue: number;
  @Input() maxValue: number;
  @Input() patternError: string;
  @Input() errors: ValidationErrors;
  @Input() isPrice: boolean;
  @Input() minAmount: number;
  constructor() { }

  ngOnInit(): void {
    console.log('errorPrefix',this.errorPrefix)
  }

}
