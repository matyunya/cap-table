import bootstrap from "~matyunya/store";

export const store = bootstrap({
  profile: {
    language: navigator.languages[0].slice(0, 2),
    projectedInvestmentTypes: [],
  },
  documents: new Map(),
  plans: new Map(),
  scenarios: new Map(),
  benchmarks: new Map(),
});

