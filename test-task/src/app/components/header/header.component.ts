import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Currencies } from '../select/select.component';

interface ICurrencyData {
  r030: number,
  txt: string,
  rate: number,
  cc: Currencies,
  exchangedate: string
}

type PropertyToUpdate = "currentCurrency" | "convertTo";

const urls: string[] = [
  'https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json&valcode=USD',
  'https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json&valcode=EUR',
];

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  currentCurrency: Currencies = '';
  amount = '1';
  convertTo: Currencies = '';
  result = 0;

  coefficient: { [key: string]: number } = {
    UAH: 1,
    USD: 0,
    EUR: 0,
  }

  constructor(private http: HttpClient) { }

  getCurrencyData() {
    urls.forEach(url => {
      this.http.get<ICurrencyData[]>(url)
        .subscribe(response => {
          this.coefficient[response[0].cc] = response[0].rate;
        });
    });
  }

  onAmountChange(value: string) {
    if (Number(value) < 0) return;
    this.amount = value;
    this.convertCurrency();
  }

  onCurrencyChange(currencyValue: string, propertyToUpdate: PropertyToUpdate) {
    switch (propertyToUpdate) {
      case "convertTo":
        this.convertTo = currencyValue as Currencies;
        break;
      case "currentCurrency":
        this.currentCurrency = currencyValue as Currencies;
        break;
      default:
        this.currentCurrency = "";
    }
    this.convertCurrency();
  }

  convertCurrency() {
    if (this.currentCurrency !== "" && this.amount !== "" && this.convertTo !== "") {
      const resultConvertation = (Number(this.amount) * this.coefficient[this.currentCurrency]) / this.coefficient[this.convertTo];
      this.result = Math.round(resultConvertation * 100) / 100;
    }
  }

  ngOnInit() {
    this.getCurrencyData();
  }
}
