// [ vim: set tabstop=2 shiftwidth=2 expandtab : ] 

/**                                           
 * @author marek.langiewicz@gmail.com (Marek Langiewicz)
 * @fileoverview
 * This file contains tests for the NOH Insects library
 */



/**
 * This function will insert tree with all tests to DOM element with id="noh_insects_tests"
 * (if it finds one).If there is no such element, user can still insert it
 * wherever he wants, using noh_insects_tests() function by hand.
 */
function noh_insects_tests_init() {
  var container = $('#noh_insects_tests');
  if(container.length == 0)
    return;
  var tests = noh_insects_tests();
  tests.attachToDOM(container[0]);
}

$(document).ready(noh_insects_tests_init);



/**
 * Special div for tests. Contains strong border (double), big margin and big padding
 * The reason is to be clearly visible and distinguishable from other elements.
 * @param {...noh.AttrsAndNodes} as always..
 */
function tdiv(var_args) {
  return noh.div({"class":"noh stest"}, arguments);
}



/** @typedef {function():noh.Node} */
noh.STest;

/** @typedef {!Object.<string,!noh.STest>} */
noh.STests;

/**
 * Takes a function f that creates any noh.Node (this function represents some insect we want to run);
 * runs this f function; creates a special Node that displays the result.
 * @param {function():noh.Node} f A function with insect test code.
 * @return {noh.Element} Pretty result of running given insect test.
 */
function runstest(f) {
  var node = f();
  return tdiv(
    noh.ul(
      noh.li(noh.h4("Source code:"), noh.srccode(f)),
      noh.li(noh.h4("Result:"), tdiv(node))
    )
  );
  return tdiv(node);
}


/**
 * Runs whole insect tests collection
 * @param {noh.STests} stests Collection of simple tests to run.
 * @return {noh.Element} Pretty tests results.
 */
function runstests(stests) {
  var testsres = [];
  for(var t in stests)
    testsres.push(
      noh.dt(noh.fancy(noh.h3({id:"stest_" + t}, "stest: ", t))).css("padding", "20px"),
      noh.dd(runstest(stests[t]))
    );
  var runtests = noh.dl(testsres);
  return runtests;
}

function stests_toc(stests) {
  var astyle = {"class":"noh link", style:"padding: 5px"};
  var toc = [];
  for(var t in stests) {
    var a = noh.a(astyle, t);
    a.scroll_target = "#stest_" + t;
    a.on("click", function() { $(this.noh.scroll_target)[0].noh.scroll(); });
    toc.push(noh.li(a));
  }
  return noh.ul(toc);
}

function noh_insects_tests() {
  return noh.div(
    noh.fancy(noh.h1("NOH Insects")),
    noh.p("Please check the ", noh.a({href: "noh_doc.html"}, "documentation"), " first."),
    noh.fancy(noh.h3("TOC")),
    stests_toc(tests),
    runstests(tests)
  );
};



var tests = {};


tests.simple = function() { return noh.ex.simple(); };
tests.goofy = function() { return noh.ex.goofy(); };
tests.silly = function() { return noh.ex.silly(); };
tests.whitey = function() { return noh.ex.whitey(); };
tests.shiny = function() { return noh.ex.shiny(); };
tests.shiny = function() { return noh.ex.shiny(); };            
tests.idiots = function() { return noh.ex.idiots(); };

tests.colors = function() {
  return noh.div(
    noh.sdiv(noh.ex.color("red")),
    noh.sdiv(noh.ex.color("green")),
    noh.sdiv(noh.ex.color("blue"))
  );
};

tests.rainbows = function() {
  return noh.div(
    noh.sdiv(noh.ex.rainbow(5)),
    noh.sdiv(noh.ex.rainbow(10)),
    noh.sdiv(noh.ex.rainbow(15))
  );
};            



tests.sleepy = function() {

  var obj = noh.sleepy(noh.ex.simple(), 2000);

  return noh.objtest(obj, [
    'obj.wake()',
    'obj.sleep()',
    'obj.parent.addclass("smooth")',
    'obj.parent.remclass("smooth")'
  ]);
};





