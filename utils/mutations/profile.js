export function SET_LANGUAGE({ language }) {
  return ({ set }) => set("profile", "language", language);
}
