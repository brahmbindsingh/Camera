let videoPlayer = document.querySelector("video");
let mediaRecorder;
let chunks = [];
let isRecording = false;
let recordBtn = document.querySelector("#record");

recordBtn.addEventListener("click",()=>{
    if(isRecording){
        mediaRecorder.stop();
        isRecording = false;
    }
    else{
        mediaRecorder.start();
        isRecording = true;
    }
})

let promiseToUseCamera = navigator.mediaDevices.getUserMedia({
    video: true,
    audio: false
});

promiseToUseCamera
    .then(function(mediaStream){

        videoPlayer.srcObject = mediaStream;
        mediaRecorder = new MediaRecorder(mediaStream);

        mediaRecorder.addEventListener("dataavailable",(e)=>{
            chunks.push(e.data);
        });

        mediaRecorder.addEventListener("stop",()=>{
            let blob = new Blob(chunks,{type: "video/mp4"});
            chunks = [];

            let link = URL.createObjectURL(blob);
            let anchor = document.createElement("a");
            anchor.href = link;
            anchor.download = "video.mp4";
            anchor.click();
        });

        
    })
    .catch(function(){
        console.log("denied");
    })