export interface Source {
  owner: string;
  repo: string;
  number: number;
  kind: 'issue' | 'pr';
  url: string;
}

export interface Subject {
  title: string;
  body: string;
  extra?: string;
}

export interface Triageexpect {
  added: string[];
  excluded: string[];
  blocked: string[];
  one: string[][];
}

export interface Feedbackexpect {
  add: string[];
  remove: string[];
  block: string[];
  explain: boolean;
  learn: boolean;
  clarify: boolean;
}

export interface Feedbackruntime {
  reaction: string;
  reply: string;
  added: string[];
  removed: string[];
}

export interface Learnexpect {
  verified: boolean;
  draft: boolean;
}

export interface Scopecheck {
  owner: string;
  repo: string;
  expect: boolean;
}

export interface Triagedata {
  suite: 'triage';
  source: Source;
  subject: Subject;
  runs: number;
  gold?: string[];
  available?: string[];
  expect: Triageexpect;
}

export interface Feedbackdata {
  suite: 'feedback';
  source: Source;
  subject: {
    kind: 'issue' | 'pr';
    title: string;
    body: string;
  };
  current: string[];
  available?: string[];
  message: string;
  expect: Feedbackexpect;
  runtime?: Feedbackruntime;
}

export interface Learndata {
  suite: 'learn';
  source: Source;
  trigger: Source;
  subject: Subject;
  current: string[];
  correct: string[];
  block: string[];
  available?: string[];
  message: string;
  expect: Learnexpect;
}

export interface Scopedata {
  suite: 'scope';
  source: Source;
  checks: Scopecheck[];
}

export type Evalcase = Triagedata | Feedbackdata | Learndata | Scopedata;

export interface Labelrow {
  name: string;
  description: string;
  color: string;
}

export interface Row {
  id: string;
  suite: Evalcase['suite'];
  url: string;
  pass: boolean;
  text: string;
  time: number;
}
