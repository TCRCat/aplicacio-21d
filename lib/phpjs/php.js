function md5 (str) {
  //  discuss at: http://locutus.io/php/md5/
  // original by: Webtoolkit.info (http://www.webtoolkit.info/)
  // improved by: Michael White (http://getsprink.com)
  // improved by: Jack
  // improved by: Kevin van Zonneveld (http://kvz.io)
  //    input by: Brett Zamir (http://brett-zamir.me)
  // bugfixed by: Kevin van Zonneveld (http://kvz.io)
  //      note 1: Keep in mind that in accordance with PHP, the whole string is buffered and then
  //      note 1: hashed. If available, we'd recommend using Node's native crypto modules directly
  //      note 1: in a steaming fashion for faster and more efficient hashing
  //   example 1: md5('Kevin van Zonneveld')
  //   returns 1: '6e658d4bfcb59cc13f96c14450ac40b9'

  var hash
  try {
    //~ var crypto = require('crypto')
    var md5sum = crypto.createHash('md5')
    md5sum.update(str)
    hash = md5sum.digest('hex')
  } catch (e) {
    hash = undefined
  }

  if (hash !== undefined) {
    return hash
  }

  var utf8Encode = utf8_encode
  var xl

  var _rotateLeft = function (lValue, iShiftBits) {
    return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits))
  }

  var _addUnsigned = function (lX, lY) {
    var lX4, lY4, lX8, lY8, lResult
    lX8 = (lX & 0x80000000)
    lY8 = (lY & 0x80000000)
    lX4 = (lX & 0x40000000)
    lY4 = (lY & 0x40000000)
    lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF)
    if (lX4 & lY4) {
      return (lResult ^ 0x80000000 ^ lX8 ^ lY8)
    }
    if (lX4 | lY4) {
      if (lResult & 0x40000000) {
        return (lResult ^ 0xC0000000 ^ lX8 ^ lY8)
      } else {
        return (lResult ^ 0x40000000 ^ lX8 ^ lY8)
      }
    } else {
      return (lResult ^ lX8 ^ lY8)
    }
  }

  var _F = function (x, y, z) {
    return (x & y) | ((~x) & z)
  }
  var _G = function (x, y, z) {
    return (x & z) | (y & (~z))
  }
  var _H = function (x, y, z) {
    return (x ^ y ^ z)
  }
  var _I = function (x, y, z) {
    return (y ^ (x | (~z)))
  }

  var _FF = function (a, b, c, d, x, s, ac) {
    a = _addUnsigned(a, _addUnsigned(_addUnsigned(_F(b, c, d), x), ac))
    return _addUnsigned(_rotateLeft(a, s), b)
  }

  var _GG = function (a, b, c, d, x, s, ac) {
    a = _addUnsigned(a, _addUnsigned(_addUnsigned(_G(b, c, d), x), ac))
    return _addUnsigned(_rotateLeft(a, s), b)
  }

  var _HH = function (a, b, c, d, x, s, ac) {
    a = _addUnsigned(a, _addUnsigned(_addUnsigned(_H(b, c, d), x), ac))
    return _addUnsigned(_rotateLeft(a, s), b)
  }

  var _II = function (a, b, c, d, x, s, ac) {
    a = _addUnsigned(a, _addUnsigned(_addUnsigned(_I(b, c, d), x), ac))
    return _addUnsigned(_rotateLeft(a, s), b)
  }

  var _convertToWordArray = function (str) {
    var lWordCount
    var lMessageLength = str.length
    var lNumberOfWordsTemp1 = lMessageLength + 8
    var lNumberOfWordsTemp2 = (lNumberOfWordsTemp1 - (lNumberOfWordsTemp1 % 64)) / 64
    var lNumberOfWords = (lNumberOfWordsTemp2 + 1) * 16
    var lWordArray = new Array(lNumberOfWords - 1)
    var lBytePosition = 0
    var lByteCount = 0
    while (lByteCount < lMessageLength) {
      lWordCount = (lByteCount - (lByteCount % 4)) / 4
      lBytePosition = (lByteCount % 4) * 8
      lWordArray[lWordCount] = (lWordArray[lWordCount] |
        (str.charCodeAt(lByteCount) << lBytePosition))
      lByteCount++
    }
    lWordCount = (lByteCount - (lByteCount % 4)) / 4
    lBytePosition = (lByteCount % 4) * 8
    lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition)
    lWordArray[lNumberOfWords - 2] = lMessageLength << 3
    lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29
    return lWordArray
  }

  var _wordToHex = function (lValue) {
    var wordToHexValue = ''
    var wordToHexValueTemp = ''
    var lByte
    var lCount

    for (lCount = 0; lCount <= 3; lCount++) {
      lByte = (lValue >>> (lCount * 8)) & 255
      wordToHexValueTemp = '0' + lByte.toString(16)
      wordToHexValue = wordToHexValue + wordToHexValueTemp.substr(wordToHexValueTemp.length - 2, 2)
    }
    return wordToHexValue
  }

  var x = []
  var k
  var AA
  var BB
  var CC
  var DD
  var a
  var b
  var c
  var d
  var S11 = 7
  var S12 = 12
  var S13 = 17
  var S14 = 22
  var S21 = 5
  var S22 = 9
  var S23 = 14
  var S24 = 20
  var S31 = 4
  var S32 = 11
  var S33 = 16
  var S34 = 23
  var S41 = 6
  var S42 = 10
  var S43 = 15
  var S44 = 21

  str = utf8Encode(str)
  x = _convertToWordArray(str)
  a = 0x67452301
  b = 0xEFCDAB89
  c = 0x98BADCFE
  d = 0x10325476

  xl = x.length
  for (k = 0; k < xl; k += 16) {
    AA = a
    BB = b
    CC = c
    DD = d
    a = _FF(a, b, c, d, x[k + 0], S11, 0xD76AA478)
    d = _FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756)
    c = _FF(c, d, a, b, x[k + 2], S13, 0x242070DB)
    b = _FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE)
    a = _FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF)
    d = _FF(d, a, b, c, x[k + 5], S12, 0x4787C62A)
    c = _FF(c, d, a, b, x[k + 6], S13, 0xA8304613)
    b = _FF(b, c, d, a, x[k + 7], S14, 0xFD469501)
    a = _FF(a, b, c, d, x[k + 8], S11, 0x698098D8)
    d = _FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF)
    c = _FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1)
    b = _FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE)
    a = _FF(a, b, c, d, x[k + 12], S11, 0x6B901122)
    d = _FF(d, a, b, c, x[k + 13], S12, 0xFD987193)
    c = _FF(c, d, a, b, x[k + 14], S13, 0xA679438E)
    b = _FF(b, c, d, a, x[k + 15], S14, 0x49B40821)
    a = _GG(a, b, c, d, x[k + 1], S21, 0xF61E2562)
    d = _GG(d, a, b, c, x[k + 6], S22, 0xC040B340)
    c = _GG(c, d, a, b, x[k + 11], S23, 0x265E5A51)
    b = _GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA)
    a = _GG(a, b, c, d, x[k + 5], S21, 0xD62F105D)
    d = _GG(d, a, b, c, x[k + 10], S22, 0x2441453)
    c = _GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681)
    b = _GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8)
    a = _GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6)
    d = _GG(d, a, b, c, x[k + 14], S22, 0xC33707D6)
    c = _GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87)
    b = _GG(b, c, d, a, x[k + 8], S24, 0x455A14ED)
    a = _GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905)
    d = _GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8)
    c = _GG(c, d, a, b, x[k + 7], S23, 0x676F02D9)
    b = _GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A)
    a = _HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942)
    d = _HH(d, a, b, c, x[k + 8], S32, 0x8771F681)
    c = _HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122)
    b = _HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C)
    a = _HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44)
    d = _HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9)
    c = _HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60)
    b = _HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70)
    a = _HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6)
    d = _HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA)
    c = _HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085)
    b = _HH(b, c, d, a, x[k + 6], S34, 0x4881D05)
    a = _HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039)
    d = _HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5)
    c = _HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8)
    b = _HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665)
    a = _II(a, b, c, d, x[k + 0], S41, 0xF4292244)
    d = _II(d, a, b, c, x[k + 7], S42, 0x432AFF97)
    c = _II(c, d, a, b, x[k + 14], S43, 0xAB9423A7)
    b = _II(b, c, d, a, x[k + 5], S44, 0xFC93A039)
    a = _II(a, b, c, d, x[k + 12], S41, 0x655B59C3)
    d = _II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92)
    c = _II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D)
    b = _II(b, c, d, a, x[k + 1], S44, 0x85845DD1)
    a = _II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F)
    d = _II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0)
    c = _II(c, d, a, b, x[k + 6], S43, 0xA3014314)
    b = _II(b, c, d, a, x[k + 13], S44, 0x4E0811A1)
    a = _II(a, b, c, d, x[k + 4], S41, 0xF7537E82)
    d = _II(d, a, b, c, x[k + 11], S42, 0xBD3AF235)
    c = _II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB)
    b = _II(b, c, d, a, x[k + 9], S44, 0xEB86D391)
    a = _addUnsigned(a, AA)
    b = _addUnsigned(b, BB)
    c = _addUnsigned(c, CC)
    d = _addUnsigned(d, DD)
  }

  var temp = _wordToHex(a) + _wordToHex(b) + _wordToHex(c) + _wordToHex(d)

  return temp.toLowerCase()
}

