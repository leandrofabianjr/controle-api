class InputMask {
  static Type = {
    Phone: this._phone,
  };

  static _phone(v) {
    console.log('_phone');
    var r = v.replace(/\D/g, '');
    r = r.replace(/^0/, '');
    if (r.length > 10) {
      r = r.replace(/^(\d\d)(\d{5})(\d{4}).*/, '($1) $2-$3');
    } else if (r.length > 5) {
      r = r.replace(/^(\d\d)(\d{4})(\d{0,4}).*/, '($1) $2-$3');
    } else if (r.length > 2) {
      r = r.replace(/^(\d\d)(\d{0,5})/, '($1) $2');
    } else if (r.length > 0) {
      r = r.replace(/^(\d*)/, '($1');
    }
    return r;
  }

  constructor($input, type) {
    $input.addEventListener('keypress', () => this._validate($input, type));
    $input.addEventListener('blur', () => this._validate($input, type));
  }

  _validate($input, type) {
    setTimeout(function () {
      var v = type($input.value);
      if (v != $input.value) {
        $input.value = v;
      }
    }, 1);
  }
}
