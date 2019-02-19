// [ vim: set tabstop=2 shiftwidth=2 expandtab : ] 

/**                                           
 * @author marek.langiewicz@gmail.com (Marek Langiewicz)
 * @fileoverview
 * This file contains main code for the NOH Insects library
 */

require('./demo.css');
var $ = require('jquery');
var noh = require('noh.js');

/**
TODO: generowanie drogi:
- najpierw tylko 2 duże drzewa po bokach, kliknięcie sadzi całą resztę od najbliższych (odrazu każde posadzone reaguje na wiatr)
- sadzenie wzdłuż drogi, ale czasem też z boku - ale warstwami od najbliższych
- perspektywa zagięta, tak, że droga wchodzi na 'pagórek' i za pagórkiem już nie widać
- z pełnego lasu na horyzoncie rezygnujemy
- kolejne warsztwy coraz bardziej blade - nie przeźroczyste, tylko szare; delikatna zmiana tylko.
- wiatr się z czasem ma rozhulać (globalna zmienna z siłą wiatru - żeby metoda 'tick' pozostała bezparametrowa)
- po jakimś czasie powinno 'przywiać' na środek literki z informacją o bibliotece NOH
*/




/**
 * @param {number|string} x
 * @param {number|string} y
 * @return {!noh.Element}
 */
noh.Element.prototype.pos = function(x, y) {
  return this
    .css('left', x)
    .css('top', y);
};

/**
 * @param {number|string} width
 * @param {number|string} height
 * @return {!noh.Element}
 */
noh.Element.prototype.size = function(width, height) {
  return this
    .css('width', width)
    .css('height', height);
};

/**
 * @param {number} dx
 * @param {number} dy
 * @return {!noh.Element}
 */
noh.Element.prototype.move = function(dx, dy) {
  var pos = this.$.position();
  return this.pos(pos.left + dx, pos.top + dy);
};

/**
 * @param {string} origin
 * @return {!noh.Element}
 */
noh.Element.prototype.torig = function(origin) {
  return this
    .css('transform-origin', origin)
    .css('-webkit-transform-origin', origin)
    .css('-moz-transform-origin', origin)
    .css('-o-transform-origin', origin);
};

/**
 * @param {string} transform
 * @return {!noh.Element}
 */
noh.Element.prototype.trans = function(transform) {
  return this
    .css('transform', transform)
    .css('-webkit-transform', transform)
    .css('-moz-transform', transform)
    .css('-o-transform', transform);
};


/**
 * This method will set CSS transform property of this element to just simple rotation with given angle (in degrees)
 * @param {number} angle An angle of desired rotation. (in degrees)
 * @return {!noh.Element}
 */
noh.Element.prototype.trans_rotate = function(angle) {
  this.trans_rotate_angle_ = angle;
  return this.trans('rotate(' + angle + 'deg)');
};

/**
 * This method will modify element rotation set by trans_rotate by adding given angle to the base rotation.
 * It can be reversed easily by trans_rotate_diff(0)
 * @param {!FNum} angle An angle of desired rotation adjustment. (in degrees)
 * @return {!noh.Element}
 */
noh.Element.prototype.trans_rotate_diff = function(angle) {
  if(this.trans_rotate_angle_ !== undefined)
    angle = num(angle) + this.trans_rotate_angle_;
  return this.trans('rotate(' + angle + 'deg)');
};

/**
 * @param {...noh.AttrsAndNodes} var_args Attributes and children nodes. See {@linkcode noh.organize} for more detailed explanation about attributes and children parameters.
 * @return {!noh.Element} A div element with position:absolute
 */
adiv = function(var_args) {
  return noh.div(arguments).css('position', 'absolute');
};

exports.adiv = adiv;


/**
 * @param {number|string=} opt_width
 * @param {number|string=} opt_height
 * @param {string=} opt_color
 * @param {number|string=} opt_radius
 * @return {!noh.Element}
 */
rect = function(opt_width, opt_height, opt_color, opt_radius) {
  var rect = adiv().size(
    opt_width === undefined ? '100px' : opt_width,
    opt_height === undefined ? '100px' : opt_height
  )
    .css('background-color', opt_color === undefined ? 'black' : opt_color);
  if(opt_radius)
    rect.css('border-radius', opt_radius);
  return rect;
};

exports.rect = rect;

