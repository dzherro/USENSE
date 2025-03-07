import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor(private snackBar: MatSnackBar) {}

  public showError(message: string, action = 'Close', duration = 5000): void {
    const config: MatSnackBarConfig = {
      duration: duration,
      panelClass: ['error-snackbar'],
      horizontalPosition: 'right',
      verticalPosition: 'top'
    };

    this.snackBar.open(message, action, config);
  }

  public showSuccess(message: string, action = 'OK', duration = 3000): void {
    const config: MatSnackBarConfig = {
      duration: duration,
      panelClass: ['success-snackbar'],
      horizontalPosition: 'right',
      verticalPosition: 'top'
    };

    this.snackBar.open(message, action, config);
  }
}
