import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { Observable, catchError, from, of, switchMap, throwError } from 'rxjs';
import { WeatherInfo } from '../models/weather.model';
import { environment } from '../../environments/environment';
import { RedisCacheService } from './redis-cache.service';
import { isPlatformServer } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private readonly isServer: boolean;
  private cachedData = new Map<string, { data: WeatherInfo; timestamp: number }>();
  private readonly CACHE_DURATION = 10 * 60 * 1000;

  constructor(
    private http: HttpClient,
    private cacheService: RedisCacheService,
    @Inject(PLATFORM_ID) platformId: object
  ) {
    this.isServer = isPlatformServer(platformId);
  }

  public getWeatherByCity(city: string): Observable<WeatherInfo> {
    const cacheKey = `weather:${city.toLowerCase()}`;
    const now = Date.now();

    if (!this.isServer) {
      const cachedItem = this.cachedData.get(cacheKey);
      if (cachedItem && now - cachedItem.timestamp < this.CACHE_DURATION) {
        return of(cachedItem.data);
      }
    }

    if (this.isServer) {
      return from(this.cacheService.get<WeatherInfo>(cacheKey)).pipe(
        switchMap((cachedData) => {
          if (cachedData) {
            return of(cachedData);
          }

          return this.fetchFromApi(city, cacheKey);
        })
      );
    }

    return this.fetchFromApi(city, cacheKey);
  }

  private fetchFromApi(city: string, cacheKey: string): Observable<WeatherInfo> {
    const url = `${environment.apiUrl}/weather?q=${city}&appid=${environment.apiKey}&units=metric`;

    return this.http.get<WeatherInfo>(url).pipe(
      switchMap((data) => {
        if (this.isServer) {
          this.cacheService.set(cacheKey, data);
        }

        if (!this.isServer) {
          this.cachedData.set(cacheKey, { data, timestamp: Date.now() });
        }

        return of(data);
      }),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Error Occured';

    if (error.error && error.error.message) {
      errorMessage = error.error.message;
    }

    return throwError(() => new Error(errorMessage));
  }
}
