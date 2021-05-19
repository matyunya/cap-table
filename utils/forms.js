export function validate(data, fields) {
  if (Object.keys(fields).length === 0) {
    throw new Error("Empty fields definition");
  }

  let errors = {};

  Object.keys(fields)
    .filter((k) => fields[k].required || fields[k].validate)
    .forEach((key) => {
      if (fields[key].required && data[key] === undefined) {
        errors[key] = "必須項目です";
        return;
      }

      if (fields[key].max && data[key] > fields[key].max) {
        errors[key] = "上限を超過しました";
        return;
      }

      const fns = fields[key].validate;
      if (fns) {
        const validations = Array.isArray(fns) ? fns : [fns];
        const ers = validations
          .map((fn) => fn(data[key], data))
          .filter(Boolean);
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

export const length = (n) => (v) =>
  v.length < n ? n + "桁を入力してください" : false;

const sameAs = (field) => (v, data) =>
  v !== data[field] ? "パスワードが一致しません" : false;

export const passwordRules = [
  sameAs("confirm"),
  length(8),
  (v) =>
    /[0-9]$/.test(v) && /[a-zA-Z]/.test(v)
      ? false
      : "半角英数字8文字以上で入力して下さい",
];

export const passwordConfirmRules = [sameAs("password"), length(8)];

export function scrollToError() {
  const el = document.querySelector("label.error");
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "center" });
  }
}
