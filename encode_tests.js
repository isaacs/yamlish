var test = require('tap').test
var yamlish = require('./yamlish')
var encode = yamlish.encode
var decode = yamlish.decode
var assert = require('assert')

function repr(obj){
  return JSON.stringify(obj)
}

test('Simple scalar', function(t){
  t.equal(encode(1), '1')
  t.end()
})

test('undefined and null', function(t){
  t.equal(encode(undefined), '~')
  t.equal(encode(null), '~')
  t.end()
})

test('Unprintable', function(t){
  t.equal(encode("\x01\n\t"), '\u0001')
  t.end()
})

test('Simple array', function(t){
  t.equal(encode([1, 2, 3]), "\n  - 1\n  - 2\n  - 3")
  t.end()
})

test('Empty array', function(t){
  t.equal(encode([]), '[]')
  t.end()
})

test('Empty object', function(t){
  t.equal(encode({}), '{}')
  t.end()
})

test('Array, two elements, undefined', function(t){
  t.equal(encode([ undefined, undefined ]), '\n  - ~\n  - ~')
  t.end()
})

test('Nested array', function(t){
  t.equal(encode([ 1, 2, [3, 4], 5 ]), [
      '\n  - 1'
    , '\n  - 2'
    , '\n  - '
    , '\n    - 3'
    , '\n    - 4'
    , '\n  - 5'
  ].join(''))
  t.end()
})

test('Nested Empty', function(t){
  t.equal(encode([ 1, 2, [], 5 ]), [
      '\n  - 1'
    , '\n  - 2'
    , '\n  - []'
    , '\n  - 5'
  ].join(''))
  t.end()
})

test('Simple object', function(t){
  t.equal(encode({ one: '1', two: '2', three: '3' }), [
      '\n    one:   1'
    , '\n    two:   2'
    , '\n    three: 3'
  ].join(''))
  t.end()
})

test('Nested object', function(t){
  t.equal(encode({
    one: '1'
    , two: '2'
    , more: {
      three: '3'
      , four: '4'
    }
  }), [
      '\n    one:  1'
    , '\n    two:  2'
    , '\n    more: '
    , '\n      three: 3'
    , '\n      four:  4'].join(''))
  t.end()
})

test('Nested empty', function(t){
  t.equal(encode({ one: '1', two: '2', more: {} }), [
      '\n    one:  1'
    , '\n    two:  2'
    , '\n    more: {}'
  ].join(''))
  t.end()
})

test('Unprintable key', function(t){
  t.equal(encode({ one: '1', "\x02": '2', three: '3' }), [
      '\n    one:      1'
    , '\n    \"\\u0002\": 2'
    , '\n    three:    3'
  ].join(''))
  t.end()
})

test('Empty key', function(t){
  t.equal(encode({ '' : 'empty' }), '\n    "": empty')
  t.end()
})

test('Funky hash key', function(t){
  t.equal(encode({ './frob' : 'is_frob' }), '\n    "./frob": is_frob')
  t.end()
})

test('Complex', function(t){
  var complexObject = {
      'bill-to' : {
          'given'   : 'Chris',
          'address' : {
              'city'   : 'Royal Oak',
              'postal' : '48046',
              'lines'  : "458 Walkman Dr.\nSuite #292\n",
              'state'  : 'MI'
          },
          'family' : 'Dumars'
      },
      'invoice' : '34843',
      'date'    : '2001-01-23',
      'tax'     : '251.42',
      'product' : [
          {   'sku'         : 'BL394D',
              'quantity'    : '4',
              'price'       : '450.00',
              'description' : 'Basketball'
          },
          {   'sku'         : 'BL4438H',
              'quantity'    : '1',
              'price'       : '2392.00',
              'description' : 'Super Hoop'
          }
      ],
      'comments' :
        "Late afternoon is best. Backup contact is Nancy Billsmer @ 338-4338\n",
      'total' : '4443.52'
  }
  var expectedOutput = '\n\
    \"bill-to\": \n\
      given:   Chris\n\
      address: \n\
        city:   Royal Oak\n\
        postal: 48046\n\
        lines:  |\n\
          458 Walkman Dr.\n\
          Suite #292\n\
        state:  MI\n\
      family:  Dumars\n\
    invoice:   34843\n\
    date:      2001-01-23\n\
    tax:       251.42\n\
    product:   \n\
      - \n\
        sku:         BL394D\n\
        quantity:    4\n\
        price:       450.00\n\
        description: Basketball\n\
      - \n\
        sku:         BL4438H\n\
        quantity:    1\n\
        price:       2392.00\n\
        description: Super Hoop\n\
    comments:  Late afternoon is best. Backup contact is Nancy Billsmer @ 338-4338\n\
    total:     4443.52'
  t.equal(encode(complexObject), expectedOutput)
  t.end()
})