// project.js - purpose and description here
// Author: Your Name
// Date:

// NOTE: This is how we might start a basic JavaaScript OOP project

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file

// define a class
class MyProjectClass {
  // constructor function
  constructor(param1, param2) {
    // set properties using 'this' keyword
    this.property1 = param1;
    this.property2 = param2;
  }
  
  // define a method
  myMethod() {
    // code to run when method is called
  }
}

function main() {
  const fillers = {
    introduce: ["Hello" , "Hi", "Sup", "G'day", "Good morning", "Good evening", "Greetings", "Salutations"],
    action: ["arrested after driving car into the ocean", 
             "impersonates security to get into Taylor Swift concert", 
             "had hours-long junk food feast inside closed Walgreens", 
             "takes on bizarre challenge of eating raw chicken every day", 
             "saves neighbor from jaws of 11-foot gator",
             "arrested after scaling cell tower",
             "leads deputies on chase in stolen ambulance"
            ],
    man: ["Man", "Woman", "Guy", "Boy", "Girl", "Dog", "Aligator", "Cat", "Hamster", "Shark"]
    
  };
  
  const template = `$introduce! Have you heard about Florida $man $action`;
  
  
  // STUDENTS: You don't need to edit code below this line.
  
  const slotPattern = /\$(\w+)/;
  
  function replacer(match, name) {
    let options = fillers[name];
    if (options) {
      return options[Math.floor(Math.random() * options.length)];
    } else {
      return `<UNKNOWN:${name}>`;
    }
  }
  
  function generate() {
    let story = template;
    while (story.match(slotPattern)) {
      story = story.replace(slotPattern, replacer);
    }
  
    /* global box */
    // box.innerText = story;
    $("#box").text(story);
    

  }
  
  /* global clicker */
  // clicker.onclick = generate;
  $("#clicker").click(generate);
  
  generate();
}

// let's get this party started - uncomment me
main();