
var prettydiv = function(var_args) {
    var an = noh.organize(arguments);
    return div({style:"margin: 25px; padding:15px; border: double"}, an.attrs, an.nodes);
};



var example = function() {
    return div(
        h1("Simple NOH example"),
        h4("(check the noh_example.js file)"),
        noh.p("TODO: add some styles, borders etc; add some function that acts as a kind of a template"),
        prettydiv(
            h3("Lets check out some table"),
            table(
                tr(
                    td("first cell in first row"),
                    td("second cell in first row"),
                    td("third cell in first row")
                ),
                tr(
                    td("first cell in second row"),
                    td("second cell in second row"),
                    td("third cell in second row")
                )
            )
        ),
        prettydiv(
            h3("Now lets check out some inputs"),
            input({type:"text"}),
            input({type:"button"}),
            input({type:"checkbox"}),
            input({type:"color"}),
            input({type:"date"}),
            input({type:"file"}),
            input({type:"radio"}),
            input({type:"time"}),
            input({type:"week"}),
            p("TODO: better inputs examples")
        )
    );
};


function init() {
    noh.init({hide:"fast", show:"fast", pollute:true});
    var root = document.getElementById('noh_example');
    var ex = example();
    ex.attachToDOM(root);
    $("td").css("border", "solid");
}

$(document).ready(init);

