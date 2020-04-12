var c = document.getElementById("canvas");
var ctx = c.getContext("2d");
window.onload = function () {
     
    var soundAllowed = function (stream) {
        //Audio stops listening in FF without // window.persistAudioStream = stream;
        //https://bugzilla.mozilla.org/show_bug.cgi?id=965483
        //https://support.mozilla.org/en-US/questions/984179
        window.persistAudioStream = stream;

        var audioCtx = new AudioContext();
        var audioStream = audioCtx.createMediaStreamSource( stream );
        var analyser = audioCtx.createAnalyser();
        audioStream.connect(analyser);
        analyser.fftSize = 256;

        var dataArray  = new Uint8Array(analyser.fftSize);
        
    
        
        let loop = function () {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            analyser.getByteTimeDomainData(dataArray);
            
            for(let i =0; i < 255; i++){
                ctx.beginPath();
                ctx.arc(i*2, dataArray[i]*2, 1, 0, 2 * Math.PI);
                ctx.stroke();
            }
            console.log(Math.max(...dataArray));
            //console.log(dataArray);
            window.requestAnimationFrame(loop);
        }
        window.requestAnimationFrame(loop);
       
    }
    
  

    var soundNotAllowed = function (error) {
        h.innerHTML = "You must allow your microphone.";
        console.log(error);
    }

    /*window.navigator = window.navigator || {};
    /*navigator.getUserMedia =  navigator.getUserMedia       ||
                              navigator.webkitGetUserMedia ||
                              navigator.mozGetUserMedia    ||
                              null;*/
    navigator.getUserMedia({audio:true}, soundAllowed, soundNotAllowed);

};