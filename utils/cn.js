export default function cn(cond = {}) {
  return Object.keys(cond).reduce(
    (acc, classString) => (cond[classString] ? acc + " " + classString : acc),
    ""
  );
}

export const classes = new Set([]);
