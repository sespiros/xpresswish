function checkValid() {
    var valid = true;

    $("input").each(function(){
        if ($.trim($(this).val()).length == 0){
            $(this).addClass("highlight");
            valid = false;
        }
        else{
            $(this).removeClass("highlight");
        }
    });

    if (!valid) alert("Please fill in all the required fields (indicated by *)");

    return valid;
}

function createLink() {
    var msgText = $("#msg").val();

    url = "<p>" + window.location.href + "#!/card/" + btoa(msgText) + "</p>"

    $( "body" ).append(url)
}

function paint(canvas, msg) {
    var ctx = canvas.getContext("2d");
    ctx.font = "30px Arial";
    ctx.fillText(msg,10,50);
} 

// getElementById wrapper
function $id(id) {
    return document.getElementById(id);
  }
  
// asyncrhonously fetch the html template partial from the file directory,
// then set its contents to the html of the parent element
function loadHTML(url, id) {
    req = new XMLHttpRequest();
    req.open('GET', url);
    req.send();
    req.onload = () => {
        $id(id).innerHTML = req.responseText; 
        if (url.indexOf("canvas") != -1) {
        }
    }
}
  
// use #! to hash
router = new Navigo(null, true, '#!');
router.on(
// 'view' is the id of the div element inside which we render the HTML
'/card/:id', (params) => {
    $( "#view" ).load("canvas.html", function() {
        var canvas = document.getElementById("myCanvas");
        var msgb64 = window.location.hash.split('/')[2];
        var msgTxt = atob(msgb64);
        paint(canvas, msgTxt);
    });
});

// set the default route
router.on(() => { 
    $( "#view" ).load("main.html", function() {
        $("#msg").keyup(function(event) {
            if (event.keyCode === 13) {
                $("#btn").click();
            }
        });

        $( "button" ).click(function() {
            if (checkValid()) {
                createLink();
            }
        });
    });
});

// set the 404 route
router.notFound((query) => { $id('view').innerHTML = '<h3>Couldn\'t find the page you\'re looking for...</h3>'; });

router.resolve();