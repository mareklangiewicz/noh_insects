// [ vim: set tabstop=2 shiftwidth=2 expandtab : ] 

/**                                           
 * @author marek.langiewicz@gmail.com (Marek Langiewicz)
 * @fileoverview
 * This file contains NOH library tests (written using NOH library itself)
 * You have to init NOH library with option: pollute:true, to use code from this file.
 * We use the {@link http://alexgorbatchev.com/SyntaxHighlighter/|SyntaxHighlighter} to show some source code on the page.
 */                                        



/**
 * Special div for tests. Contains strong border (double), big margin and big padding
 * The reason is to be clearly visible and distinguishable from other elements.
 * @param {...noh.AttrsAndNodes} as always..
 */
function tdiv(var_args) {
  return div({"class":"noh stest"}, arguments);
}



/** @typedef {function():noh.Node} */
noh.STest;

/** @typedef {!Object.<string,!noh.STest>} */
noh.STests;

/**
 * Takes a function f that creates any noh.Node (this function represents some simple test we want to run);
 * runs this f function; creates a special Node that displays the result, but also a source code of given function and html code of the result.
 * @param {function():noh.Node} f A function with simple test code.
 * @return {noh.Element} Pretty result of running given test.
 */
function runstest(f) {
  var node = f();
  return tdiv(
    ul(
      li(h4("Source code:"), tdiv(noh.srccode(f))),
      li(h4("Result:"), tdiv(node)),
      li(h4("Result source code (html):"), tdiv(noh.syntaxhl("html", node.dom.outerHTML || new XMLSerializer().serializeToString(node.dom))))
    )
  );
}


/**
 * Runs whole tests collection
 * @param {noh.STests} stests Collection of simple tests to run.
 * @return {noh.Element} Pretty tests results.
 */
function runstests(stests) {
  var testsres = [];
  for(var t in stests)
    testsres.push(dt(h3(t)), dd(runstest(stests[t])));
  var runtests = dl(testsres);
  runtests.$.find("ul, li").css("list-style", "disc inside"); //TODO: move styles to css file
  return runtests;
}


function noh_tests() {
  return div(
    h2("Simple tests"),
    runstests(tests)
  );
};



$(document).ready(function(){
  //TODO: move styes to css file (these too?)
  $("h1, h2, dt").css("color", "black");
  $("h2").css("font-size", "18px");
  $("h1, h2, dt").css("font-weight", "bold");
  $("h1, h2, dt").css("margin", "5px");
  $("dd").css("margin", "15px");
});




var tests = {};




tests.h16 = function() {
  return div(
    h1("Some h1 text"),
    h2("Some h2 text"),
    h3("Some h3 text"),
    h4("Some h4 text"),
    h5("Some h5 text"),
    h6("Some h6 text")
  );
};

tests.h16_hack = function() {
  var arr = [];
  for(var i = 1; i < 7; ++i)
    arr.push(noh["h"+i]("Some h"+i+" text"));
  return div(arr);
};


tests.srccode = function() {
  return noh.srccode(tests.srccode);
};


tests.blind = function() {
  var blind = noh.blind(
    div({style:"color: blue; font-size: xx-large"}, "blind BLEBLE", br(), "BLUBLU")
  );
  var style = {"class":"noh link", style:"padding: 5px"};
  var rolldown = a(style, "blind.roll(true)");
  var rollup = a(style, "blind.roll(false)");
  var down = a(style, "alert(blind.down())");
  rolldown.$.click(function() {blind.roll(true)});
  rollup.$.click(function() {blind.roll(false)});
  down.$.click(function() {alert(blind.down())});
  return div(
    rolldown,
    rollup,
    down,
    noh.table1r({style:"border: 6px ridge green"},
      td(blind)
    )
  );
};


tests.oneof = function() {
  var oneof = noh.oneof(
    div({style:"font-style: italic; color: green; font-size: xx-large"}, "BLABLA"),
    div({style:"color: blue; font-size: xx-large"}, "BLEBLE", br(), "BLUBLU"),
    div({style:"color: red; font-size: xx-large"}, "BLIBLI", br(), br(), "BLZBLZ")
  );
  oneof.select(0);
  var style = {"class":"noh link", style:"padding: 5px"};
  var next = a(style, "oneof.next()");
  var prev = a(style, "oneof.prev()");
  var select1 = a(style, "oneof.select(1)");
  var select_1 = a(style, "oneof.select(-1)");
  next.$.click(function() {oneof.next()});
  prev.$.click(function() {oneof.prev()});
  select1.$.click(function() {oneof.select(1)});
  select_1.$.click(function() {oneof.select(-1)});
  return div(
    next,
    prev,
    select1,
    select_1,
    noh.table1r({style:"border: 6px ridge green"},
      td(oneof)
    )
  );
};

tests.details = function() {
  var bigstyle = {style:"color: brown; font-size: x-large; width: 400px;"};
  return div(
    span(bigstyle, "BASIC INFO"),
    noh.details(
      div(
        div(bigstyle, "bjkalb DETAILS"),
        div(bigstyle, "fjdsklfsd   DETAILS"),
        div("fjdsklf jksfl dsjlf djksdfl DETAILS")
      )
    )
  );
};

