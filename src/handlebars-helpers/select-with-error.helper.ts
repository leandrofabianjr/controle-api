import { ValidationError } from 'class-validator';
import { JSDOM } from 'jsdom';

export const selectWithError = function (inputName: string, options) {
  const errors: ValidationError[] = options?.data?.root?.errors ?? [];
  const error = errors.find((e) => e.property == inputName);

  const document = new JSDOM(`<html>${options.fn(this)}</html>`).window
    .document;
  const $html = document.querySelector('html');

  const $select: HTMLSelectElement = $html.querySelector(`[name=${inputName}]`);

  if (error) {
    $select.classList.add('is-invalid');
    const $feedback = document.createElement('div');
    $feedback.classList.add('invalid-feedback');
    const key = Object.keys(error.constraints)[0];
    $feedback.innerHTML = error.constraints[key];
    $html.appendChild($feedback);
  }

  // const dto = options?.data?.root?.dto ?? {};
  // if (inputName in dto) {
  //   const selectedValue = dto[inputName];
  //   for (let i = 0; i < $select.options.length; i++) {
  //     if ($select.options[i].value == selectedValue) {
  //       $select.options[i].selected = true;
  //       break;
  //     }
  //   }
  // }

  return $html.innerHTML;
};
