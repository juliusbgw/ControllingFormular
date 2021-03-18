import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';

function handleError(error: HttpErrorResponse) {
  if (error.error instanceof ErrorEvent) {
    // A client-side or network error occurred. Handle it accordingly.
    console.error('An error occurred:', error.error.message);
  } else {
    // The backend returned an unsuccessful response code.
    // The response body may contain clues as to what went wrong.
    console.error(
      `Backend returned code ${error.status}, ` +
        `body was: ${JSON.stringify(error.error)}`
    );
  }
  // Return an observable with a user-facing error message.
  alert('Etwas ist schief gelaufen. Bitte versuchen Sie es später erneut.');
  return throwError('Something bad happened; please try again later.');
}

interface question {
  question: string;
  questionInternalName: string;
  type: 'Text' | 'Choice' | 'MultiChoice';
  options: string[];
}

export { handleError, question };
