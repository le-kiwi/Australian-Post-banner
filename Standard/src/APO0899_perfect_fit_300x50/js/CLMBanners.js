"use strict";

//Please refer to ES6 version in the lib folder to make changes to this class.

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CLM = (function () {
    function CLM(totalLoops) {
        _classCallCheck(this, CLM);

        this.totalLoops = totalLoops;
        this.currentLoops = 0;
    }

    _createClass(CLM, [{
        key: "checkIfContinue",
        value: function checkIfContinue() {
            this.currentLoops++;
            if (this.currentLoops === this.totalLoops) return false;
            return true;
        }
    }, {
        key: "animate",
        value: function animate(object, duration, properties) {
            var animation = new CLMAnimation(object, duration, properties);
            animation.start();
        }
    }]);

    return CLM;
})();

var CLMAnimation = (function () {
    function CLMAnimation(object, duration, properties) {
        _classCallCheck(this, CLMAnimation);

        this.object = object;
        this.duration = duration;
        this.prop = properties;

        this.transformProps = ["rotate", "scaleX", "scaleY"];
        this.generalProps = ["top", "left", "right", "bottom", "width", "height", "opacity"];
    }

    _createClass(CLMAnimation, [{
        key: "start",
        value: function start() {
            this.setConfig();
            this.applyProperties();
            this.checkEnd();
        }
    }, {
        key: "setConfig",
        value: function setConfig() {
            this.delay = 0;
            if (this.hasProp("delay")) this.delay = this.prop.delay;
            this.onComplete = null;
            if (this.hasProp("onComplete")) this.onComplete = this.prop.onComplete;
            this.onCompleteParams = null;
            if (this.hasProp("onCompleteParams")) this.onCompleteParams = this.prop.onCompleteParams;
        }
    }, {
        key: "applyProperties",
        value: function applyProperties() {
            if (Object.prototype.toString.call(this.object) === '[object Array]') {
                var i = 0;
                var totalObjects = this.object.length;
                for (i; i < totalObjects; i++) {
                    var obj = this.object[i];
                    this.addTransitionProperty(obj);
                    this.modifyProperties(obj);
                }
            } else {
                this.addTransitionProperty(this.object);
                this.modifyProperties(this.object);
            }
        }
    }, {
        key: "checkEnd",
        value: function checkEnd() {
            var _this = this;

            setTimeout(function () {
                _this.removeTransition();
                if (_this.onComplete) {
                    if (_this.onCompleteParams) {
                        _this.onComplete(_this.onCompleteParams);
                    } else {
                        _this.onComplete();
                    }
                }
            }, (this.delay + this.duration) * 1000);
        }
    }, {
        key: "modifyProperties",
        value: function modifyProperties(object) {
            for (var i = 0; i < this.generalProps.length; i++) {
                var prop = this.generalProps[i];
                if (this.hasProp(prop)) object.style[prop] = this.prop[prop];
            }
            var transform = "";
            for (var j = 0; j < this.generalProps.length; j++) {
                var prop = this.transformProps[j];
                if (this.hasProp(prop)) transform += prop + "(" + this.prop[prop] + ") ";
            }
            if (transform.length > 0) this.applyTransform(object, transform);
        }
    }, {
        key: "applyTransform",
        value: function applyTransform(object, transform) {
            object.style.transform = transform;
            object.style.msTransform = transform;
            object.style.webkitTransform = transform;
        }
    }, {
        key: "addTransitionProperty",
        value: function addTransitionProperty(object) {
            var ease = "linear";
            if (this.hasProp("ease")) ease = this.prop.ease;
            var transition = "all " + this.duration + "s " + ease + " " + this.delay + "s";
            object.style.transition = transition;
            object.style.mozTransition = transition;
            object.style.webkitTransition = transition;
            object.style.oTransition = transition;
        }
    }, {
        key: "removeTransition",
        value: function removeTransition() {
            if (Object.prototype.toString.call(this.object) === '[object Array]') {
                var i = 0;
                var totalObjects = this.object.length;
                for (i; i < totalObjects; i++) {
                    this.clearTransition(this.object[i]);
                }
            } else {
                this.clearTransition(this.object);
            }
        }
    }, {
        key: "clearTransition",
        value: function clearTransition(object) {
            object.style.transition = "";
            object.style.mozTransition = "";
            object.style.webkitTransition = "";
            object.style.oTransition = "";
        }
    }, {
        key: "hasProp",
        value: function hasProp(property) {
            if (this.prop.hasOwnProperty(property)) return true;
            return false;
        }
    }]);

    return CLMAnimation;
})();