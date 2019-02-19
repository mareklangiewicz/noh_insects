// [ vim: set tabstop=2 shiftwidth=2 expandtab : ] 

/**                                           
 * @author marek.langiewicz@gmail.com (Marek Langiewicz)
 * @fileoverview
 * This file contains demo for the NOH Insects library
 */


var $ = require('jquery');
var noh = require('noh.js');
var insects = require('./noh_insects.js');

var forest = insects.forest;
var wind = insects.wind;


/**
 * This function will insert tree with all tests to DOM element with id="noh_insects_tests"
 * (if it finds one).If there is no such element, user can still insert it
 * wherever he wants, using noh_insects_tests() function by hand.
 */
function noh_insects_demo_init() {
  var container = $('#noh_insects_demo');
  if(container.length === 0)
    return;
  var demo = noh_insects_demo();
  demo.attachToDOM(container[0]);
}

$(noh_insects_demo_init);



function noh_insects_demo() {
  var refresh = noh.button("Refresh");
  var addbigtree = noh.button("Add a big tree");
  var demo_forest = forest();
  var demo = noh.div(
    noh.fancy(noh.h1("NOH Insects demo")),
    noh.p("Please check the ", noh.a({href: "noh_doc.html"}, "NOH library documentation"), " first."),
    noh.p("Please check ", noh.a({href: "noh_insects_tests.html"}, "NOH insects tests"), " too."),
    noh.p("Click somewhere to leave a fly on the screen :-)"),
    noh.p("TODO: implement some big spiders and other insects :-)"),
    noh.p(refresh),
    noh.p(addbigtree, noh.br(), '(fast browser needed)'),
    demo_forest
  );


  $(document).on('click', function(ev) {
    var fly = fly(ev.clientX, ev.clientY);
    demo.add(fly);
    fly.start();
  });


  refresh.on('click', function() {
    location.reload();
  });
  addbigtree.on('click', function() {
    demo_forest.addbigtree();
  });

  return demo;
}

wind.strength = fnum(2, 2, 2, true);




