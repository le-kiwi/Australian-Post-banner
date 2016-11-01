//SET VARIABLES
var banner;

var logo;
var logoText;

var text01;
var text02;
var text03;
var text04;

var imageContainer;
var find;
var the;
var perfect;
var fit;

var parcelContainer;
var parcel;
var parcelOpen;

var cta;
var timeline;




window.onload = function(e) {
    //DECLARE VARIABLES
    banner = document.getElementById("clm-banner");

    logo = document.getElementById("logo");
    logoText = document.getElementById("logo-text");

    text01 = document.getElementById("text01");
    text02 = document.getElementById("text02");
    text03 = document.getElementById("text03");
    text04 = document.getElementById("text04");

    imageContainer = document.getElementById("image-container");
    find = document.getElementById("find");
    the = document.getElementById("the");
    perfect = document.getElementById("perfect");
    fit = document.getElementById("fit");

    parcelContainer = document.getElementById("parcel-container");
    parcel = document.getElementById("parcel");
    parcelOpen = document.getElementById("parcel-open");

    cta = document.getElementById("cta");

    addEventListeners();
    createMasterTimeline();
    checkInit();
}

function addEventListeners(){
    banner.onclick = triggerClickthrough;

}

function startAnimation(){
    //Show Ad
    banner.style.opacity = 1;
    frame1();
}

function restartBanner() {
    timeline.restart();
}

function frame1(){
   var tl = new TimelineMax();
   // fadein text
   tl.from(perfect, 0.5, {top:"+=300", ease:Power3.easeOut}, "-=0.3")
   .from(find, 0.6, {left:"-=350", ease:Power1.easeOut}, "-=0.3")
   .from(the, 0.7, {left:"+=300", ease:Power2.easeOut}, "-=0.1")
   .from(fit, 0.8, {top:"+=350", ease:Power3.easeOut}, "-=0.3")
   .set({},{}, "+=0.3" )
   // top of parcel shows from bottom, hold
   .add("parcelIn")
   .from(parcelContainer, 0.8, {scaleX:0.3, scaleY:0.3, ease:Back.easeOut}, "parcelIn")
   .to(parcelContainer, 0.5, {top:150}, "parcelIn")
   .set({},{}, "+=0.5")
   return tl;

}

function frame2(){
    
    var tl = new TimelineMax();
    // move parcel up and clip text
    tl.add("intro")
    .to(parcelContainer, 0.7, {top:0, ease:Power1.easeOut}, "intro")
    .fromTo(imageContainer, 1.5, { clip:"rect(0px 300px 250px 0px)" }, { clip:"rect(0px 300px 0px 0px)" },"-=1")
    .to(parcelOpen, 0.3, {height:0}, "-=1")
    .set({},{}, "+=0.3")
    return tl;
}

function frame3(){
    
    var tl = new TimelineMax();
    // fadeIn text01 & 02 and parcel leaves stage
    tl.to(parcelContainer, 0.6, {left:300, ease:Back.easeIn})
    .add("intro", "-=0.2")
    .to(text01, 0.6, {autoAlpha:1}, "intro")
    .to(text02, 0.6, {autoAlpha:1}, "intro")
    
    .to(banner, 0.6, {css:{backgroundColor:'#fed60a'}}, "intro")
    .from(logo, 0.6, {autoAlpha:0, top:"-=30", ease:Power1.easeOut})
    .set({},{}, "+=2.3")
    //text 01 fades out | text02 leaves left
    .add("introOut")
    .to(text01, 0.6, {autoAlpha:0}, "introOut")
    .to(text02, 0.6, {left:300, ease:Back.easeIn}, "introOut")

    return tl;
}

function frame4(){

    var tl = new TimelineMax();
    tl.add("intro")
    .to(text03, 0.6, {autoAlpha:1}, "intro")
    .from(text04, 0.6, {left:-300, ease:Power1.easeOut}, "-=0.3")
    .set({}, {}, "+=0.5")
    .add("cta")
    .to(cta, 0.6, {autoAlpha:1}, "cta")    
    .set({}, {}, "+=2.5")
     //USE THIS IF STATEMENT TO CHECK IF THE BANNER NEEDS TO STOP LOOPING OR CONTINUE
    if(clm.checkIfContinue()){
        tl.add("introOut")
        .to(logo, 0.3, { autoAlpha:0 }, "introOut")
        .to(cta, 0.3, {autoAlpha:0}, "introOut")
        .to(text03, 0.3, {autoAlpha:0}, "introOut")
        .to(text04, 0.3, {autoAlpha:0}, "introOut")
        .to(banner, 0.4, {css:{backgroundColor:'#e2dfda'}, onComplete:restartBanner}, "introOut")
    }
    return tl;
}

function resetStyles(array){
    for(var i=0;i<array.length; i++){
        array[i].removeAttribute("style");
    }
}

function createMasterTimeline() {

  timeline = new TimelineMax();
    timeline.add(frame1(), "0.3") // add the first animation at a time of 0.3 seconds
    .add(frame2())
    .add(frame3())
    .add(frame4());
  timeline.timeScale(1) // put a 4 in there, I dare you ;)
  console.log(timeline.duration()+" timeline duration");
}