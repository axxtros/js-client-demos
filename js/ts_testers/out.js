"use strict";
define("other", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ViewModel = (function () {
        function ViewModel(constVar) {
            this.atest = constVar;
        }
        ;
        ViewModel.prototype.valami = function () {
            console.log("init...TS!");
        };
        return ViewModel;
    }());
    exports.ViewModel = ViewModel;
});
define("main", ["require", "exports", "other"], function (require, exports, other_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var test;
    var Main = (function () {
        function Main() {
            this.otherModel = new other_1.ViewModel("valami");
        }
        ;
        Main.prototype.start = function () {
            console.log('start....');
            this.otherModel.valami();
        };
        return Main;
    }());
    var main = new Main();
    var g = new other_1.ViewModel('aaaa');
    var g2 = new other_1.ViewModel('bbbb');
});
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
