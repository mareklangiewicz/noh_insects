// [ vim: set tabstop=2 shiftwidth=2 expandtab : ] 

/**                                           
 * @author marek.langiewicz@gmail.com (Marek Langiewicz)
 * @fileoverview
 * This file contains main code for the NOH Insects library
 */


/**
TODO: generowanie drogi:
- najpierw tylko 2 duże drzewa po bokach, kliknięcie sadzi całą resztę od najbliższych (odrazu każde posadzone reaguje na wiatr)
- sadzenie wzdłuż drogi, ale czasem też z boku - ale warstwami od najbliższych
- perspektywa zagięta, tak, że droga wchodzi na 'pagórek' i za pagórkiem już nie widać
- s pełnego lasu na horyzoncie rezygnujemy
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
 * @param {...noh.AttrsAndNodes} var_args Attributes and children nodes. See {@linkcode noh.organize} for more detailed explanation about attributes and children parameters.
 * @return {!noh.Element} A div element with position:absolute
 */
noh.adiv = function(var_args) {
  return noh.div(arguments).css('position', 'absolute');
};


/**
 * @param {number|string=} opt_width
 * @param {number|string=} opt_height
 * @param {string=} opt_color
 * @param {number|string=} opt_radius
 * @return {!noh.Element}
 */
noh.rect = function(opt_width, opt_height, opt_color, opt_radius) {
  var rect = noh.adiv().size(
    opt_width === undefined ? '100px' : opt_width,
    opt_height === undefined ? '100px' : opt_height
  )
    .css('background-color', opt_color === undefined ? 'black' : opt_color);
  if(opt_radius)
    rect.css('border-radius', opt_radius);
  return rect;
};




/**
 * @param {number} n1
 * @param {number} n2
 * @return {number}
 */
function min(n1, n2) { return n2 < n1 ? n2 : n1; };

/**
 * @param {number} n1
 * @param {number} n2
 * @return {number}
 */
function max(n1, n2) { return n1 < n2 ? n2 : n1; };



/**
 * It can be used pretty much just like a normal number, but it returns everytime a little bit
 * different value...
 * @constructor
 * @param {number} value The nominal value this object will represent
 * @param {number=} opt_varless how much smaller the returned values can be (default=value)
 * @param {number=} opt_varmore how much bigger the returned values can be (default=opt_varless)
 * Try: var number = new noh.FuzzyNumber(10,2,7); for(var i = 0; i < 30; ++i) console.log(number+0);
 * to see how it works. (arithmetic expression number+0 forces javascript to use valueOf method)
 * Generally this class gives us some kind of a lazy evaluation - the valueOf method is used only
 * when our noh.FuzzyNumber is used in some kind of an arithmetic expression.
 */
noh.FuzzyNumber = function(value, opt_varless, opt_varmore) {
  this.value = value;
  this.varless = opt_varless === undefined ? value : opt_varless;
  this.varmore = opt_varmore === undefined ? this.varless : opt_varmore;
};

/**
 * @return {number}
 */
noh.FuzzyNumber.prototype.valueOf = function() {
  var vl = /** @type {number} */(this.varless.valueOf()); // in case varless is fuzzy - we just want to get ONE number.
  var vm = /** @type {number} */(this.varmore.valueOf()); // in case varmore is fuzzy - we just want to get ONE number.
  return this.value - vl + Math.random() * (vl + vm);
};


/**
 * @param {number} value The nominal value this object will represent
 * @param {number=} opt_varless how much smaller the returned values can be (default=value)
 * @param {number=} opt_varmore how much bigger the returned values can be (default=opt_varless)
 */
function fnum(value, opt_varless, opt_varmore) {
  return new noh.FuzzyNumber(value, opt_varless, opt_varmore);
}


/**
 * @typedef {!noh.FuzzyNumber|number}
 */
noh.FNum;


