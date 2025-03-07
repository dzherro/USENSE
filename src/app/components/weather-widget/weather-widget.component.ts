import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { WeatherService } from '../../services/weather.service';
import { NotificationService } from '../../services/notification.service';
import { WeatherInfo } from '../../models/weather.model';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';

enum WeatherClass {
  Thunderstorm = 'thunderstorm',
  Rain = 'rain',
  Snow = 'snow',
  Atmosphere = 'atmosphere',
  ClearDay = 'clear-day',
  ClearNight = 'clear-night',
  CloudsDay = 'clouds-day',
  CloudsNight = 'clouds-night'
}

@Component({
  selector: 'app-weather-widget',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatSnackBarModule, MatInputModule, MatButtonModule, MatIconModule, MatFormFieldModule],
  templateUrl: './weather-widget.component.html',
  styleUrl: './weather-widget.component.scss'
})
export class WeatherWidgetComponent implements OnInit, OnDestroy {
  public loading = false;
  public weatherForm!: FormGroup;
  public weather: WeatherInfo | undefined;
  private weatherSubscription: Subscription | undefined;

  constructor(
    private weatherService: WeatherService,
    private notificationService: NotificationService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.weatherForm = this.fb.group({
      city: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  getWeather(): void {
    if (this.weatherForm.valid) {
      this.loading = true;
      const city = this.weatherForm.get('city')?.value;

      this.weatherSubscription = this.weatherService.getWeatherByCity(city).subscribe({
        next: (data) => {
          this.weather = data;
          this.loading = false;
          this.notificationService.showSuccess(`Weather for ${city} loaded successfully`);
        },
        error: (error) => {
          this.loading = false;
          this.notificationService.showError(error.message);
        }
      });
    }
  }

  getWeatherClass(): string {
    if (!this.weather) return '';

    const { id, icon } = this.weather.weather[0];
    const isNight = icon.includes('n');

    switch (true) {
      case id >= 200 && id < 300:
        return WeatherClass.Thunderstorm;

      case id >= 300 && id < 600:
        return WeatherClass.Rain;

      case id >= 600 && id < 700:
        return WeatherClass.Snow;

      case id >= 700 && id < 800:
        return WeatherClass.Atmosphere;

      case id === 800:
        return isNight ? WeatherClass.ClearNight : WeatherClass.ClearDay;

      case id > 800:
        return isNight ? WeatherClass.CloudsNight : WeatherClass.CloudsDay;

      default:
        return '';
    }
  }

  ngOnDestroy(): void {
    if (this.weatherSubscription) {
      this.weatherSubscription.unsubscribe();
    }
  }
}
