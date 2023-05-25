import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Currencies } from '../select/select.component';

interface ICurrencyData {
  r030: number,
  txt: string,
  rate: number,
  cc: string,
  exchangedate: string
}

type PropertyToUpdate = "currentCurrency" | "convertTo";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  currentCurrency: Currencies = '';
  amount = '';
  convertTo: Currencies = '';
  result = 0;

  coefficient = {
    UAH: 1,
    USD: 0,
    EUR: 0,
  }

  constructor(private http: HttpClient) { }

  getCurrencyData() {
    const urlUSD = 'https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json&valcode=USD';
    const urlEUR = 'https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json&valcode=EUR';
    this.http.get<ICurrencyData[]>(urlUSD)
      .subscribe(response => {
        this.coefficient.USD = response[0].rate;
      });
    this.http.get<ICurrencyData[]>(urlEUR)
      .subscribe(response => {
        this.coefficient.EUR = response[0].rate;
      })
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
