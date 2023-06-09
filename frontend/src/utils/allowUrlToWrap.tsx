import { Fragment } from 'react'

/**
 * Take a url and insert `<wbr>` elements to indicate to a browser
 * where to break the line. This allows urls to wrap which prevents
 * them from breaking layouts and also wraps them in a way that's still
 * readable.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/wbr | WBR element reference}
 */
export const allowUrlToWrap = (url: string): React.ReactNode => {
  const formatted = url
    .split('//') // Split the URL into an array to distinguish double slashes from single slashes
    .map(str => str
      // Insert a word break opportunity after a colon
      .replace(/(?<after>:)/giu, '$1<wbr>')
      // Before a single slash, tilde, period, comma, hyphen, underline, question mark, number sign, or percent symbol
      .replace(/(?<before>[/~.,\-_?#%])/giu, '<wbr>$1')
      // Before and after an equals sign or ampersand
      .replace(/(?<beforeAndAfter>[=&])/giu, '<wbr>$1<wbr>')
    ).join('//<wbr>')

  return formatted.split('<wbr>').map((section, i) =>
    <Fragment key={i}>{section}<wbr /></Fragment>
  )
}
