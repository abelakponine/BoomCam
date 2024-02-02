export const FadeIn = (element, cssDisplayStyle="block", delay=1000, duration="3s")=>{
    element.style.opacity = 0;
    element.style.display = cssDisplayStyle;
    element.style.transitionDuration = duration;
    setTimeout(()=>{
        element.style.opacity = 1;
    }, delay);
}

export const FadeOut = (element, cssDisplayStyle="none", delay=1000, duration="3s")=>{
    element.style.transitionDuration = duration;
    element.style.opacity = 0;
    setTimeout(()=>{
        element.style.display = cssDisplayStyle;
    }, delay);
}

export const SlideUp = (element, cssDisplayStyle="block", delay=1000, duration=".8s")=>{
    element.style.opacity = 0;
    element.style.transform = "translate(0, 100%)";
    element.style.display = cssDisplayStyle;
    element.style.opacity = 1;
    setTimeout(()=>{
        element.style.transitionDuration = duration;
        element.style.transform = "translate(0, 0)";
    }, delay);
}

export const SlideDown = (element, cssDisplayStyle="none", delay=1000, duration=".8s")=>{
    element.style.transitionDuration = duration;
    element.style.transform = "translate(0, 100%)";
    setTimeout(()=>{
        element.style.opacity = 0;
        element.style.display = cssDisplayStyle;
    }, delay);
}

export const SlideLeftIn = (element, cssDisplayStyle="block", delay=1000, duration=".8s")=>{
    element.style.opacity = 0;
    element.style.transform = "translate(100%, 0)";
    element.style.display = cssDisplayStyle;
    element.style.transitionDuration = duration;
    setTimeout(()=>{
        element.style.opacity = 1;
        element.style.transform = "translate(0, 0)";
    }, delay);
}

export const SlideRightIn = (element, cssDisplayStyle="block", delay=1000, duration=".8s")=>{
    element.style.opacity = 0;
    element.style.transform = "translate(-100%, 0)";
    element.style.display = cssDisplayStyle;
    setTimeout(()=>{
        element.style.opacity = 1;
        element.style.transitionDuration = duration;
        element.style.transform = "translate(0,0)";
    }, delay);
}

export const SlideLeftOut = (element, cssDisplayStyle="block", delay=1000, duration=".8s")=>{
    element.style.transitionDuration = duration;
    element.style.transform = "translate(-100%, 0)";
    element.style.opacity = 0;
    setTimeout(()=>{
        element.style.display = cssDisplayStyle;
    }, delay);
}

export const SlideRightOut = (element, cssDisplayStyle="block", delay=1000, duration=".8s")=>{
    element.style.transitionDuration = duration;
    element.style.transform = "translate(100%, 0)";
    element.style.opacity = 0;
    setTimeout(()=>{
        element.style.display = cssDisplayStyle;
    }, delay);
}

export const SlideLeftFadeOut = (element, cssDisplayStyle="block", delay=1000, duration=".8s", translate="0,0")=>{
    element.style.display = cssDisplayStyle;
    element.style.transitionDuration = duration;
    element.style.transform = `translate(${translate})`;
    element.style.opacity = 0;
}

export const SlideRightFadeOut = (element, cssDisplayStyle="block", delay=1000, duration=".8s", translate="0,0")=>{
    element.style.display = cssDisplayStyle;
    element.style.transitionDuration = duration;
    element.style.transform = `translate(${translate})`;
    element.style.opacity = 0;
}

export const SlideLeftFadeIn = (element, cssVisibilityStyle="visible", delay=1000, duration=".8s", translate="0,0")=>{
    element.style.opacity = 0;
    element.style.display = "flex";
    element.style.visibility = cssVisibilityStyle;
    element.style.transitionDuration = duration;
    element.style.transform = "0s";
    setTimeout(()=>{
        element.style.transform = `translate(${translate})`;
        element.style.opacity = 1;
    }, delay);
}

export const SlideRightFadeIn = (element, cssVisibilityStyle="visible", delay=1000, duration=".8s", translate="0,0")=>{
    element.style.opacity = 0;
    element.style.display = "flex";
    element.style.transform = "translate(-100%, 0)";
    element.style.visibility = cssVisibilityStyle;
    element.style.transform = "0s";
    setTimeout(()=>{
        element.style.transform = `translate(${translate})`;
        element.style.opacity = 1;
    }, delay);
}