/**
 * @param {number} n1
 * @param {number} n2
 * @return {number}
 */
min = function(n1, n2) { return n2 < n1 ? n2 : n1; };

/**
 * @param {number} n1
 * @param {number} n2
 * @return {number}
 */
max = function(n1, n2) { return n1 < n2 ? n2 : n1; };





/**
 * @constructor
 * @param {Array.<!Object>} ticks This array should contain objects with .tick() method, or some plain functions (to call when ticker ticks)
 * @param {number=} opt_interval Time interval between ticks in miliseconds.
 */
Ticker = function(ticks, opt_interval) {
  this.ticks = ticks;
  this.interval = opt_interval === undefined ? 1000 : opt_interval;
};

exports.Ticker = Ticker;

/**
 * Iterates through all ticks and calls the .tick() method (or just call the function if the object is plain function)
 * @return {Ticker}
 */
Ticker.prototype.tick = function() {
  for(var i = 0; i < this.ticks.length; ++i)
    if(this.ticks[i].tick)
      this.ticks[i].tick();
    else if(typeof this.ticks[i] === "function")
      /** @type {Function} */(this.ticks[i])();
  return this;
};


/**
 * Stops ticking.
 * @return {Ticker}
 */
Ticker.prototype.stop = function() {
  if(this.intervalId_ !== undefined)
    window.clearInterval(this.intervalId_);
  this.intervalId_ = undefined;
  return this;
};


/**
 * Starts ticking.
 * @return {Ticker}
 */
Ticker.prototype.start = function() {
  this.stop();
  var this_ = this;
  this.intervalId_ = window.setInterval(function() { this_.tick(); }, this.interval);
  return this;
};

/**
 * Checks if the ticker is ticking now.
 * @return {boolean}
 */
Ticker.prototype.started = function() { return this.intervalId_ !== undefined; };

Ticker.prototype.change_interval = function(interval) {
  this.interval = interval;
  if(this.started()) {
    this.stop();
    this.start();
  }
  return this;
};


/**
 * Creates new Ticker object
 * @param {Array.<!Object>} ticks This array should contain objects with .tick() method, or some plain functions (to call when ticker ticks)
 * @param {number=} opt_interval Time interval between ticks in miliseconds.
 * @return {!Ticker}
 */
ticker = function(ticks, opt_interval) {
  return new Ticker(ticks, opt_interval);
};




/**
 * It can be used pretty much just like a normal number, but it returns a little bit
 * different value each time after you tick it...
 * @constructor
 * @param {number} value The nominal value this object will represent
 * @param {number=} opt_varless how much smaller the returned values can be (default=value)
 * @param {number=} opt_varmore how much bigger the returned values can be (default=opt_varless)
 * @param {boolean=} opt_autotick should every get invoke a tick first? (default=false)
 * Try: var number = new FuzzyNumber(10,2,7); for(var i = 0; i < 30; ++i) {number.tick(); console.log(number+0);}
 * to see how it works. (arithmetic expression number+0 forces javascript to use valueOf method)
 * (more explicit way of getting the actual value would be number.get())
 * Generally this class gives us some kind of a lazy evaluation - the valueOf method is used only
 * when our FuzzyNumber is used in some kind of an arithmetic expression.
 * TODO: Define interface IFuzzyNumber, and rewrite this class as just one of possible implementation (TickNumber)
 */
FuzzyNumber = function(value, opt_varless, opt_varmore, opt_autotick) {
  this.value = value;
  this.varless = opt_varless === undefined ? value : opt_varless;
  this.varmore = opt_varmore === undefined ? this.varless : opt_varmore;
  this.autotick = opt_autotick === undefined ? false : opt_autotick;
  this.tick();
};

exports.FuzzyNumber = FuzzyNumber;


/**
 * @return {!FuzzyNumber}
 */
FuzzyNumber.prototype.tick = function() {
  var vl = /** @type {number} */(this.varless.valueOf()); // in case varless is fuzzy - we just want to get ONE number.
  var vm = /** @type {number} */(this.varmore.valueOf()); // in case varmore is fuzzy - we just want to get ONE number.
  this.actval = this.value - vl + Math.random() * (vl + vm);
  return this;
};

/**
 * @return {number}
 */
FuzzyNumber.prototype.get = function() {
  if(this.autotick)
    this.tick();
  return this.actval;
};

