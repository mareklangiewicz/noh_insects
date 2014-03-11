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
  var tree1 = noh.tree(5, 9, 60).css('position', 'fixed').pos(200, $(window).height());
  var tree2 = noh.tree(5, 9, 60).css('position', 'fixed').pos(400, $(window).height());
  var tree3 = noh.tree(7, 12, 100).css('position', 'fixed').pos(600, $(window).height());
  var tree4 = noh.tree(7, 12, 100).css('position', 'fixed').pos(800, $(window).height());
  var tree5a = noh.tree(7, 12, 100).css('position', 'fixed').pos(1000, $(window).height());
  var tree5b = noh.tree(7, 12, 100).css('position', 'fixed').pos(1000, $(window).height());
  return noh.div(tree1, tree2, tree3, tree4, tree5a, tree5b);
};



