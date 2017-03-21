var theObject= null;

var stompClient = null;

function connect() {
    var socket = new SockJS('/stompendpoint');
    function foo(){
       console.log('foo fue llamada!');
    }
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        console.log('Connected: ' + frame);
        stompClient.subscribe('/topic/newpoint', function (data) { 
          theObject=JSON.parse(data.body);
          callback(theObject);
        });
        
    });
}

function callback(theObject){
    alert("X:"+theObject["x"]+"Y:"+theObject["y"]);    
}


sendPoint = function () {
    stompClient.send("/topic/newpoint", {}, JSON.stringify({x:10,y:10}));
    
};


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

        }
);
