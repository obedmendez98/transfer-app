import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js/auto';
import { AccountsService } from 'src/app/services/accounts.service';
import { TransferService } from 'src/app/services/transfer.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public chart: any;
  public transferDestination: any = [];
  public balance: any = [];
  public gastos: any = [];

  constructor(
    private accountService: AccountsService,
    private transferService: TransferService,
  ) { }

  ngOnInit(): void {
    this.createChart();
    this.getBalance();  
    this.getGastos();
  }

  async createChart(){
    const labels = this.transferDestination?.map((item: { _id: any; }) => item._id);
    const values = this.transferDestination?.map((item: { total: any; }) => item.total); 
  
    this.chart = new Chart("MyChart", {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          label: 'Transfers',
          data: values,
          backgroundColor: [
            'red',
            'pink',
            'green',
            'yellow',
            'orange',
            'blue',			
          ],
          hoverOffset: 4
        }],
      },
      options: {
        aspectRatio:2.5
      }
    });

    await this.updateChart()  
  }

  async getBalance(){
    try {
      const response = await this.accountService.getBalance().toPromise();
      this.balance = response?.balances ?? [];
    } catch (error) {
      console.log(error);
    }
  }

  async getGastos(){
    try {
      const response = await this.transferService.getTop3TransfersByAmount().toPromise();
      console.log(response);
      this.gastos = response;
    } catch (error) {
      console.log(error);
    }
  }

  async updateChart(){
    try {
      const response = await this.transferService.getTransfersGroupedByDestinationAccount().toPromise();

      this.transferDestination = response;
      const labels = this.transferDestination.map((item: { _id: any; }) => item._id);
      const values = this.transferDestination.map((item: { total: any; }) => item.total);

      this.chart.data.labels = labels;
      this.chart.data.datasets[0].data = values;

      this.chart.update();
    } catch (error) {
      console.log(error);
    }
  }

  transformDate(date: string){
    return new Date(date).toISOString().split('T')[0];
  }
}
