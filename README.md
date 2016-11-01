# README #

## Made with CLM Gulp Banner Tool ##
Compresses CSS, JS and images to ensure lower file size for your banners.
Packages your banners by adding 3rd party tags automatically and easily controlling how many loops the creative does.
Requires knowledge with npm and gulp.
Version 1.1.1

## Latest Updates ##

    1.1.1
        *Added Task to Add Sizmek or Doubleclick tags to Swiffy banners
    1.1.0 (Not backwards compatible)
        *Cache busting for each build on local files so clients don't have cache issues. Live adds will not be forced to cache unless files are updated.
        *Folder detect automation. You no longer have to fill out the Array of folders as it will automatically search for them.
        *Animation class added.
        *Updated to how the loop code is initiated
        *Template hierarchy has been rearranged
    1.0.2
        *Automatically packages the files into a zip in a dispatch folder
        *Moves backup JPG or GIF if you have one in the root folder of the banner

    1.0.1
        *Added prompts to ask you questions questions when building rather then having separate gulp call
        *Dynamic looping added utilising the prompts. Requires updates to code on older versions and must use the Looping Code supplied to work
        *Appending names to folder option added in prompts. Eg. Input '_Loop' if you want people to know the banners loops.
        *gulp build-common added for those who want a quick looping and noLoop version made of the banners.

## What is this? ##
This is a tool to help create basic banners for HTML5. Designed to speed up the process of banners built with coded animation. Not suitable for banners built with Adobe Edge or Google Web Designer.
Banners must be built to the specifications of the tool to ensure they work.


## How to use? ##
Ensure package.json and 'npm install' node modules

## Folder Structure ##

Each folder should have a 'Standard' and 'Rich' folder to seperate the banner types.
In the standard folder there should be a folder called 'src' where the working files should be kept.
The src folder should have the following structure

    JOB####_JobName_Dimensions
        css/
        js/
        imgs/
        index.html
        backup.jpg/gif

When a gulp build is run it will create a new folder called 'build' with the compressed banners inside and another folder called 'dispatch' with zip files of the banners ready to send out*.
*Assuming the backup images where in the 'src' folder when built otherwise they need to be added in manually or it must be built with those files added.

## BUILDING ##

To compress the banners and add ad serving vendors tags use the following gulp commands. Files must be layed out like the templated index to work with build:css, build:js, build:init and build:publish in the correct locations and with the correct code inside each.

####gulp build####

    Options
        *Sizmek (s) or DoubleClick (d)
        *Total Loops (0 = infinite, default is 0)
        *Append Folders (String eg. _Looping)

    This copies what is in your src folder into a build folder compressing images, css, js. Then it will zip up the files and add the zips to dispatch ready to be sent out.

####gulp build-common####

    Options
        *Sizmek (s) or DoubleClick (d)

    This does the same as above however automatically creates a looping and noLooping version of each of the banners.

####gulp build-swiffy####

    Options
        *Sizmek (s) or DoubleClick (d)

    This just adds the tags for the publishers to a swiffy output file.

    NOTES - The loops will remain the same as the output. If you have a flash clicktag in the file when you output it in swiffy the added clicktags might fail. Make sure there is no code other then loop code in the outputted Flash SWF File.


## Helpful information ##

### Animation Class ###
The clm class has an animate function which allows you to animated banners easily.

clm.animate(object, seconds, properties);

object -    Array of display Objects or display Object

seconds -   Number in seconds. example. 1.5 is 1 and a half seconds.

propety -   Object

            Options
                *CSS Properties - top, left, right, bottom, width, height, opacity
                *CSS Transform Properties - rotate, scaleX, scaleY
                *onComplete - When the animation is complete this function will be called
                *onCompleteParams - When the onComplete is called this will be passed through as a variable
                *delay - Sets a delay in seconds of when the animation will run
                *ease - allows you to set the ease of the animation



examples -   clm.animate(document.getElementByID("clm-hero"), 1, {opacity: 0, onComplete: onHeroHidden});
            This example will get the clm-hero object and over 1 second animate it to opacity 0 and when it is complete it will run the function onHeroHidden()

            clm.animate(document.getElementsByClassName("clm-containers"), 0.5, {scaleX: 2, rotate: "20deg", onComplete: onContainerStretched, onCompleteParams: 20});
            This example will get the clm-hero object and over half a second animate it by stretching is on the x axis by double and rotate 20 degrees and when it is complete it will run the function onContainerStretched() which it will parse the function the number 20.

            clm.animate(document.getElementByID("clm-hero"), 1, {top: "20px", delay: 0.5});
            This example will get the clm-hero object and over 1 second animate after half a second has passed, then it will move it to 20px from the top of the container.

### Looping Code ###
To utilise the looping functionality you must add this check in the code ONLY ONCE when you need to see if the banner stops.

```
if(clm.checkIfContinue()){
    continue...
}
```

When implimented correctly you should be able to define the loops in the gulp build when the prompt asks you.

If you wish to update this post build, if you open up the index.html find the code line

var clm = new CLM(0);

then update the number in the brackets to the amount of loops. 0 is for infinite.


## How to update? ##
Check repository on bitbucket to see latest version.

https://bitbucket.org/clemengermelbourne/clems-html5-banner-template-tool/overview

## To Do ##
* Add BannerConfig.js where default builds can be set so you don't need to input the settings every time.
*Impliment SASS with Mixins where applicable

## Known Issues ##
* 


## Contribution guidelines ##

* Any bugs contact Luke Deylen

## Contributers ##
* Michael Jonathan - michael.jonathan@clemenger.com.au

## Contact ##
* Luke Deylen - luke.deylen@clemenger.com.au