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




noh.Element.prototype.pos = function(x, y) {
  return this
    .css('left', x)
    .css('top', y);
};

noh.Element.prototype.size = function(width, height) {
  return this
    .css('width', width)
    .css('height', height);
};

noh.Element.prototype.move = function(dx, dy) {
  var pos = this.$.position();
  this.pos(pos.left + dx, pos.top + dy);
};

noh.Element.prototype.torig = function(origin) {
  return this
    .css('transform-origin', origin)
    .css('-webkit-transform-origin', origin)
    .css('-moz-transform-origin', origin)
    .css('-o-transform-origin', origin);
};

noh.Element.prototype.trans = function(transform) {
  this
    .css('transform', transform)
    .css('-webkit-transform', transform)
    .css('-moz-transform', transform)
    .css('-o-transform', transform);
};


noh.adiv = function(var_args) {
  return noh.div(arguments).css('position', 'absolute');
};


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




function min(n1, n2) { return n2 < n1 ? n2 : n1; }
function max(n1, n2) { return n1 < n2 ? n2 : n1; }



/*
 * It can be used pretty much just like a normal number, but it returns everytime a little bit
 * different value...
 * @param {number} value The nominal value this object will represent
 * @param {number=} opt_varless how much smaller the returned values can be (default=value)
 * @param {number=} opt_varmore how much bigger the returned values can be (default=opt_varless)
 * Try: var number = new FuzzyNumber(10,2,7); for(var i = 0; i < 30; ++i) console.log(number+0);
 * to see how it works. (arithmetic expression number+0 forces javascript to use valueOf method)
 * Generally this class gives us some kind of a lazy evaluation - the valueOf method is used only
 * when our FuzzyNumber is used in some kind of an arithmetic expression.
 */
function FuzzyNumber(value, opt_varless, opt_varmore) {
  this.value = value;
  this.varless = opt_varless === undefined ? value : opt_varless;
  this.varmore = opt_varmore === undefined ? this.varless : opt_varmore;
}

FuzzyNumber.prototype.valueOf = function() {
  var vl = this.varless.valueOf(); // in case varless is fuzzy - we just want to get ONE number.
  var vm = this.varmore.valueOf(); // in case varmore is fuzzy - we just want to get ONE number.
  return this.value - vl + Math.random() * (vl + vm);
};


function fnum(value, opt_varless, opt_varmore) {
  return new FuzzyNumber(value, opt_varless, opt_varmore);
}





noh.fly = function(x, y, opt_speed, opt_agility, opt_ttl) {

  var fly = noh.rect(4, 4).css('position', 'fixed');


  fly.speed = opt_speed || 70; // how far it aims every time (in pixels)
  fly.agility = opt_agility || 0.3; // how often it changes direction (in seconds)
  fly.agility = fly.agility.valueOf() // in case our agility is fuzzy
  fly.ttl = opt_ttl // time to live - after how many ticks we disappear (undefined means we do not)


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

  fly.tick = function() {
    if(this.ttl !== undefined && --this.ttl <= 0) {
      this.stop();
      this.css('display', 'none');
    }
    if(this.z == 0 && Math.random() < 0.9)
      return;
    var s = this.speed.valueOf(); // in case our speed is fuzzy
    var z = Math.random() * 40 - 5;
    if(this.z == 0 && z <= 0) // we are walking - not flying
      s /= 6;
    var x = this.x + Math.random() * 2 * s - s;
    var y = this.y + Math.random() * 2 * s - s;
    this.aim(x, y, z);
  };

  var callback = function() { fly.tick(); };

  fly.stop = function() {
    if(this.intervalId_)
      window.clearInterval(this.intervalId_);
    this.intervalId_ = undefined;
  };

  fly.start = function() {
    if(this.intervalId_)
      this.stop();
    this.intervalId_ = window.setInterval(callback, this.agility * 1000);
  };

  return fly;
};






noh.tree = function(opt_level, opt_trunkw, opt_trunkh) {
  var level = opt_level === undefined || opt_level < 1 ? 4 : opt_level;
  var trunkw = opt_trunkw || 10;
  var trunkh = opt_trunkh || 200;
  return noh._tree_rec(level, trunkw, trunkh);
};

noh._tree_rec = function(level, trunkw, trunkh) {
  var trunk = noh.rect(trunkw, trunkh).pos(-trunkw/2, -trunkh);
  if(level <= 1)
    return trunk;
  var t1 = noh.adiv(noh._tree_rec(level-1, max(1, trunkw*3/4), trunkh*(3+Math.random()*3)/5));
  var t2 = noh.adiv(noh._tree_rec(level-1, max(1, trunkw*3/4), trunkh*(3+Math.random()*2)/5));

  t1.css('top', -trunkh+trunkw);
  t2.css('top', -trunkh+trunkw);

  var r = 8 + Math.random() * 25;
  if(level % 1)
    r = -r + Math.random() * 20 - 10;
  t1.torig('0px 0px').trans('rotate(' + r + 'deg)');
  r = -r;
  t2.torig('0px 0px').trans('rotate(' + r + 'deg)');
  return noh.div(trunk, t1, t2)
    .css('position', 'absolute');
};
