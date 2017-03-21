var theObject = null;
var canvas = null;
var x = 0;
var y = 0;


var stompClient = null;

function connect() {
    var socket = new SockJS('/stompendpoint');
    function foo() {
        console.log('foo fue llamada!');
    }
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        console.log('Connected: ' + frame);
        stompClient.subscribe('/topic/newpoint', function (data) {
            theObject = JSON.parse(data.body);
            callback(theObject);
        });

    });
}

function callback(theObject) {
    //alert("X:" + theObject["x"] + "Y:" + theObject["y"]);
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    ctx.beginPath();
    ctx.arc(theObject["x"], theObject["y"], 1, 0, 2 * Math.PI);
    ctx.stroke();
}


sendPoint = function () {
    stompClient.send("/topic/newpoint", {}, JSON.stringify({x: x, y: y}));

};
function getMousePos(canvas, evt) {
var rect = canvas.getBoundingClientRect();
        return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
        };
        
        }




function disconnect() {
    if (stompClient != null) {
        stompClient.disconnect();
    }
    setConnected(false);
    console.log("Disconnected");
}



$(document).ready(
        function () {
        connect();
        console.info('connecting to websockets');
        var canvas = document.getElementById('myCanvas');
        var context = canvas.getContext("2d");
        canvas.addEventListener('mousedown', function (evt) {     
            var mousePos = getMousePos(canvas, evt);
        
               x = mousePos.x;
               y = mousePos.y;
               sendPoint();
                var message = 'Mouse position: ' + mousePos.x + ',' + mousePos.y;
               
            }, false);

        });
