/* jshint test */

/*
  ======== A Handy Little QUnit Reference ========
  http://api.qunitjs.com/

  Test methods:
    module(name, {[setup][ ,teardown]})
    test(name, callback)
    expect(numberOfAssertions)
    stop(increment)
    start(decrement)
  Test assertions:
    ok(value, [message])
    equal(actual, expected, [message])
    notEqual(actual, expected, [message])
    deepEqual(actual, expected, [message])
    notDeepEqual(actual, expected, [message])
    strictEqual(actual, expected, [message])
    notStrictEqual(actual, expected, [message])
    throws(block, [expected], [message])
*/

module('Global definitions');

test('Config', function(){
  ok(wpAd.adscapeConfig, 'main config defined');
});

test('Adscape Object', function(){
  ok(wpAd.Adscape, 'Adscape object exists');
});

test('adscape instance', function(){
  ok(wpAd.adscape, 'adscape instance exists');
});

module('configuration')

test('config', function(){
  ok(wpAd.adscape.config, 'config defined');
});

test('imageURL', function(){
  equal(wpAd.adscape.config.imageURL, '../dist/img/bg.jpg', 'bg image ok');
});

test('rendered', function(){
  ok($('.ad-adscape-wrap').children().length, 'rendered');
});
