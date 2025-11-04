import { Component } from '@angular/core';
import { BtnGoogleComponent } from '../../shared/btn-google/btn-google.component';
import { BtnAppleComponent } from '../../shared/btn-apple/btn-apple.component';

@Component({
  selector: 'app-footer-app',
  imports: [BtnAppleComponent, BtnGoogleComponent],
  templateUrl: './footer-app.component.html',
  styleUrl: './footer-app.component.css'
})
export class FooterAppComponent {

}