/**
 * @return {number}
 */
FuzzyNumber.prototype.valueOf = function() {
  return this.get();
};

/**
 * @param {number} value The nominal value this object will represent
 * @param {number=} opt_varless how much smaller the returned values can be (default=value)
 * @param {number=} opt_varmore how much bigger the returned values can be (default=opt_varless)
 * @param {boolean=} opt_autotick should every get invoke a tick first? (default=false)
 */
fnum = function(value, opt_varless, opt_varmore, opt_autotick) {
  return new FuzzyNumber(value, opt_varless, opt_varmore, opt_autotick);
};

exports.fnum = fnum;

/**
 * @typedef {!FuzzyNumber|number}
 */
var FNum;

/**
 * returns a value (actual) from FuzzyNumber, or just regular number.
 * @param {!FNum} fnum
 * @return {number}
 */
num = function(fnum) {
  return /** @type {number} */(fnum.valueOf());
};

exports.num = num;

/**
 * @param {FNum} x
 * @param {FNum} y
 * @param {FNum=} opt_speed How far it aims every time (in pixels).
 * @param {FNum=} opt_agility How often it changes direction (in seconds)
 * @param {FNum=} opt_ttl After how many ticks we disappear (undefined means we do not)
 * @return {!noh.Element}
 */
fly = function(x, y, opt_speed, opt_agility, opt_ttl) {

  var fly = rect(4, 4).css('position', 'fixed');


  fly.speed = opt_speed || 70; // how far it aims every time (in pixels)
  fly.agility = opt_agility === undefined ? 0.3 : num(opt_agility); // how often it changes direction (in seconds)
  fly.ttl = opt_ttl; // time to live - after how many ticks we disappear (undefined means we do not)


  /**
   * @this {!noh.Element}
   * @param {number} x
   * @param {number} y
   * @param {number} z It changes the shadow between the fly, so it looks like it is above the screen at certain height
   */
  fly.aim = function(x, y, z) {
    if(z < 0)
      z = 0; // the fly will land
    this.x = x;
    this.y = y;
    this.z = z;
    this.pos(x, y);
    this.css('box-shadow', '' + z + 'px ' + z + 'px ' + z + 'px');
    return this;
  };

  fly.css('transition', 'all 0s').aim(x, y, 0).css('transition', 'all ' + (fly.agility * 1.2) + 's linear');

  /**
   * @this {!noh.Element}
   */
  fly.tick = function() {
    if(this.ttl !== undefined && --this.ttl <= 0) {
      this.stop();
      this.css('display', 'none');
    }
    if(this.z === 0 && Math.random() < 0.9)
      return;
    var s = num(this.speed); // in case our speed is fuzzy
    var z = Math.random() * 40 - 5;
    if(this.z === 0 && z <= 0) // we are walking - not flying
      s /= 6;
    var x = this.x + Math.random() * 2 * s - s;
    var y = this.y + Math.random() * 2 * s - s;
    this.aim(x, y, z);
    return this;
  };

  fly.ticker = ticker([fly], fly.agility * 1000);

  /**
   * @this {!noh.Element}
   */
  fly.stop = function() {
    this.ticker.stop();
    return this;
  };

  /**
   * @this {!noh.Element}
   */
  fly.start = function() {
    this.ticker.start();
    return this;
  };

  /**
   * @this {!noh.Element}
   */
  fly.started = function() {
    return this.ticker.started();
  };

  return fly;
};

exports.fly = fly;


/**
 * @type {{ strength: !FNum }}
 */
var wind = { strength: 0 };

exports.wind = wind;



/**
 * @typedef {{
 *  depth:(FNum|undefined),
 *  breadth:(FNum|undefined),
 *  spread:(FNum|undefined),
 *  trunkw:(number|undefined),
 *  trunkw_factor:(FNum|undefined),
 *  trunkh:(number|undefined),
 *  trunkh_factor:(FNum|undefined),
 *  light:(FNum|undefined)}}
 */
var TreeOptions;


/**
 * @param {!TreeOptions=} opt_options
 */
tree = function(opt_options) {
  var opt = /** @type {!TreeOptions} */($.extend({}, tree.options, opt_options));
  return tree_rec_(
    /** @type {FNum} */(opt.depth),
    /** @type {number} */(opt.trunkw),
    /** @type {number} */(opt.trunkh),
    opt
  );
};

