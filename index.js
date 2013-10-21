
function init() {
    noh.init({hide:"slow", show:"fast", pollute:true});
    //noh.init({hide:"fast", show:"fast", pollute:true});
    var body = noh.div(noh_doc(), noh_tests());
    body.attachToDOM(document.body);
}


$(document).ready(init);
