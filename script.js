let videoPlayer = document.querySelector("video");
let mediaRecorder;
let chunks = [];
let isRecording = false;
let recordBtn = document.querySelector("#record");
let captureBtn = document.querySelector("#capture");
let body = document.querySelector("body");
let filter = "";

let allFilters = document.querySelectorAll(".filter");

for (let i = 0; i < allFilters.length; i++) {
  allFilters[i].addEventListener("click", function (e) {
    let previousFilter = document.querySelector(".filter-div");

    if (previousFilter) previousFilter.remove();

    let color = e.currentTarget.style.backgroundColor;
    filter = color;
    let div = document.createElement("div");
    div.classList.add("filter-div");
    div.style.backgroundColor = color;
    body.append(div);
  });
}

captureBtn.addEventListener("click",()=>{
    let innerSpan = captureBtn.querySelector("span");

    innerSpan.classList.add("capture-animation");
    setTimeout(function () {
        innerSpan.classList.remove("capture-animation");
    }, 1000);

    let canvas = document.createElement("canvas");
    canvas.width = videoPlayer.videoWidth;
    canvas.height = videoPlayer.videoHeight;

    let tool = canvas.getContext("2d");
    tool.drawImage(videoPlayer,0,0);
    if (filter != "") {
        tool.fillStyle = filter;
        tool.fillRect(0, 0, canvas.width, canvas.height);
    }
    let url = canvas.toDataURL();
    canvas.remove();
    // body.append(canvas);
    let anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "image.png";
    anchor.click();
    anchor.remove();
});

recordBtn.addEventListener("click",()=>{
    let innerSpan = recordBtn.querySelector("span");

    let previousFilter = document.querySelector(".filter-div");
    if (previousFilter) previousFilter.remove();
    filter = "";
    
    if(isRecording){
        mediaRecorder.stop();
        isRecording = false;
        innerSpan.classList.remove("record-animation");
    }
    else{
        mediaRecorder.start();
        isRecording = true;
        innerSpan.classList.add("record-animation");
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
            anchor.remove();
        });

        
    })
    .catch(function(){
        console.log("denied");
    })