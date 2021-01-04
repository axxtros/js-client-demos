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

const CONST_NAME: string = "John Connor";

var something: any;
var x: number = 0;
var text: string = "This is a text...";
var trueOrFalse: boolean = true;

var numberArray: number[] =  [0, 1, 2, 3];

enum VehicleTye {
  TRUCK,
  BUS,
  CAR
};

var vh:VehicleTye = VehicleTye.TRUCK;

function valami(num: number): string {
  console.log("This is a function! Number: " + num);
  return "Return string";
}

valami(10);

interface ITestInterface {
  name: string;
  age: number;
}

class TestClass {
  
  private name: string;
  private age: number;

  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }

  play(): void {
    console.log("Play! Name: " + this.name + " age: " + this.age);
  }

}

var tc = new TestClass("something", 35);
tc.play();

let message: string = 'Hello World';
console.log(message);