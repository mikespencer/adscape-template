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
  ok(wpAd.skinWindowConfig, 'main config defined');
});

test('SkinWindow Object', function(){
  ok(wpAd.SkinWindow, 'SkinWindow object exists');
});

test('skinWindow instance', function(){
  ok(wpAd.skinWindow, 'SkinWindow instance exists');
});

module('configuration')

test('config', function(){
  ok(wpAd.skinWindow.config, 'config defined');
});

test('imageURL', function(){
  equal(wpAd.skinWindow.config.imageURL, '../dist/img/bg.jpg', 'bg image ok');
});

test('rendered', function(){
  ok($('#slug_pushdown').children().length, 'rendered');
});
