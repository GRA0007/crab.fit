export const makeClass = (...classes: (string | false | undefined | null | 0 | '')[]) =>
  classes.filter(Boolean).join(' ')
