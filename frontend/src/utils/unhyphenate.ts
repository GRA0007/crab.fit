export const unhyphenate = (s: string) =>
  s.split('-')
    .map(w => w[0].toLocaleUpperCase() + w.substring(1).toLocaleLowerCase())
    .join(' ')
