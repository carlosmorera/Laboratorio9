var theObject = null;
var canvas = null;
var stompClient = null;
var ctx =null;
var x;
var y;


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
            
            ctx.beginPath();
            ctx.arc(theObject["x"], theObject["y"], 1, 0, 2 * Math.PI);
            ctx.stroke();
        });

        stompClient.subscribe('/topic/newpolygon', function (data) {
                       
            var puntos =  JSON.parse(data.body);;
            ctx.fillStyle = '#f00';
            ctx.beginPath();
            ctx.moveTo(puntos[0].x, puntos[0].y);
            ctx.lineTo(puntos[1].x, puntos[1].y);
            ctx.lineTo(puntos[2].x, puntos[2].y);
            ctx.lineTo(puntos[3].x, puntos[3].y);
            ctx.closePath();
            ctx.fill();
        });

    });
}




sendPoint = function () {
    stompClient.send("/app/newpoint", {}, JSON.stringify({x: x, y: y}));

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
            canvas = document.getElementById('myCanvas');
            ctx = canvas.getContext("2d");
            canvas.addEventListener('mousedown', function (evt) {
                var mousePos = getMousePos(canvas, evt);
                x = mousePos.x;
                y = mousePos.y;
                sendPoint();
                var message = 'Mouse position: ' + mousePos.x + ',' + mousePos.y;

            }, false);

        });
