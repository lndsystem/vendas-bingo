import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ResultComponent } from './pages/result/result.component';
import { ConsultComponent } from './pages/consult/consult.component';
import { ConsultPixComponent } from './pages/consult-pix/consult-pix.component';

export const routes: Routes = [
    { path: '', component: HomeComponent},
    { path: 'consulta', component: ConsultComponent},
    { path: 'resultado', component: ResultComponent},
    { path: 'pix/:referencia', component: ConsultPixComponent},
    { path: '**', redirectTo: "/"}
];
