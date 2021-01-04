"use strict";
var Standalone = (function () {
    function Standalone(name, age) {
        this.name = name;
        this.age = age;
    }
    Standalone.prototype.play = function () {
        console.log("PLAY!");
        console.log("name: " + this.name + " age: " + this.age);
    };
    return Standalone;
}());
var standalone = new Standalone("John", 40);
