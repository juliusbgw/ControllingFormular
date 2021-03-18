import { FormGroup } from '@angular/forms';

export function checkBoxValidator(formGroup: FormGroup, min = 1) {
  // Werte der Checkboxen als Array formatieren
  const checkedArr = Object.values(
    (formGroup.controls.cont as FormGroup).controls
  ).map((element) => element.value);
  // Wenn keine Checkbox ausgewählt ist, einen Validierungsfehler zurückgeben
  if (checkedArr.indexOf(true) === -1) {
    return { requireOneCheckboxToBeChecked: true };
  }
  // Keinen Fehler (Validierung bestanden)
  return null;
}
