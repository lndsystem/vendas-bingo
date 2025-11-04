import { Component } from '@angular/core';
import { ResultTicketComponent } from "../../components/result-ticket/result-ticket.component";
import { HeaderComponent } from '../../components/header/header.component';

@Component({
  selector: 'app-result',
  imports: [HeaderComponent, ResultTicketComponent],
  templateUrl: './result.component.html',
  styleUrl: './result.component.css'
})
export class ResultComponent {

}
