export function validate(data, fields) {
  if (Object.keys(fields).length === 0) {
    throw new Error('Empty fields definition');
  }

  let errors = {};

  Object.keys(fields)
    .filter(k => fields[k].required || fields[k].validate)
    .forEach((key) => {
      if (fields[key].required && data[key] === undefined) {
        errors[key] = "この項目が必須です。";
        return;
      }

      const fns = fields[key].validate;
      if (fns) {
        const validations = Array.isArray(fns) ? fns : [fns];
        const ers = validations.map(fn => fn(data[key], data)).filter(Boolean);
        if (ers.length > 0) {
          errors[key] = ers;
        }
      }
    });

  for (const key in errors) {
    if (errors[key] == false) {
      delete errors[key];
    }
  }

  return [Object.keys(errors).length === 0, errors];
}

export const passwordRules = [
  (v, { confirm }) =>
    v !== confirm ? "パスワードが間違っています" : false,
  (v) => (v.length < 8 ? "８桁のパスワードを入力してください" : false),
];

export function scrollToError() {
  const el = document.querySelector(".error");
  if (el) {
    el.scrollIntoView();
    el.focus();
  }
}
