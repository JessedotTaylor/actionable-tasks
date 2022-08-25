import { FormGroup } from "@angular/forms";

export function getDirtyValues(form: FormGroup) {
    let dirtyValues:{[key: string]: any} = {};
    Object.keys(form.controls).forEach(key => {
      let currentControl = form.controls[key];

      if (currentControl.dirty) {
        if ((currentControl as FormGroup).controls) {
          dirtyValues[key] = getDirtyValues((currentControl as FormGroup))
        } else {
          dirtyValues[key] = currentControl.value
        }
      }
    });
    return dirtyValues;
}