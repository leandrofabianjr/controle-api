import { ValidationError } from 'class-validator';
import { JSDOM } from 'jsdom';

const inputWithError = function (inputName: string, options) {
  const errors: ValidationError[] = options?.data?.root?.errors ?? [];
  const error = errors.find((e) => e.property == inputName);
  const dto = options?.data?.root?.dto ?? {};

  const document = new JSDOM(`<html>${options.fn()}</html>`).window.document;
  const $html = document.querySelector('html');

  const $input: HTMLInputElement = $html.querySelector(`[name=${inputName}]`);

  console.log($input.value);
  if (error) {
    $input.classList.add('is-invalid');
    const $feedback = document.createElement('div');
    $feedback.classList.add('invalid-feedback');
    const key = Object.keys(error.constraints)[0];
    $feedback.innerHTML = error.constraints[key];
    $html.appendChild($feedback);
  }

  if (inputName in dto) {
    $input.setAttribute('value', dto[inputName]);
  }

  return $html.innerHTML;
};

export default inputWithError;
