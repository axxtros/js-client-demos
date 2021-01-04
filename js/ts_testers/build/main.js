define(["require", "exports", "./other"], function (require, exports, other_1) {
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
