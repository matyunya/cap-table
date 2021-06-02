export function UPDATE_LAST_VIEWED() {
  return ({ set }) => set("lastViewed", Date.now());
}