exports.tree = tree;

/**
 * @type {!TreeOptions}
 */
tree.options = { // defaults
  depth: 4, // levels of recursion
  breadth: 3, //how many subtrees will grow on each side of the tree trunk.
  spread: 40, // maximum rotation angle of subtree connected to the trunk (in degrees).
  trunkw: 6, // width of the trunk (in pixels)
  trunkh: 200, // height of the trunk (in pixels)
  trunkw_factor: 3/4, // trunk width is multiplied by this factor for next level tree (0..1)
  trunkh_factor: 3/5, // trunk height is multiplied by this factor for next level tree (0..1)
  light: 1 // what part of the trunk can have some branches (subtrees) (0..1)
};


/**
 * @param {FNum} depth
 * @param {number} trunkw
 * @param {number} trunkh
 * @param {!TreeOptions} opt
 */
tree_rec_ = function(depth, trunkw, trunkh, opt) {
  var trunk = rect(trunkw, trunkh).pos(-trunkw/2, -trunkh);
  if(depth <= 1)
    return adiv(trunk);
  var subtrees = [];
  var b = /** @type {number} */ (opt.breadth.valueOf()); // in case the breadth is fuzzy
  for(var i = 0; i < Math.floor(b); ++i) {
    var tl = tree_rec_(depth-1, max(1, trunkw*opt.trunkw_factor), trunkh*opt.trunkh_factor, opt);
    var tr = tree_rec_(depth-1, max(1, trunkw*opt.trunkw_factor), trunkh*opt.trunkh_factor, opt);
    tl.pos(0, -trunkh+trunkw/2 + opt.light*i*trunkh/b).torig('0px 0px').trans_rotate( opt.spread*(i+1)/b);
    tr.pos(0, -trunkh+trunkw/2 + opt.light*i*trunkh/b).torig('0px 0px').trans_rotate(-opt.spread*(i+1)/b);
    subtrees.push(tl);
    subtrees.push(tr);
  }
  var tree = adiv(trunk, subtrees);
  /**
   * @this {!noh.Element}
   */
  tree.tick = function() {
    this.trans_rotate_diff(num(wind.strength));
    for(var i = 0; i < subtrees.length; ++i)
      if(subtrees[i].tick !== undefined)
        subtrees[i].tick();
  };
  return tree;
};


forest = function() {
    var trees = [];
    trees.push(tree({ depth: 5, breadth: 1, spread: fnum(20, 15, 15, true), trunkw:  8, trunkh:  60, trunkh_factor: fnum(0.82, 0.3, 0.3, true) }).pos( 200, $(window).height()));
    trees.push(tree({ depth: 5, breadth: 1, spread: fnum(20, 15, 15, true), trunkw:  8, trunkh:  60, trunkh_factor: fnum(0.82, 0.3, 0.3, true) }).pos( 400, $(window).height()));
    trees.push(tree({ depth: 7, breadth: 1, spread: fnum(20, 15, 15, true), trunkw: 12, trunkh: 100, trunkh_factor: fnum(0.82, 0.3, 0.3, true) }).pos( 600, $(window).height()));
    trees.push(tree({ depth: 7, breadth: 1, spread: fnum(20, 15, 15, true), trunkw: 12, trunkh: 100, trunkh_factor: fnum(0.82, 0.3, 0.3, true) }).pos( 800, $(window).height()));
    trees.push(tree({ depth: 7, breadth: 1, spread: fnum(20, 15, 15, true), trunkw: 12, trunkh: 100, trunkh_factor: fnum(0.82, 0.3, 0.3, true) }).pos(1000, $(window).height()));
    var aforest = noh.div(trees).addclass("smooth very_lazy");
    aforest.addbigtree = function() {
        var x = fnum(600, 400).get();
        var bigtree = tree({ depth:10, breadth: 1, spread: fnum(20, 15, 15, true), trunkw: 34, trunkh: 140, trunkh_factor: fnum( 0.8, 0.2, 0.2, true) }).pos(x, $(window).height());
        this.add(bigtree);
    };
    aforest.tick = function() {
        for(var i = 0; i < this.length; ++i)
            if(this[i].tick)
                this[i].tick();
    };
    var aticker = ticker(aforest, 6000);
    aticker.start();
    return aforest;
};

exports.forest = forest;