tests.overlay_logger_cmd = function() {

  var logger = noh.log.reel(15).addclass("pretty");
  install_logger(logger);
  var cmdline = noh.cmdline(40).addclass("pretty");
  var obj = noh.overlay(logger, cmdline);
  obj.addclass("bottom"); //We will control left/right position by hand
  obj.css("right", "10px");

  var objtest = noh.objtest(obj, [
    "obj.show()",
    "obj.hide()",
    "obj.show(1)",
    "obj.hide(1)",
    'obj.parent.addclass("smooth")',
    'obj.parent.remclass("smooth")',
    'obj.remclass("top").addclass("bottom")',
    'obj.remclass("bottom").addclass("top")',
    'obj.css("right", "30px")',
    'obj.css("right", "230px")'
  ]);

  obj.parent.addclass("smooth");
  
  return objtest;
};


function install_logger(logger) {

  noh.log.l2c(

    noh.log.multi([

      noh.log.c2l(window.console),

      noh.log.limitlen(
        noh.log.addtime(
          logger
        ), 40
      )

   ])

  ).install();

};




tests.rect = function() {

  var r1 = noh.rect('200px', '80px', 'black', '15px');
  var r2 = noh.rect('150px', '60px', 'blue', '7px').pos('150px', '30px');
  var obj = noh.div(r1, r2)
    .css('position', 'relative')
    .size(400, 300);

  return noh.objtest(obj, [
    'obj.css("width", "100px")',
    'obj.css("width", "20px")',
    'obj.trans("rotate(0deg)")',
    'obj.trans("rotate(40deg)")',
    'obj.trans("rotate(80deg)")',
    'obj.trans("rotate(140deg)")',
    'obj.torig("0px 0px")',
    'obj.torig("30px 0px")',
    'obj.torig("30px 30px")'
  ]).addclass("smooth");
};



noh.fuzzytester = function(number, opt_width, opt_height) {
  var tester = noh.div()
    .css('position', 'relative')
    .size(opt_width === undefined ? '300px' : opt_width,
        opt_height === undefined ? '300px' : opt_height);

  tester.clear = function() {
    while(this.length > 0)
      this.rem();
  };
  tester.test = function() {
    for(var i = 0; i < 100; ++i) {
      var r = noh.rect(4,4,'blue',3).pos('' + (0 + number) + '%', '' + i + '%');
      this.add(r);
    }
  };

  return tester;
};


tests.fuzzy0 = function() {

  var number = 50;
  var obj = noh.fuzzytester(number);

  return noh.objtest(obj, [
    'obj.clear()',
    'obj.test()',
    'for(var i = 0; i < 10; ++i) obj.test()'
  ]);
};

tests.fuzzy1 = function() {

  var number = fnum(50, 30);
  var obj = noh.fuzzytester(number);

  return noh.objtest(obj, [
    'obj.clear()',
    'obj.test()',
    'for(var i = 0; i < 10; ++i) obj.test()'
  ]);
};

tests.fuzzy2 = function() {

  var number = fnum(50, 30, 10);
  var obj = noh.fuzzytester(number);

  return noh.objtest(obj, [
    'obj.clear()',
    'obj.test()',
    'for(var i = 0; i < 10; ++i) obj.test()'
  ]);
};


tests.fuzzy3 = function() {

  var number = fnum(50, fnum(15));
  var obj = noh.fuzzytester(number);

  return noh.objtest(obj, [
    'obj.clear()',
    'obj.test()',
    'for(var i = 0; i < 10; ++i) obj.test()'
  ]);
};


tests.fuzzy4 = function() {

  var number = fnum(50, fnum(15, 5));
  var obj = noh.fuzzytester(number);

  return noh.objtest(obj, [
    'obj.clear()',
    'obj.test()',
    'for(var i = 0; i < 10; ++i) obj.test()'
  ]);
};




