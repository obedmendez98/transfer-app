import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js/auto';
import { AccountsService } from 'src/app/services/accounts.service';
import { TransferService } from 'src/app/services/transfer.service';

@Component({
  selector: 'app-transfer',
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.scss']
})
export class TransferComponent implements OnInit {

  public chart: any;
  public accounts: any = [];
  public transferDestination: any = [];
  public transferOrigin: any = [];
  public selectedAccount: string = '';
  public amount: number = 0;
  public destination: string = '';
  public concept: string = '';
  groupedTransfers: { [key: string]: any[] } = {}; 
  objectKeys = Object.keys;

  constructor(
    private accountService: AccountsService,
    private transferService: TransferService,
  ){}

  ngOnInit(): void {
    this.init();
    this.createChart();
  }

  async init(){
    try {
      const response = await this.accountService.getAllAccounts().toPromise();
      if(response?.accounts){
        this.accounts = response?.accounts;
        await this.updateChart();
      }
      await this.getTransferOrigin();
    } catch (error) {
      console.error('Error al obtener las cuentas:', error);
    }
  }

  async getTransferOrigin(){
    try {
      const response = await this.transferService.getTransfersGroupedByOriginAccount('ss').toPromise();
      console.log('Cuentas obtenidas:', response);
      this.groupedTransfers = response;

    } catch (error) {
      console.error('Error al obtener las cuentas:', error);
    }
  }

  async createChart(){
    const labels = this.transferDestination?.map((item: { _id: any; }) => item._id); // Extrae los valores _id como etiquetas
    const values = this.transferDestination?.map((item: { total: any; }) => item.total); // Extrae los valores total como datos
  
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
  }

  async updateChart(){
    try {
      const response = await this.transferService.getTransfersGroupedByDestinationAccount('sss').toPromise();

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

  async sendTransfer(){
    if(this.selectedAccount === ''){
      return;
    }

    if(this.amount === 0){
      return
    }

    const accountSelected = this.accounts.find((x: { _id: string; }) => x._id === this.selectedAccount);

    if(!accountSelected){
      return;
    }
    if(this.amount > accountSelected.amount){
      alert('El monto se exede');
      return;
    }

    let data = {
      origin_account: accountSelected.account, 
      id_origin_account: accountSelected, 
      amount: this.amount, 
      concept: this.concept, 
      destination_account: this.destination
    }

    try {
      const response = await this.transferService.createTransfer(data).toPromise();
      console.log('Transferencia exitosa:', response);
      this.init();
    } catch (error) {
      console.error('Error en la transferencia:', error);
    }

  }

  reset(){
    this.selectedAccount = '';
    this.amount = 0;
    this.concept = '';
    this.destination = '';
  }

  transformDate(date: string){
    return new Date(date).toISOString().split('T')[0];
  }

}
