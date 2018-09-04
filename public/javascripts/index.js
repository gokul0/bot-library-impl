$(document).ready(function() {
    $.ajax("http://localhost:3000/api/getDocs", {
        success: function(data) {
           data.forEach(element => {
            $('#api-list')
            .append($('<option />', { value : element })
            .text(element));
           });
        },
        error: function() {
           console.error("error");
        }
     });
})
function initcall(){
    
}