import { Component, Input, Output, EventEmitter } from '@angular/core';

export type Currencies = "UAH" | "USD" | "EUR" | "";

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss']
})
export class SelectComponent {
  @Input() currency: Currencies = "";
  @Output() currencyChange = new EventEmitter<Currencies>();

  onCurrencyChange(event: Event) {
    const selectCurrency = (event.target as HTMLSelectElement).value as Currencies;
    this.currency = selectCurrency;
    this.currencyChange.emit(this.currency);
  }
}
