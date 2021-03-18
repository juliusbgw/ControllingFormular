import { Injectable } from '@angular/core';
import { websiteURL } from '../config';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { handleError } from '../utils';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  getCurrentUser() {
    return this.http
      .get(websiteURL + '/_api/web/CurrentUser', {
        headers: {
          Accept: 'application/json;odata=verbose',
          'Content-Type': 'application/json;odata=verbose',
        },
      })
      .pipe(catchError(handleError));
  }
}
