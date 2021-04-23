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

export const length = (n) => (v) => (v.length < n ? n + "桁を入力してください" : false);
const sameAs = (field) => (v, data) => v !== data[field] ? "一緒ではありません" : false;

export const passwordRules = [
  sameAs("confirm"),
  length(8),
];

export const passwordConfirmRules = [
  sameAs("password"),
  length(8),
];

export function scrollToError() {
  const el = document.querySelector("label.error");
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "center" });
  }
}
