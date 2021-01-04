
class Standalone {
  
  private name: string;
  private age: number;

  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }

  private play(): void {
    console.log("PLAY!");
    console.log("name: " + this.name + " age: " + this.age);
  }

}

var standalone = new Standalone("John", 40);