import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { PayTicketComponent } from '../../components/pay-ticket/pay-ticket.component';

@Component({
  selector: 'app-comprar',
  imports: [HeaderComponent, PayTicketComponent],
  templateUrl: './comprar.component.html',
  styleUrl: './comprar.component.css'
})
export class ComprarComponent implements OnInit{
  
  constructor() {
  }

  ngOnInit(): void {
  }
}
