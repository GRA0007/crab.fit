// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
export const detectBrowser = () => {
  // Opera 8.0+
  const isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0

  // Firefox 1.0+
  const isFirefox = typeof InstallTrigger !== 'undefined'

  // Safari 3.0+ "[object HTMLElementConstructor]"
  const isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === '[object SafariRemoteNotification]' })(!window['safari'] || (typeof safari !== 'undefined' && window['safari'].pushNotification))

  // Internet Explorer 6-11
  const isIE = /*@cc_on!@*/false || !!document.documentMode

  // Edge 20+
  const isEdge = !isIE && !!window.StyleMedia

  // Chrome 1 - 79
  const isChrome = !!window.chrome

  // Edge (based on chromium) detection
  // eslint-disable-next-line eqeqeq
  const isEdgeChromium = isChrome && (navigator.userAgent.indexOf("Edg") != -1)

  if (isEdgeChromium) return 'edge_chromium'
  if (isChrome) return 'chrome'
  if (isEdge) return 'edge'
  if (isIE) return 'ie'
  if (isSafari) return 'safari'
  if (isFirefox) return 'firefox'
  if (isOpera) return 'opera'
}
