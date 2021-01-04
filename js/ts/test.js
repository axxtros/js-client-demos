//typescript demo
//első lépésben a nodejs-t kell telepíteni, illetve a windows a path-ben hozzá kell adni az elérésekhez az npm managert: nodejs\npm.cmd
//C:\Users\Axtros\AppData\Roaming\npm\tsserver -> C:\Users\Axtros\AppData\Roaming\npm\node_modules\typescript\bin\tsserver
//C:\Users\Axtros\AppData\Roaming\npm\tsc -> C:\Users\Axtros\AppData\Roaming\npm\node_modules\typescript\bin\tsc
//Typescript telepítése VSCode alá, getting started
//https://code.visualstudio.com/docs/typescript/typescript-tutorial
//https://www.digitalocean.com/community/tutorials/how-to-work-with-typescript-in-visual-studio-code
//Powershell-es typescript fordítás engedélyezése:
//https://stackoverflow.com/questions/58796490/tsc-ps1-cannot-be-loaded-because-running-scripts-is-disabled-on-this-system
//run this in PowerShell command : 
//      enabled:                        Set-ExecutionPolicy RemoteSigned
//      back to its default value with: Set-ExecutionPolicy Restricted
//Typescript documentation
//https://www.typescriptlang.org/docs/handbook/basic-types.html
//fordítás:
//terminal-ban: tsc test.ts
//https://code.visualstudio.com/docs/typescript/typescript-compiling
//tsconfig.json létrehozása:
//tsc --init
//tsconfig.json hozzáadása a compiler-hez
//tsc --p tsconfig.json ( tsc --p <path ... tsconfig.json> )
//fordítsd így: (forrás: src könyvtár, js: build könyvtár)
//tsc --p tsconfig.json
//tsc --p ../tsconfig.json
//one file compile
//https://dirask.com/q/typescript-compile-all-ts-files-to-one-js-PpObZD
var CONST_NAME = "John Connor";
var something;
var x = 0;
var text = "This is a text...";
var trueOrFalse = true;
var numberArray = [0, 1, 2, 3];
var VehicleTye;
(function (VehicleTye) {
    VehicleTye[VehicleTye["TRUCK"] = 0] = "TRUCK";
    VehicleTye[VehicleTye["BUS"] = 1] = "BUS";
    VehicleTye[VehicleTye["CAR"] = 2] = "CAR";
})(VehicleTye || (VehicleTye = {}));
;
var vh = VehicleTye.TRUCK;
function valami(num) {
    console.log("This is a function! Number: " + num);
    return "Return string";
}
valami(10);
var TestClass = /** @class */ (function () {
    function TestClass(name, age) {
        this.name = name;
        this.age = age;
    }
    TestClass.prototype.play = function () {
        console.log("Play! Name: " + this.name + " age: " + this.age);
    };
    return TestClass;
}());
var tc = new TestClass("something", 35);
tc.play();
var message = 'Hello World';
console.log(message);