/**
 * @param {noh.FNum} x 
 * @param {noh.FNum} y
 * @param {noh.FNum=} opt_speed How far it aims every time (in pixels).
 * @param {noh.FNum=} opt_agility How often it changes direction (in seconds)
 * @param {noh.FNum=} opt_ttl Afte how many ticks we disappear (undefined means we do not)
 * @return {!noh.Element}
 */
noh.fly = function(x, y, opt_speed, opt_agility, opt_ttl) {

  var fly = noh.rect(4, 4).css('position', 'fixed');


  fly.speed = opt_speed || 70; // how far it aims every time (in pixels)
  fly.agility = opt_agility === undefined ? 0.3 : /** @type {number} */ (opt_agility.valueOf()); // how often it changes direction (in seconds) (valueOf in case our agility is fuzzy)
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
    if(this.z == 0 && Math.random() < 0.9)
      return;
    var s = /** @type {number} */(this.speed.valueOf()); // in case our speed is fuzzy
    var z = Math.random() * 40 - 5;
    if(this.z == 0 && z <= 0) // we are walking - not flying
      s /= 6;
    var x = this.x + Math.random() * 2 * s - s;
    var y = this.y + Math.random() * 2 * s - s;
    this.aim(x, y, z);
  };

  var callback = function() { fly.tick(); };

  /**
   * @this {!noh.Element}
   */
  fly.stop = function() {
    if(this.intervalId_)
      window.clearInterval(this.intervalId_);
    this.intervalId_ = undefined;
  };

  /**
   * @this {!noh.Element}
   */
  fly.start = function() {
    if(this.intervalId_)
      this.stop();
    this.intervalId_ = window.setInterval(callback, this.agility * 1000);
  };

  return fly;
};

/**
 * @typedef {{
 *  depth:(noh.FNum|undefined),
 *  breadth:(noh.FNum|undefined),
 *  spread:(noh.FNum|undefined),
 *  trunkw:(number|undefined),
 *  trunkw_factor:(noh.FNum|undefined),
 *  trunkh:(number|undefined),
 *  trunkh_factor:(noh.FNum|undefined),
 *  light:(noh.FNum|undefined)}}
 */
noh.TreeOptions;


/**
 * @param {!noh.TreeOptions=} opt_options
 */
noh.tree = function(opt_options) {
  var opt = /** @type {!noh.TreeOptions} */($.extend({}, noh.tree.options, opt_options));
  return noh.tree_rec_(
    /** @type {noh.FNum} */(opt.depth),
    /** @type {number} */(opt.trunkw),
    /** @type {number} */(opt.trunkh),
    opt
  );
};

/**
 * @type {!noh.TreeOptions}
 */
noh.tree.options = { // defaults
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
 * @param {noh.FNum} depth
 * @param {number} trunkw
 * @param {number} trunkh
 * @param {!noh.TreeOptions} opt
 */
noh.tree_rec_ = function(depth, trunkw, trunkh, opt) {
  var trunk = noh.rect(trunkw, trunkh).pos(-trunkw/2, -trunkh);
  if(depth <= 1)
    return noh.adiv(trunk);
  var subtrees = [];
  var b = /** @type {number} */ (opt.breadth.valueOf()); // in case the breadth is fuzzy
  for(var i = 0; i < Math.floor(b); ++i) {
    var tl = noh.tree_rec_(depth-1, max(1, trunkw*opt.trunkw_factor), trunkh*opt.trunkh_factor, opt);
    var tr = noh.tree_rec_(depth-1, max(1, trunkw*opt.trunkw_factor), trunkh*opt.trunkh_factor, opt);
    tl.pos(0, -trunkh+trunkw/2 + opt.light*i*trunkh/b).torig('0px 0px').trans('rotate(' + ( opt.spread*(i+1)/b) + 'deg)');
    tr.pos(0, -trunkh+trunkw/2 + opt.light*i*trunkh/b).torig('0px 0px').trans('rotate(' + (-opt.spread*(i+1)/b) + 'deg)');
    subtrees.push(tl);
    subtrees.push(tr);
  }
  return noh.adiv(trunk, subtrees);
};



