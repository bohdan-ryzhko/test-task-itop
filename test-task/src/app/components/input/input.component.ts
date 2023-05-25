import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss']
})
export class InputComponent {
  @Input() amount: string = "";
  @Output() amountChange = new EventEmitter<string>();

  onAmountChange(event: Event) {
    const amountCurrency = (event.target as HTMLInputElement).value;
    this.amount = amountCurrency;
    this.amountChange.emit(this.amount);
  }
}