function utf8_encode (argString) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/utf8_encode/
  // original by: Webtoolkit.info (http://www.webtoolkit.info/)
  // improved by: Kevin van Zonneveld (http://kvz.io)
  // improved by: sowberry
  // improved by: Jack
  // improved by: Yves Sucaet
  // improved by: kirilloid
  // bugfixed by: Onno Marsman (https://twitter.com/onnomarsman)
  // bugfixed by: Onno Marsman (https://twitter.com/onnomarsman)
  // bugfixed by: Ulrich
  // bugfixed by: Rafał Kukawski (http://blog.kukawski.pl)
  // bugfixed by: kirilloid
  //   example 1: utf8_encode('Kevin van Zonneveld')
  //   returns 1: 'Kevin van Zonneveld'

  if (argString === null || typeof argString === 'undefined') {
    return ''
  }

  // .replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  var string = (argString + '')
  var utftext = ''
  var start
  var end
  var stringl = 0

  start = end = 0
  stringl = string.length
  for (var n = 0; n < stringl; n++) {
    var c1 = string.charCodeAt(n)
    var enc = null

    if (c1 < 128) {
      end++
    } else if (c1 > 127 && c1 < 2048) {
      enc = String.fromCharCode(
        (c1 >> 6) | 192, (c1 & 63) | 128
      )
    } else if ((c1 & 0xF800) !== 0xD800) {
      enc = String.fromCharCode(
        (c1 >> 12) | 224, ((c1 >> 6) & 63) | 128, (c1 & 63) | 128
      )
    } else {
      // surrogate pairs
      if ((c1 & 0xFC00) !== 0xD800) {
        throw new RangeError('Unmatched trail surrogate at ' + n)
      }
      var c2 = string.charCodeAt(++n)
      if ((c2 & 0xFC00) !== 0xDC00) {
        throw new RangeError('Unmatched lead surrogate at ' + (n - 1))
      }
      c1 = ((c1 & 0x3FF) << 10) + (c2 & 0x3FF) + 0x10000
      enc = String.fromCharCode(
        (c1 >> 18) | 240, ((c1 >> 12) & 63) | 128, ((c1 >> 6) & 63) | 128, (c1 & 63) | 128
      )
    }
    if (enc !== null) {
      if (end > start) {
        utftext += string.slice(start, end)
      }
      utftext += enc
      start = end = n + 1
    }
  }

  if (end > start) {
    utftext += string.slice(start, stringl)
  }

  return utftext
}

