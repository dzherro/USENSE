import { Routes } from '@angular/router';
import { WeatherWidgetComponent } from './components/weather-widget/weather-widget.component';

export const routes: Routes = [
  {
    path: '',
    component: WeatherWidgetComponent
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];
