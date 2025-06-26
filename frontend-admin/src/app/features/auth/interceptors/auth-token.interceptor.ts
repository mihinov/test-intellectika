import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpEvent,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authTokenInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  const token = localStorage.getItem(AuthService.LOCAL_STORAGE_KEY);

  if (token === null) return next(req);
  try {
    const parsedToken = JSON.parse(token);
    if (parsedToken) {
      // Клонируем запрос и добавляем заголовок Authorization
      const authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${parsedToken}`,
        },
      });
      return next(authReq);
    }
  } catch {
    return next(req);
  }

  // Если токена нет — отправляем запрос без изменений
  return next(req);
};
