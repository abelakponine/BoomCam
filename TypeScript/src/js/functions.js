import {FadeIn, FadeOut, SlideDown, SlideUp} from "./UIFX.js";

export const ShowActionMenu = (event)=>{
    event.stopPropagation();
    FadeIn(window.document.querySelector("#action-menu"), "block", 100, ".1s")
}
export const setWindowsViewport = ()=>{

    if (window.outerWidth > 1300){
        window.document.querySelector('meta[name=viewport]')?.setAttribute('content', 'width=1700, minimum-scale=0.1, user-scalable=yes');
    }
    else {
        window.document.querySelector('meta[name=viewport]')?.setAttribute('content', 'width=device-width, minimum-scale=0.1, user-scalable=no');
    }
}
export const GetImageColor = (elem)=>{
    let img = window.document.createElement("img");
    let canvas = window.document.createElement("canvas");
    img.src = elem.src;

    canvas.id = "myCanvas";
    window.document.body.prepend(canvas)

    img.onload = ()=>{
            let imgWidth = img.width
            let imgHeight = img.height;
    
            const c = canvas;
            c.width = imgWidth;
            c.height = imgHeight;
    
            const ctx = c.getContext("2d");
            ctx.drawImage(elem, 0, 0, imgWidth, imgHeight);
            let colorData = ctx.getImageData(40, 50, 20, 20).data;
            elem.previousElementSibling.style.backgroundColor = `rgb(${colorData[0]+20}, ${colorData[1]+20}, ${colorData[2]+20})`
            elem.previousElementSibling.style.backgroundImage = `url(${elem.src})`
            canvas.remove()

    }
}

export const hide_create_new_post = ()=>{
    SlideDown(window.document.querySelector("#create-new-post"), "none", 100, ".4s");
    FadeOut(window.document.querySelector("#overlayer"), "none", 100, ".4s");
    window.document.querySelector("#create-new-post textarea").value = "";
}

export const show_create_new_post = ()=>{
    FadeIn(window.document.querySelector("#overlayer"), "flex", 100, ".2s");
    SlideUp(window.document.querySelector("#create-new-post"), "flex", 100, ".2s");
}