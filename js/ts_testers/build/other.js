define(["require", "exports"], function (require, exports) {
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
