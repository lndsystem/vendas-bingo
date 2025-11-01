import { Component } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { ConsultaComponent } from "../consulta/consulta.component";
import { BtnAppleComponent } from "../../shared/btn-apple/btn-apple.component";
import { BtnGoogleComponent } from "../../shared/btn-google/btn-google.component";

@Component({
  selector: 'app-home',
  imports: [HeaderComponent, ConsultaComponent, BtnAppleComponent, BtnAppleComponent, BtnGoogleComponent],
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
