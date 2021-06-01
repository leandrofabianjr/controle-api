import { ValidationError } from 'class-validator';
import { JSDOM } from 'jsdom';

export const invalidFeedback = function (inputName: string, options) {
  const errors: ValidationError[] = options?.data?.root?.errors ?? [];
  const error = errors.find((e) => e.property == inputName);

  const document = new JSDOM(`<html></html>`).window.document;
  const $html = document.querySelector('html');

  if (error) {
    const $feedback = document.createElement('div');
    $feedback.classList.add('invalid-feedback');
    const key = Object.keys(error.constraints)[0];
    $feedback.innerHTML = error.constraints[key];
    $html.appendChild($feedback);
  }

  return $html.innerHTML;
};
