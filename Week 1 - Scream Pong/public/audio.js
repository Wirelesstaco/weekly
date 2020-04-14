let micAmp =0;

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
           // ctx.clearRect(0, 0, canvas.width, canvas.height);
            analyser.getByteTimeDomainData(dataArray);
            
            for(let i =0; i < 255; i++){
                ctx.beginPath();
                ctx.arc(i +c.width/2 -300, dataArray[i]*.6 +c.height - 150, 1, 0, 2 * Math.PI);
                ctx.stroke();
            }
             micAmp = Math.max(...dataArray);
            //console.log(micAmp);
           
           thrusting = (micAmp > micMin)?true:false;
            
           document.getElementById("micVol").innerHTML = micAmp;
            
            
            
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