document.addEventListener("DOMContentLoaded", function () {
var uri = document.documentURI;
if(uri == 'http://localhost:4200/signup') {
    var element = document.getElementById("country-code");
    if(element)
       element.value = "91";  // default code is India(+91)
}
});

function autoFill() {
    var element = document.getElementById("country-select");
    var text = element.options[element.selectedIndex].value;
    document.getElementById("country-code").value = text;
}