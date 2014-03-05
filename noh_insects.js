// [ vim: set tabstop=2 shiftwidth=2 expandtab : ] 

/**                                           
 * @author marek.langiewicz@gmail.com (Marek Langiewicz)
 * @fileoverview
 * This file contains main code for the NOH Insects library
 */



/**
 * This function will insert tree with all tests to DOM element with id="noh_tests"
 * (if it finds one).If there is no such element, user can still insert it
 * wherever he wants, using noh_tests() function by hand.
 */
function noh_insects_init() {
  var container = $('#noh_insects');
  if(container.length == 0)
    return;
  var tests = noh_insects();
  tests.attachToDOM(container[0]);
}

$(document).ready(noh_insects_init);



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

function noh_insects() {
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



