import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


export interface Account {
  id: number;
  accountNumber: string;
  balance: number;
}

export interface AccountResponse {
  accounts: Account[];
};


@Injectable({
  providedIn: 'root'
})

export class AccountsService {

  constructor(private http: HttpClient) { }

  getAllAccounts(): Observable<AccountResponse> {
    return this.http.get<AccountResponse>(`http://localhost:3000/api/accounts/accounts`);
  }

  getBalance(): Observable<any> {
    return this.http.get<any>(`http://localhost:3000/api/accounts/balance`);
  }


}
