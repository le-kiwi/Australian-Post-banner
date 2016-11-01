"use strict";
class CLM {

    constructor(totalLoops){
        this.totalLoops = totalLoops;
        this.currentLoops = 0;
    }

    checkIfContinue(){
        this.currentLoops++;
        if(this.currentLoops === this.totalLoops)return false;
        return true;
    }

    animate(object, duration, properties){
        let animation = new CLMAnimation(object, duration, properties);
        animation.start();
    }

    resetStyles(array){
        let i = 0;
        let totalObjects = array.length;
        for(i;i<totalObjects;i++){
            let obj = array[i];
            obj.removeAttribute("style");
        }
    }

}

class CLMAnimation {

    constructor(object, duration, properties) {
        this.object = object;
        this.duration = duration;
        this.prop = properties;

        this.transformProps = ["rotate", "scaleX", "scaleY"];
        this.generalProps = ["top", "left", "right", "bottom", "width", "height", "opacity"];
    }

    start(){
        this.setConfig();
        this.applyProperties();
        this.checkEnd();
    }

    setConfig(){
        this.delay = 0;
        if(this.hasProp("delay"))this.delay = this.prop.delay;
        this.onComplete = null;
        if(this.hasProp("onComplete"))this.onComplete = this.prop.onComplete;
        this.onCompleteParams = null;
        if(this.hasProp("onCompleteParams"))this.onCompleteParams = this.prop.onCompleteParams;


    }

    applyProperties(){
        //Check if Object is an Array or just a plain object
        if (Object.prototype.toString.call(this.object) === '[object Array]') {
            let i = 0;
            let totalObjects = this.object.length;
            for(i;i<totalObjects;i++){
                let obj = this.object[i];
                this.addTransitionProperty(obj);
                this.modifyProperties(obj);
            }
        } else {
            this.addTransitionProperty(this.object);
            this.modifyProperties(this.object);
        }
    }

    checkEnd(){
        setTimeout(()=>{
            this.removeTransition();
            if(this.onComplete) {
                if (this.onCompleteParams) {
                    this.onComplete(this.onCompleteParams);
                } else {
                    this.onComplete();
                }
            }
        }, (this.delay+this.duration)*1000);

    }

    modifyProperties(object){
        for(let i = 0; i < this.generalProps.length; i++){
            let prop = this.generalProps[i];
            if(this.hasProp(prop))object.style[prop] = this.prop[prop];
        }
        let transform = "";
        for(let j = 0; j < this.generalProps.length; j++){
            let prop = this.transformProps[j];
            if(this.hasProp(prop))transform+=prop+"("+this.prop[prop]+") ";
        }
        if(transform.length > 0)this.applyTransform(object,transform);
    }

    applyTransform(object, transform){
        object.style.transform = transform;
        object.style.msTransform = transform;
        object.style.webkitTransform = transform;
    }

    addTransitionProperty(object){
        let ease = "linear";
        if(this.hasProp("ease"))ease = this.prop.ease;
        let transition = "all "+this.duration+"s "+ease+" "+this.delay+"s";
        object.style.transition = transition;
        object.style.mozTransition = transition;
        object.style.webkitTransition = transition;
        object.style.oTransition = transition;
    }

    removeTransition(){
        if (Object.prototype.toString.call(this.object) === '[object Array]') {
            let i = 0;
            let totalObjects = this.object.length;
            for(i;i<totalObjects;i++){
                this.clearTransition(this.object[i]);
            }
        } else {
            this.clearTransition(this.object);
        }
    }

    clearTransition(object){
        object.style.transition = "";
        object.style.mozTransition = "";
        object.style.webkitTransition = "";
        object.style.oTransition = "";
    }

    hasProp(property){
        if (this.prop.hasOwnProperty(property)) return true;
        return false;
    }

}

