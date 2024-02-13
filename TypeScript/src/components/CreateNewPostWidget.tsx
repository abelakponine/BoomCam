import { MouseEventHandler, useEffect, useRef, useState } from "react";
import '../styles/boomCam.css';

const CreatNewPostWidget: (Func:{closeAction:MouseEventHandler<HTMLButtonElement>})=>JSX.Element = (Funcs)=>{
    
    function dataURLtoBlob(dataurl:string) {
        if (dataurl){
            var arr:any = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
                bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
            while(n--){
                u8arr[n] = bstr.charCodeAt(n);
            }
            return new Blob([u8arr], {type:mime});
        }
    }

    function getBase64Image(originalCanvas:HTMLCanvasElement) {
        // Create an empty canvas element
        var imageContentRaw = originalCanvas.getContext('2d')?.getImageData(0,0,550,900);
        // create new canvas
        var canvas = document.createElement('canvas');
        // with the correct size
        canvas.width = 550;
        canvas.height = 900;
        // put there raw image data
        // expected to be faster as tere are no scaling, etc
        canvas.getContext('2d')?.putImageData(imageContentRaw!, 0, 0);
        // get image data (encoded as bas64)
        return canvas.toDataURL("image/jpeg", 1.0)
    }

    // A function that accepts a mediastream element and draws the video on a canvas
    // The image on the canvas should display like object fit cover
    function drawVideoOnCanvas(mediastream: MediaStream, canvas: HTMLCanvasElement, video: HTMLVideoElement) {
        // Get the canvas context
        let ctx = canvas.getContext("2d");
    
        if (ctx) {
            // Set the canvas dimensions
            canvas.width = canvas.clientWidth * (1080 / canvas.clientWidth);
            canvas.height = canvas.clientHeight * (1080 / canvas.clientWidth);
            
            // Get the video dimensions
            let videoWidth = video.videoWidth;
            let videoHeight = video.videoHeight;
    
            // Calculate the scaling factor for both width and height
            let scaleX = canvas.width / videoWidth;
            let scaleY = canvas.height / videoHeight;
    
            // Choose the larger scaling factor to ensure centering
            let scale = Math.max(scaleX, scaleY);
            
            // Calculate the offset to center the video
            let offsetX = (canvas.width - videoWidth * scale) / 2;
            let offsetY = (canvas.height - videoHeight * scale) / 2;
    
            // Mirror the image horizontally
            ctx.translate(canvas.width, 0);
            ctx.scale(-1, 1);
            
            let stretchYtoFitHeight = (900 - canvas.clientHeight)*scale

            // smoothSkinFilter(ctx, videoWidth, videoHeight, .5)
            ctx.imageSmoothingEnabled = true
            ctx.imageSmoothingQuality = "medium"
            ctx.filter = "contrast(1) saturate(1)"

            // Draw the video on the canvas with centering
            ctx.drawImage(video, 0, 0, videoWidth, (videoHeight), offsetX, offsetY, (videoWidth * scale), (videoHeight * scale));
    
            // Reset transformations
            ctx.setTransform(1, 0, 0, 1, 0, 0);

        }
    }
    
    function smoothSkinFilter(ctx:CanvasRenderingContext2D, width:number, height:number, percentage:number) {
        // Get the pixel data from the canvas
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;
        
        // Apply a simple blur to the skin tones
        for (let i = 0; i < data.length; i += 4) {
            // Extract RGB values
            const red = data[i];
            const green = data[i + 1];
            const blue = data[i + 2];

            // Calculate luminance (brightness)
            const luminance = 0.299 * red + 0.587 * green + 0.114 * blue;

            // Check if the pixel is in the skin tone range (you may need to adjust these values)
            if (red > 60 && green > 40 && blue > 20 && red > green && red > blue && (red - green) > 15) {
                // Apply a simple blur by averaging neighboring pixels
                for (let j = i - 20; j < i + 20; j += 4) {
                    if (data[j] && data[j + 1] && data[j + 2]) {
                        // Apply smooth skin effect based on the percentage
                        const smoothLuminance = luminance + (255 - luminance) * percentage;
                        data[j] = data[j + 1] = data[j + 2] = smoothLuminance;
                    }
                }
            }
        }

        // Put the modified pixel data back on the canvas
        ctx.putImageData(imageData, 0, 0);
    }

    var postImageCapture = useRef<HTMLVideoElement|null>(null);
    var postImageCanvas = useRef<HTMLCanvasElement|null>(null);
    var captureImageBtn = useRef<HTMLButtonElement|null>(null);

    var GLOBAL:any = window;
    GLOBAL['streamState'] = false;

    useEffect(()=>{

        if (postImageCapture.current){

            const canvas = postImageCanvas.current!.getContext('2d');
            
            navigator.mediaDevices.getUserMedia({
                audio: false,
                video: true
            }).then((stream: MediaStream)=>{
                
                if (postImageCapture.current && 'srcObject' in postImageCapture.current){

                    const mediaRecorder = new MediaRecorder(stream)
                    
                    mediaRecorder.ondataavailable = (event)=>{
                        
                        if (canvas && GLOBAL['streamState'] !== 'paused'){
                            canvas.fillStyle = 'black';
                            canvas.fillRect(0, 0, 2252, 4000);

                            drawVideoOnCanvas(stream, postImageCanvas.current!, postImageCapture.current!)
                        }
                    }
                    
                    postImageCapture.current.srcObject = stream;

                    if (!GLOBAL['streamState'] && GLOBAL['streamState'] !== 'paused'){
                        mediaRecorder.start(0)
                    }

                    postImageCapture.current!.onloadeddata = ()=>postImageCapture.current?.play()

                    captureImageBtn.current!.onclick = (event)=>{

                        mediaRecorder.stop()
                        GLOBAL['streamState'] = 'paused'
                        postImageCanvas.current?.toBlob((blob:any)=>{
                            const newBlob = new Blob([blob], {type: 'image/png'})
                            
                            var a = new FileReader();
                            a.onload = (e)=> {console.log(e.target?.result);}
                            a.readAsDataURL(newBlob)

                        }, 'image/jpeg', .95)
                    }
                }
                else {
                    console.log(postImageCapture.current)
                }
            })
        }
    }, [postImageCapture, postImageCanvas, captureImageBtn, GLOBAL])

    return (
        <>
            <div id="create-new-post" className="flex-column w-100 shadow mx-auto px-4 overflow-hide">
                <div id="BoomCam" className="d-flex absolute left top w-100 h-100 z-index-1 bg-dark">

                    <video id="post-image-capture" src="" className="absolute top w-100 h-100 bg-dark z-index-1 d-none" autoPlay={false} ref={postImageCapture}></video>

                    <canvas id="post-image-canvas" className="d-flex relative m-auto w-100 h-100 bg-dark z-index-2" width={550} height={900} style={{
                        // objectFit:'cover',
                        // objectPosition: 'center',
                        // transform: 'scaleX(-1)'
                    }} ref={postImageCanvas}></canvas>

                    <div id="capture-mode" className="absolute z-index-3" style={{
                        transform: 'scale(.8) translateX(-50%)'
                    }}>
                        <button className="btn active">Photo Mode</button>
                        <button className="btn">Video Mode</button>
                    </div>
                    <div className="absolute z-index-3 w-100 bottom z-index-10">
                        <button id="upload-file-btn" style={{
                            background: 'transparent',
                            width: 50,
                            height: 50,
                            borderRadius: '50%',
                            margin: '0 3rem',
                            position: 'relative',
                            left: '0',
                            border: '2px solid #444444a5',
                            bottom: 50,
                            zIndex: 10
                        }}><i className="fas fa-images" style={{
                            fontSize: '1.8rem',
                            color: '#a4a4a4a5'
                        }}></i></button>

                        <button id="capture-image-btn" style={{
                            background: 'red',
                            width: 60,
                            height: 60,
                            borderRadius: '50%',
                            position: 'absolute',
                            transform: 'translateX(-50%)',
                            left: '50%',
                            border: '5px solid #000000bf',
                            bottom: 50,
                            zIndex: 10
                        }} ref={captureImageBtn}></button>

                        <button id="post-next-btn" className="d-flex py-2 px-4" style={{
                            background: 'transparent',
                            width: 'max-content',
                            height: 50,
                            margin: '0 3rem',
                            position: 'relative',
                            left: '0',
                            border: 0,
                            color: 'silver',
                            marginLeft: 'auto',
                            bottom: 58,
                            borderRadius: '5px',
                            zIndex: 10
                        }}><span>Next</span>&ensp;<i className="far fa-chevron-right" style={{
                            fontSize: '1.3rem',
                            color: 'silver'
                        }}></i></button>
                    </div>
                </div>
                <div className="d-flex w-100 my-4 py-2 z-index-2 w-100 relative">
                    <div className="avatar">
                        <img src={"/images/Abel.jpg"} alt="user icon"/>
                    </div>
                    <div className="my-0 mx-3 height-max-content">
                        <h1 className="mt-1 mb-1 text-light" style={{fontSize:"1.2rem", fontWeight:"bold"}}>Abel Akponine</h1>
                        <span className="text-theme me-2">@kingabel.a</span>
                        {/* <span className="text-secondary mx-2" style={{fontSize:14}}><i className="fas fa-globe-africa me-2"></i></span> */}
                    </div>
                    <div className="ms-auto me-2 d-flex flex-column">
                        <button className="btn close bg-none mb-5 rounded-circle text-white relative" onClick={Funcs.closeAction} style={{left:'3px'}}><i className="fal fa-close vertical-align-middle" style={{
                            fontSize: "2rem"
                        }}></i></button>

                        <button className="btn close bg-none rounded-circle text-white my-3" onClick={Funcs.closeAction}><i className="fas fa-camera-rotate vertical-align-middle" style={{
                            fontSize: "2rem"
                        }}></i></button>
                        <button className="btn close bg-none rounded-circle text-white my-3" onClick={Funcs.closeAction}><i className="fas  fa-wand-magic-sparkles vertical-align-middle" style={{
                            fontSize: "2rem"
                        }}></i></button>
                        <button className="btn close bg-none rounded-circle text-white my-3" onClick={Funcs.closeAction}><i className="far fa-crop-simple vertical-align-middle" style={{
                            fontSize: "2rem"
                        }}></i></button>
                        <button className="btn close bg-none rounded-circle text-white my-3" onClick={Funcs.closeAction}><i className="fal fa-undo vertical-align-middle" style={{
                            fontSize: "2rem"
                        }}></i></button>
                    </div>

                    <div id="add-sound" className="absolute">
                        <button className="btn text-white" style={{fontSize:'1rem'}}> <i className="fas fa-music"></i>&ensp;Add Sound</button>
                    </div>
                </div>
                <div className="w-100 my-4">
                    <textarea className="d-block w-100 rounded-lg p-3" style={{
                        minHeight: 180,
                        border:"1px solid #dadada",
                        fontSize: "1.8vw",
                        outline:"none",
                        resize: "none"
                    }} onInput={(event:any)=>{
                        let elem = event.target;

                        if (elem){
                            console.log(elem.value.length)
                            elem.style.fontSize = `max(calc(100% + .1vw), ${1.8 - (elem.value.length / 150)}vw)`;
                        }
                    }}></textarea>

                    <div className="my-3">
                        <button className="btn btn-secondary text-white w-100 p-3 my-1 border-0 rounded-lg"> <i className="fas fa-picture"></i> Add Media</button>
                        <button className="btn bg-theme text-white border-0 w-100 p-3 my-1 rounded-lg"> <i className="fas fa-globe-africa"></i> Publish</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CreatNewPostWidget;