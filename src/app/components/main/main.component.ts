import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { ListService } from 'src/app/services/list.service';
import { UserService } from 'src/app/services/user.service';
import { question } from 'src/app/utils';
import { checkBoxValidator } from '../../validators/checkbox-validator';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  @ViewChild('stepper') stepper: MatStepper;
  selectedStepIndex = 0;
  isLinear = true;
  form: FormArray;
  formGroup: FormGroup;
  submitSuccessfull = false;
  questions: question[] = [];
  listItemUserIds = [];
  currentUser: { id: number; name: string };
  alreadySubmittedMessage = 'Sie haben bereits an der Umfrage teilgenommen.';

  constructor(
    private _formBuilder: FormBuilder,
    private listService: ListService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.formGroup = this._formBuilder.group({
      form: this._formBuilder.array([]),
    });
    // Nur mit Dummy Data aus "utils" benutzen
    // for (let q of questions) {
    //   this.addItem(q);
    // }
    this.userService.getCurrentUser().subscribe((data: any) => {
      const result = data.d;
      if (result) {
        this.currentUser = {
          id: result.Id,
          name: result.Title,
        };
      } else {
        console.log('Could not find current user.');
      }
    });
    this.listService.getItems().subscribe((data: any) => {
      try {
        data.d.results.forEach((elem) => {
          this.listItemUserIds.push({
            id: elem.AuthorId,
            name: elem.Title,
            time: elem.Modified,
          });
        });
      } catch (e) {
        console.error(e);
      }
    });
    this.listService.getFields().subscribe((data: any) => {
      try {
        data.d.results.forEach((element) => {
          const columnName = element['Title'];
          if (
            columnName !== 'Inhaltstyp' &&
            columnName !== 'Anlagen' &&
            columnName !== 'Titel'
          ) {
            const questionObj = {
              question: element['Title'],
              questionInternalName: element['InternalName'],
              type: element['TypeAsString'],
              options: element['Choices'] ? element['Choices'].results : [],
            };
            this.questions.push(questionObj);
            this.addItem(questionObj);
          }
        });
      } catch (e) {
        console.error(e);
        alert(JSON.stringify(e));
      }
    });
  }

  init(question: question) {
    if (question.type == 'MultiChoice') {
      let opts = {};
      question.options.forEach((o) => {
        opts[o] = new FormControl(false);
      });
      return this._formBuilder.group(
        {
          cont: new FormGroup(opts),
        },
        { validators: checkBoxValidator }
      );
    } else {
      return this._formBuilder.group({
        cont: new FormControl('', [Validators.required]),
      });
    }
  }

  addItem(question: question) {
    this.form = this.formGroup.get('form') as FormArray;
    this.form.push(this.init(question));
  }
  getControls() {
    return (this.formGroup.controls.form as FormArray).controls;
  }

  getError(i: number, errorType = 'required', isCheckbox = false) {
    const fg = this.getControls()[i] as FormGroup;
    return isCheckbox
      ? fg.hasError(errorType)
      : fg.controls.cont.hasError(errorType);
  }

  getDisabled(i: number, type: string) {
    return this.questions[i].type !== type;
  }

  onSubmit() {
    if (this.submitSuccessfull) {
      alert('Sie haben bereits an der Umfrage teilgenommen.');
      return;
    }
    if (!(this.formGroup.status === 'VALID')) {
      return;
    }
    const questionValuePairs = this.questions.map((q, i) => {
      // MultiChoice: {key1: value1, key2: value2} zu ["key1", "key2"]
      const value =
        q.type === 'MultiChoice'
          ? Object.entries(this.formGroup.value.form[i].cont)
              .filter(([key, val]) => val === true)
              .map(([key, val]) => key)
          : this.formGroup.value.form[i].cont;
      return {
        question: q.question,
        type: q.type,
        questionInternalName: q.questionInternalName,
        value,
      };
    });
    this.listService.addItem(questionValuePairs).subscribe((data) => {
      this.alreadySubmittedMessage = 'Vielen Dank für Ihre Teilnahme!';
      this.submitSuccessfull = true;
      this.stepper.selectedIndex = 0;
      this.formGroup.reset();
    });
  }

  userAlreadySubmitted() {
    return this.submitSuccessfull ||
      this.listItemUserIds.find(
        (user) => user && this.currentUser && user.id === this.currentUser.id
      )
      ? true
      : false;
  }
}
