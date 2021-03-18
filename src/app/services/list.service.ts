import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { websiteURL, listName, SP_DataType } from '../config';
import { handleError } from '../utils';

@Injectable({
  providedIn: 'root',
})
export class ListService {
  constructor(private http: HttpClient) {}

  getFields(): Observable<Object> {
    return this.http
      .get(
        websiteURL +
          `/_api/web/lists/GetByTitle('${listName}')/fields?$filter=Hidden eq false and ReadOnlyField eq false`,
        {
          headers: {
            Accept: 'application/json;odata=verbose',
            'Content-Type': 'application/json;odata=verbose',
          },
        }
      )
      .pipe(catchError(handleError));
  }

  getItems(): Observable<Object> {
    return this.http
      .get(websiteURL + `/_api/web/lists/GetByTitle('${listName}')/items`, {
        headers: {
          Accept: 'application/json;odata=verbose',
          'Content-Type': 'application/json;odata=verbose',
        },
      })
      .pipe(catchError(handleError));
  }

  addItem(data) {
    const requestDigest = (document.getElementById(
      '__REQUESTDIGEST'
    ) as HTMLInputElement).value;
    let questionsDict = {
      __metadata: {
        type: SP_DataType,
      },
    };

    data.forEach((q) => {
      if (q.type === 'MultiChoice') {
        questionsDict[q.questionInternalName] = { results: q.value };
      } else {
        questionsDict[q.questionInternalName] = q.value;
      }
    });
    return this.http
      .post(
        websiteURL + `/_api/web/lists/GetByTitle('${listName}')/items`,
        JSON.stringify(questionsDict),
        {
          headers: {
            Accept: 'application/json;odata=verbose',
            'Content-Type': 'application/json;odata=verbose',
            'X-RequestDigest': requestDigest,
          },
        }
      )
      .pipe(catchError(handleError));
  }
}