tests.fly = function() {

  var obj = noh.adiv(noh.fly(30, 30));

  return noh.objtest(obj, [
    'obj[0].start()',
    'obj[0].stop()',
    'obj[0].aim(220, 330, 40)'
  ]);
};


tests.flies = function() {

  var flies = [];
  for(var i = 0; i < 10; ++i)
    flies.push(noh.fly(500 + i * 3, 300 + i * 4, fnum(90, 30), fnum(0.3, 0.1), 300));
  var obj = noh.adiv(flies);

  return noh.objtest(obj, [
    'for(var i = 0; i < 5; ++i) obj[i].start()',
    'for(var i = 0; i < 5; ++i) obj[i].stop()',
    'for(var i = 5; i < 10; ++i) obj[i].start()',
    'for(var i = 5; i < 10; ++i) obj[i].stop()',
    'obj[0].stop()',
    'obj[0].aim(20, 30, 40)'
  ]);
};


tests.fly_click = function() {

  var obj = noh.div().size(400, 400);
  obj.$.on('click', function(ev) {
    var fly = noh.fly(ev.clientX, ev.clientY);
    obj.add(fly);
    fly.start();
  });

  return noh.objtest(obj, [
    'obj[0].start()',
    'obj[0].stop()',
    'obj[0].aim(220, 330, 40)'
  ]);
};








tests.tree1 = function() {

  var obj = noh.div(noh.tree(1, 10, 50).pos(200, 300))
    .css('position', 'relative')
    .css('width', '500px')
    .css('height', '400px');

  return noh.objtest(obj, [
    'obj.css("width", "100px")',
    'obj.css("width", "20px")',
    'obj.trans("rotate(0deg)")',
    'obj.trans("rotate(40deg)")',
    'obj.trans("rotate(80deg)")',
    'obj.trans("rotate(140deg)")',
    'obj.torig("0px 0px")',
    'obj.torig("30px 0px")',
    'obj.torig("30px 30px")'
  ]).addclass("smooth");
};

tests.tree2 = function() {

  var obj = noh.div(noh.tree(2, 10, 100).pos(200, 300))
    .css('position', 'relative')
    .css('width', '500px')
    .css('height', '400px');

  return noh.objtest(obj, [
    'obj.css("width", "100px")',
    'obj.css("width", "20px")',
    'obj.trans("rotate(0deg)")',
    'obj.trans("rotate(40deg)")',
    'obj.trans("rotate(80deg)")',
    'obj.trans("rotate(140deg)")',
    'obj.torig("0px 0px")',
    'obj.torig("30px 0px")',
    'obj.torig("30px 30px")'
  ]).addclass("smooth");
};

tests.tree3 = function() {

  var obj = noh.div(noh.tree(5, 9, 60).pos(200, 300))
    .css('position', 'relative')
    .css('width', '500px')
    .css('height', '400px');

  return noh.objtest(obj, [
    'obj.css("width", "100px")',
    'obj.css("width", "20px")',
    'obj.trans("rotate(0deg)")',
    'obj.trans("rotate(40deg)")',
    'obj.trans("rotate(80deg)")',
    'obj.trans("rotate(140deg)")',
    'obj.torig("0px 0px")',
    'obj.torig("30px 0px")',
    'obj.torig("30px 30px")'
  ]).addclass("smooth");
};

tests.tree4 = function() {

  var obj = noh.div(noh.tree(7, 12, 100).pos(200, 300))
    .css('position', 'relative')
    .css('width', '500px')
    .css('height', '400px');

  return noh.objtest(obj, [
    'obj.css("width", "100px")',
    'obj.css("width", "20px")',
    'obj.trans("rotate(0deg)")',
    'obj.trans("rotate(40deg)")',
    'obj.trans("rotate(80deg)")',
    'obj.trans("rotate(140deg)")',
    'obj.torig("0px 0px")',
    'obj.torig("30px 0px")',
    'obj.torig("30px 30px")'
  ]).addclass("smooth");
};


