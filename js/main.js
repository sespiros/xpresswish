function checkValid() {
    var valid = true;

    $("#msg").each(function(){
        if ($.trim($(this).val()).length == 0){
            $(this).removeClass("default").addClass("highlight");
            valid = false;
        }
        else{
            $(this).removeClass("highlight").addClass("default");
        }
    });

    return valid;
}

function createLink() {
    var msgText = $("#msg").val();

    url = window.location.href.split("#")[0] + "#!/1/" + btoa(msgText)

    if (document.getElementById("link") === null){
        field = "<div class=\"buttons\"><input type=\"text\" id=\"link\" name=\"link\" class=\"default\"><a href=\"#\" id=\"btn2\" class=\"button2\"><i class=\"fa fa-clipboard\" aria-hidden=\"true\"></i></a></div>"
        $( "#view" ).append(field)
    }
    document.getElementById( "link" ).value = url
    document.getElementById( "link" ).focus();
    document.getElementById( "link" ).select();
    $( "#btn2" ).on("click", function() {
        document.execCommand('copy');
    });
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

var animations = {};
animations["1"] = "templates/fireworks/fireworks.html"
  
// use #! to hash
router = new Navigo(null, true, '#!');
router.on(
// 'view' is the id of the div element inside which we render the HTML
'/:id/:enc', (params) => {
    $( "#view" ).load(animations[params.id], function() {
        var canvas = document.getElementById("animCanvas");
        var msgb64 = window.location.hash.split('/')[2];
        var msgTxt = atob(msgb64);
        paint(canvas, msgTxt);
    });
});

// set the default route
router.on(() => { 
    $( "#view" ).load("main.html", function() {
        $( "#msg" ).keyup(function(event) {
            if (event.keyCode === 13) {
                $( "#btn" ).click();
            }
        });

        $( "#btn1" ).on("click", function() {
            if (checkValid()) {
                createLink();
            }
        });
    });
});

// set the 404 route
// router.notFound((query) => { $id('view').innerHTML = '<h3>Couldn\'t find the page you\'re looking for...</h3>'; });

router.resolve();