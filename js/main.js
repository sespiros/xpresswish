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

    url = window.location.href.split("#")[0] + "#!/1/" + btoa(encodeURIComponent(msgText));

    if (document.getElementById("link") === null){
        field = "<div class=\"buttons\"><input type=\"text\" id=\"link\" name=\"link\" class=\"default\"><a href=\"#\" id=\"btn2\" class=\"button\"><i class=\"fa fa-clipboard\" aria-hidden=\"true\"></i></a></div>"
        $( "#view" ).append(field)
    }
    document.getElementById( "link" ).value = url;
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
        var msgTxt = decodeURIComponent(atob(msgb64));
        paint(canvas, msgTxt);
        $( "#mini-logo" ).removeClass('hidden');
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

window.onload = function(){
	//canvas init
	var canvas = document.getElementById("snow");
    var ctx = canvas.getContext("2d");

	//canvas dimensions
	var W = window.innerWidth;
	var H = window.innerHeight;
	canvas.width = W;
    canvas.height = H;

	//snowflake particles
	var mp = 50; //max particles
	var particles = [];
	for(var i = 0; i < mp; i++)
	{
		particles.push({
			x: Math.random()*W, //x-coordinate
			y: Math.random()*H, //y-coordinate
			r: Math.random()*4+1, //radius
			d: Math.random()*mp //density
		})
	}
	
	//Lets draw the flakes
	function draw()
	{
		ctx.clearRect(0, 0, W, H);
		
		ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
		ctx.beginPath();
		for(var i = 0; i < mp; i++)
		{
			var p = particles[i];
			ctx.moveTo(p.x, p.y);
			ctx.arc(p.x, p.y, p.r, 0, Math.PI*2, true);
		}
		ctx.fill();
		update();
	}
	
	//Function to move the snowflakes
	//angle will be an ongoing incremental flag. Sin and Cos functions will be applied to it to create vertical and horizontal movements of the flakes
	var angle = 0;
	function update()
	{
		angle += 0.01;
		for(var i = 0; i < mp; i++)
		{
			var p = particles[i];
			//Updating X and Y coordinates
			//We will add 1 to the cos function to prevent negative values which will lead flakes to move upwards
			//Every particle has its own density which can be used to make the downward movement different for each flake
			//Lets make it more random by adding in the radius
			p.y += Math.cos(angle+p.d) + 1 + p.r/2;
			p.x += Math.sin(angle) * 2;
			
			//Sending flakes back from the top when it exits
			//Lets make it a bit more organic and let flakes enter from the left and right also.
			if(p.x > W+5 || p.x < -5 || p.y > H)
			{
				if(i%3 > 0) //66.67% of the flakes
				{
					particles[i] = {x: Math.random()*W, y: -10, r: p.r, d: p.d};
				}
				else
				{
					//If the flake is exitting from the right
					if(Math.sin(angle) > 0)
					{
						//Enter from the left
						particles[i] = {x: -5, y: Math.random()*H, r: p.r, d: p.d};
					}
					else
					{
						//Enter from the right
						particles[i] = {x: W+5, y: Math.random()*H, r: p.r, d: p.d};
					}
				}
			}
		}
	}
	
	//animation loop
	setInterval(draw, 33);
}