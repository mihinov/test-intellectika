import { catchError, filter, map, take, timeout } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export function authGuard(): Observable<boolean> {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.getMeAndSaveUser().pipe(
    filter(user => user !== null), // фильтруем значения не null
    take(1),                      // берём первое подходящее значение
    timeout(2000),                // ждём максимум 2 секунды
    map(() => true),              // если пришло, разрешаем
    catchError(() => {
      // Если таймаут или ошибка — редирект и запрещаем переход
      router.navigate(['/auth']);
      return of(false);
    })
  );
}
