var code0 = '0'.charCodeAt(0)
var code9 = '9'.charCodeAt(0)
function isDigit (c) {
  var code = c.charCodeAt(0)
  return (code0 <= code && code <= code9)
}

/*
// to be consistent on client and server sort lexically :(
var compareStrings = (typeof Intl === 'object' && Intl.Collator) ?
  new Intl.Collator('en').compare :
  function (a, b) { return a.localeCompare(b) }
*/
function compareStrings (a, b) {
  if (a === b) return 0
  return a < b ? -1 : 1
}

module.exports = function compare (a, b) {
  a = String(a).trim().toLowerCase()
  b = String(b).trim().toLowerCase()
  if (a === b) return 0

  var aLen = a.length
  var aStart = 0
  var aEnd = 0
  var bLen = b.length
  var bStart = 0
  var bEnd = 0
  var result = 0

  while (!result && aEnd < aLen && bEnd < bLen) {
    // compare text portion
    aStart = aEnd
    bStart = bEnd
    while (aEnd < aLen && !isDigit(a.charAt(aEnd))) ++aEnd
    while (bEnd < bLen && !isDigit(a.charAt(bEnd))) ++bEnd
    result = compareStrings(
      a.slice(aStart, aEnd).trim(),
      b.slice(bStart, bEnd).trim()
    )
    if (result) break

    // compare numeric portion
    aStart = aEnd
    bStart = bEnd
    while (aEnd < aLen && isDigit(a.charAt(aEnd))) ++aEnd
    while (bEnd < bLen && isDigit(a.charAt(bEnd))) ++bEnd
    result = (
      +(a.slice(aStart, aEnd) || -1) -
      +(b.slice(bStart, bEnd) || -1)
    )
  }

  return result
}
