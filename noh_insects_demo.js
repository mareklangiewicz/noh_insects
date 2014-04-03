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
function noh_insects_demo_init() {
  var container = $('#noh_insects_demo');
  if(container.length == 0)
    return;
  var demo = noh_insects_demo();
  demo.attachToDOM(container[0]);
}

$(document).ready(noh_insects_demo_init);



function noh_insects_demo() {
  var refresh = noh.button("Refresh");
  refresh.on('click', function() {
    location.reload();
  });
  var demo = noh.div(
    noh.fancy(noh.h1("NOH Insects demo")),
    noh.p("Please check the ", noh.a({href: "noh_doc.html"}, "NOH library documentation"), " first."),
    noh.p("Please check ", noh.a({href: "noh_insects_tests.html"}, "NOH insects tests"), " too."),
    noh.p("Click somewhere to leave a fly on the screen :-)"),
    noh.p("TODO: implement some big spiders and other insects :-)"),
    noh.p(refresh),
    noh.demo_trees()
  );

  $(document).on('click', function(ev) {
    var fly = noh.fly(ev.clientX, ev.clientY);
    demo.add(fly);
    fly.start();
  });

  return demo;
};


noh.demo_trees = function() {
  var trees = [];
  trees.push(noh.tree({ depth: 5, breadth: 1, spread: fnum(20, 15), trunkw:  8, trunkh:  60, trunkh_factor: fnum(0.82, 0.3) }).pos( 200, $(window).height()));
  trees.push(noh.tree({ depth: 5, breadth: 1, spread: fnum(20, 15), trunkw:  8, trunkh:  60, trunkh_factor: fnum(0.82, 0.3) }).pos( 400, $(window).height()));
  trees.push(noh.tree({ depth: 7, breadth: 1, spread: fnum(20, 15), trunkw: 12, trunkh: 100, trunkh_factor: fnum(0.82, 0.3) }).pos( 600, $(window).height()));
  trees.push(noh.tree({ depth: 7, breadth: 1, spread: fnum(20, 15), trunkw: 12, trunkh: 100, trunkh_factor: fnum(0.82, 0.3) }).pos( 800, $(window).height()));
  trees.push(noh.tree({ depth: 7, breadth: 1, spread: fnum(20, 15), trunkw: 12, trunkh: 100, trunkh_factor: fnum(0.82, 0.3) }).pos(1000, $(window).height()));
  trees.push(noh.tree({ depth: 7, breadth: 1, spread: fnum(20, 15), trunkw: 12, trunkh: 100, trunkh_factor: fnum(0.82, 0.3) }).pos(1000, $(window).height()));
  if(navigator.userAgent.indexOf("Chrome") != -1)
  trees.push(noh.tree({ depth:10, breadth: 1, spread: fnum(20, 15), trunkw: 34, trunkh: 140, trunkh_factor: fnum( 0.8, 0.2) }).pos(1300, $(window).height()));
  return noh.div(trees);
};