function date (format, timestamp) {
  //  discuss at: http://locutus.io/php/date/
  // original by: Carlos R. L. Rodrigues (http://www.jsfromhell.com)
  // original by: gettimeofday
  //    parts by: Peter-Paul Koch (http://www.quirksmode.org/js/beat.html)
  // improved by: Kevin van Zonneveld (http://kvz.io)
  // improved by: MeEtc (http://yass.meetcweb.com)
  // improved by: Brad Touesnard
  // improved by: Tim Wiel
  // improved by: Bryan Elliott
  // improved by: David Randall
  // improved by: Theriault (https://github.com/Theriault)
  // improved by: Theriault (https://github.com/Theriault)
  // improved by: Brett Zamir (http://brett-zamir.me)
  // improved by: Theriault (https://github.com/Theriault)
  // improved by: Thomas Beaucourt (http://www.webapp.fr)
  // improved by: JT
  // improved by: Theriault (https://github.com/Theriault)
  // improved by: Rafał Kukawski (http://blog.kukawski.pl)
  // improved by: Theriault (https://github.com/Theriault)
  //    input by: Brett Zamir (http://brett-zamir.me)
  //    input by: majak
  //    input by: Alex
  //    input by: Martin
  //    input by: Alex Wilson
  //    input by: Haravikk
  // bugfixed by: Kevin van Zonneveld (http://kvz.io)
  // bugfixed by: majak
  // bugfixed by: Kevin van Zonneveld (http://kvz.io)
  // bugfixed by: Brett Zamir (http://brett-zamir.me)
  // bugfixed by: omid (http://locutus.io/php/380:380#comment_137122)
  // bugfixed by: Chris (http://www.devotis.nl/)
  //      note 1: Uses global: locutus to store the default timezone
  //      note 1: Although the function potentially allows timezone info
  //      note 1: (see notes), it currently does not set
  //      note 1: per a timezone specified by date_default_timezone_set(). Implementers might use
  //      note 1: $locutus.currentTimezoneOffset and
  //      note 1: $locutus.currentTimezoneDST set by that function
  //      note 1: in order to adjust the dates in this function
  //      note 1: (or our other date functions!) accordingly
  //   example 1: date('H:m:s \\m \\i\\s \\m\\o\\n\\t\\h', 1062402400)
  //   returns 1: '07:09:40 m is month'
  //   example 2: date('F j, Y, g:i a', 1062462400)
  //   returns 2: 'September 2, 2003, 12:26 am'
  //   example 3: date('Y W o', 1062462400)
  //   returns 3: '2003 36 2003'
  //   example 4: var $x = date('Y m d', (new Date()).getTime() / 1000)
  //   example 4: $x = $x + ''
  //   example 4: var $result = $x.length // 2009 01 09
  //   returns 4: 10
  //   example 5: date('W', 1104534000)
  //   returns 5: '52'
  //   example 6: date('B t', 1104534000)
  //   returns 6: '999 31'
  //   example 7: date('W U', 1293750000.82); // 2010-12-31
  //   returns 7: '52 1293750000'
  //   example 8: date('W', 1293836400); // 2011-01-01
  //   returns 8: '52'
  //   example 9: date('W Y-m-d', 1293974054); // 2011-01-02
  //   returns 9: '52 2011-01-02'
  //        test: skip-1 skip-2 skip-5

  var jsdate, f
  // Keep this here (works, but for code commented-out below for file size reasons)
  // var tal= [];
  var txtWords = [
    'Sun', 'Mon', 'Tues', 'Wednes', 'Thurs', 'Fri', 'Satur',
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]
  // trailing backslash -> (dropped)
  // a backslash followed by any character (including backslash) -> the character
  // empty string -> empty string
  var formatChr = /\\?(.?)/gi
  var formatChrCb = function (t, s) {
    return f[t] ? f[t]() : s
  }
  var _pad = function (n, c) {
    n = String(n)
    while (n.length < c) {
      n = '0' + n
    }
    return n
  }
  f = {
    // Day
    d: function () {
      // Day of month w/leading 0; 01..31
      return _pad(f.j(), 2)
    },
    D: function () {
      // Shorthand day name; Mon...Sun
      return f.l()
        .slice(0, 3)
    },
    j: function () {
      // Day of month; 1..31
      return jsdate.getDate()
    },
    l: function () {
      // Full day name; Monday...Sunday
      return txtWords[f.w()] + 'day'
    },
    N: function () {
      // ISO-8601 day of week; 1[Mon]..7[Sun]
      return f.w() || 7
    },
    S: function () {
      // Ordinal suffix for day of month; st, nd, rd, th
      var j = f.j()
      var i = j % 10
      if (i <= 3 && parseInt((j % 100) / 10, 10) === 1) {
        i = 0
      }
      return ['st', 'nd', 'rd'][i - 1] || 'th'
    },
    w: function () {
      // Day of week; 0[Sun]..6[Sat]
      return jsdate.getDay()
    },
    z: function () {
      // Day of year; 0..365
      var a = new Date(f.Y(), f.n() - 1, f.j())
      var b = new Date(f.Y(), 0, 1)
      return Math.round((a - b) / 864e5)
    },

    // Week
    W: function () {
      // ISO-8601 week number
      var a = new Date(f.Y(), f.n() - 1, f.j() - f.N() + 3)
      var b = new Date(a.getFullYear(), 0, 4)
      return _pad(1 + Math.round((a - b) / 864e5 / 7), 2)
    },

    // Month
    F: function () {
      // Full month name; January...December
      return txtWords[6 + f.n()]
    },
    m: function () {
      // Month w/leading 0; 01...12
      return _pad(f.n(), 2)
    },
    M: function () {
      // Shorthand month name; Jan...Dec
      return f.F()
        .slice(0, 3)
    },
    n: function () {
      // Month; 1...12
      return jsdate.getMonth() + 1
    },
    t: function () {
      // Days in month; 28...31
      return (new Date(f.Y(), f.n(), 0))
        .getDate()
    },

    // Year
    L: function () {
      // Is leap year?; 0 or 1
      var j = f.Y()
      return j % 4 === 0 & j % 100 !== 0 | j % 400 === 0
    },
    o: function () {
      // ISO-8601 year
      var n = f.n()
      var W = f.W()
      var Y = f.Y()
      return Y + (n === 12 && W < 9 ? 1 : n === 1 && W > 9 ? -1 : 0)
    },
    Y: function () {
      // Full year; e.g. 1980...2010
      return jsdate.getFullYear()
    },
    y: function () {
      // Last two digits of year; 00...99
      return f.Y()
        .toString()
        .slice(-2)
    },

    // Time
    a: function () {
      // am or pm
      return jsdate.getHours() > 11 ? 'pm' : 'am'
    },
    A: function () {
      // AM or PM
      return f.a()
        .toUpperCase()
    },
    B: function () {
      // Swatch Internet time; 000..999
      var H = jsdate.getUTCHours() * 36e2
      // Hours
      var i = jsdate.getUTCMinutes() * 60
      // Minutes
      // Seconds
      var s = jsdate.getUTCSeconds()
      return _pad(Math.floor((H + i + s + 36e2) / 86.4) % 1e3, 3)
    },
    g: function () {
      // 12-Hours; 1..12
      return f.G() % 12 || 12
    },
    G: function () {
      // 24-Hours; 0..23
      return jsdate.getHours()
    },
    h: function () {
      // 12-Hours w/leading 0; 01..12
      return _pad(f.g(), 2)
    },
    H: function () {
      // 24-Hours w/leading 0; 00..23
      return _pad(f.G(), 2)
    },
    i: function () {
      // Minutes w/leading 0; 00..59
      return _pad(jsdate.getMinutes(), 2)
    },
    s: function () {
      // Seconds w/leading 0; 00..59
      return _pad(jsdate.getSeconds(), 2)
    },
    u: function () {
      // Microseconds; 000000-999000
      return _pad(jsdate.getMilliseconds() * 1000, 6)
    },

    // Timezone
    e: function () {
      // Timezone identifier; e.g. Atlantic/Azores, ...
      // The following works, but requires inclusion of the very large
      // timezone_abbreviations_list() function.
      /*              return that.date_default_timezone_get();
       */
      var msg = 'Not supported (see source code of date() for timezone on how to add support)'
      throw new Error(msg)
    },
    I: function () {
      // DST observed?; 0 or 1
      // Compares Jan 1 minus Jan 1 UTC to Jul 1 minus Jul 1 UTC.
      // If they are not equal, then DST is observed.
      var a = new Date(f.Y(), 0)
      // Jan 1
      var c = Date.UTC(f.Y(), 0)
      // Jan 1 UTC
      var b = new Date(f.Y(), 6)
      // Jul 1
      // Jul 1 UTC
      var d = Date.UTC(f.Y(), 6)
      return ((a - c) !== (b - d)) ? 1 : 0
    },
    O: function () {
      // Difference to GMT in hour format; e.g. +0200
      var tzo = jsdate.getTimezoneOffset()
      var a = Math.abs(tzo)
      return (tzo > 0 ? '-' : '+') + _pad(Math.floor(a / 60) * 100 + a % 60, 4)
    },
    P: function () {
      // Difference to GMT w/colon; e.g. +02:00
      var O = f.O()
      return (O.substr(0, 3) + ':' + O.substr(3, 2))
    },
    T: function () {
      // The following works, but requires inclusion of the very
      // large timezone_abbreviations_list() function.
      /*              var abbr, i, os, _default;
      if (!tal.length) {
        tal = that.timezone_abbreviations_list();
      }
      if ($locutus && $locutus.default_timezone) {
        _default = $locutus.default_timezone;
        for (abbr in tal) {
          for (i = 0; i < tal[abbr].length; i++) {
            if (tal[abbr][i].timezone_id === _default) {
              return abbr.toUpperCase();
            }
          }
        }
      }
      for (abbr in tal) {
        for (i = 0; i < tal[abbr].length; i++) {
          os = -jsdate.getTimezoneOffset() * 60;
          if (tal[abbr][i].offset === os) {
            return abbr.toUpperCase();
          }
        }
      }
      */
      return 'UTC'
    },
    Z: function () {
      // Timezone offset in seconds (-43200...50400)
      return -jsdate.getTimezoneOffset() * 60
    },

    // Full Date/Time
    c: function () {
      // ISO-8601 date.
      return 'Y-m-d\\TH:i:sP'.replace(formatChr, formatChrCb)
    },
    r: function () {
      // RFC 2822
      return 'D, d M Y H:i:s O'.replace(formatChr, formatChrCb)
    },
    U: function () {
      // Seconds since UNIX epoch
      return jsdate / 1000 | 0
    }
  }

  var _date = function (format, timestamp) {
    jsdate = (timestamp === undefined ? new Date() // Not provided
      : (timestamp instanceof Date) ? new Date(timestamp) // JS Date()
      : new Date(timestamp * 1000) // UNIX timestamp (auto-convert to int)
    )
    return format.replace(formatChr, formatChrCb)
  }

  return _date(format, timestamp)
}
