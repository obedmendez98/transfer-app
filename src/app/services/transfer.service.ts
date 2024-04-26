import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransferService {

  constructor(private http: HttpClient) { }

  getAllTransfers(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:3000/api/transfers/transfers/${userId}`);
  }

  createTransfer(data: any): Observable<any[]> {
    return this.http.post<any[]>(`http://localhost:3000/api/transfers/add`, data);
  }

  getTransfersGroupedByDestinationAccount(): Observable<any> {
    return this.http.get<any>(`http://localhost:3000/api/transfers/grouped-by-destination/`);
  }

  getTop3TransfersByAmount(): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:3000/api/transfers/top-3-by-amount/`);
  }

  getTransfersGroupedByOriginAccount(): Observable<any> {
    return this.http.get<any>(`http://localhost:3000/api/transfers/grouped-by-origin/`);
  }
}
