// Decalre elements
const clear         = document.querySelector(".clear");
const data          = document.getElementById("date");
const list          = document.getElementById("list");
const input         = document.getElementById("input");
const inputTitle    = document.getElementById("title-input");
const titleName     = document.getElementById("title");


const CHECK         = "fa-check-circle";
const UNCHECK       = "fa-circle-thin";
const LINE_THROUGH  = "lineThrough";
const editMode      = "editMode"


const today     = new Date();
const options   = {month:"long", day:"numeric", year:"numeric"};

date.innerHTML  = today.toLocaleString("en-CA", options);

let LIST, id;


// === Add title function ===
function addTitle(name) {
    const appTitle = `${name}`;
    inputTitle.value = appTitle;
}


// === Add To Do function === 
/*  task => input, 
    id => order of array, 
    done => boolean, 
    trash => boolean 
*/

function addToDo(task, id, done, trash) {

    // check if to-do task is not in the trash
    // if to-do task is in trash then return which prevents the code below to run
    if(trash){
        return;
    }
    
    // if the to-do task is completed then CHECK else UNCHECK
    const DONE = done ? CHECK : UNCHECK;

    // if the to-do task is done then style it with a LINE through
    const LINE = done ? LINE_THROUGH : "";

    // Position each to-do task before the end of the element
    const position  = "beforeend";

    // create the to-do task
    const item      = `
    <li class="item editing" >
        <i class="fa ${DONE} complete" data-task="complete" id="${id}"></i>        
        <p>
        <input type="text" id="${id}" class="text editMode ${LINE}" placeholder="${task}" value="${task}">
        </p>
        <i class="fa fa-trash-o delete" data-task="delete" id="${id}"></i>
    </li>
    `;

    // element.insertAdjacentHTML(position, ToDoWeWantHere)
    list.insertAdjacentHTML(position, item);
}



// Add to-do task to list & title when the user hit enter key
document.addEventListener("keyup" , function(e) {
    if(e.key === "Enter") {
        const task       = input.value;
        const title      = inputTitle.value;        

        // if title is not empty then run addTitle(), then use localStorage
        if(title) {
            addTitle(title);          
            localStorage.setItem('titleKey', title);
        }

        inputTitle.value = title;
  
        // if to-do task is not empty then run addToDo()
        if(task) {
            
            // addToDo(task, id, done, trash)
            addToDo(task, id, false, false);

            // create the new to-do task as an object to the array
            LIST.push({
                name: task,
                id: id,
                done: false,
                trash: false,
                edit: false
            });
            
            // add new to-do task to local storage
            localStorage.setItem('ToDo', JSON.stringify(LIST));

            // increment the id
            id++;    
        }

        // Reset input 
        input.value = ''; 
    }
});


// === Complete to-do task function ===
function completeTask(e) {

    // The clicked to-do task will toggle check/uncheck 
    e.classList.toggle(CHECK);
    e.classList.toggle(UNCHECK);

    // If to-do task is done, then toggle LINE css style
    e.parentNode.querySelector(".text").classList.toggle(LINE_THROUGH);

    // If the to-do's "done" property changes true to false then disable input
    if(LIST[e.id].done == false){
        e.parentNode.querySelector('.text').disabled = true;
    } else {
        e.parentNode.querySelector('.text').removeAttribute('disabled');
        e.parentNode.querySelector('.text').focus();
    }
    
    //access the property done in list object
    //property we need to change is the done property
    // in order to toggle, if done is set to true, we need to set it to false
    // otherwise if false , we need to change it to true because of toggle

    LIST[e.id].done = LIST[e.id].done ? false : true;
}



// === Remove to-do task function ===
function removeTask(e) {

    // Remove ul element by going up parent node
    e.parentNode.parentNode.removeChild(e.parentNode);

    // Access to-do object and set trash to true 
    LIST[e.id].trash = true;
}



// === Edit Task Function ===
function editTask (e) {
    list.addEventListener('keyup', function(el){
        let itemToEdit = e.value;
        const itemEditId = e.id;
   
         if(el.key == "Enter"){
            if(itemToEdit){            

                // Find the to-do task by id in LIST and if the id's match then change LIST name to the new edit
                LIST.find( item => item.id == itemEditId).name = itemToEdit;

                // Set the new to-do task
                localStorage.setItem('ToDo', JSON.stringify(LIST));
    
            }
        };         
    })
}

// === Select the items in the list ===
list.addEventListener("click" , function(e) {
    
    //return clicked element inside list 
    const item      = e.target;
    const itemData  = item.dataset.task;

    // if the user clicked complete icon, the icon which contained the data-set 'complete' will then complete selected to-do task
    if(itemData == "complete") {
        completeTask(item);

    // if the user clicked delete icon, the icon which contained the data-set 'delete' will then delete selected to-do task
    }else if(itemData == "delete"){
        removeTask(item);
    }

    //Update local storage
    localStorage.setItem('ToDo', JSON.stringify(LIST));

    // When to-do task is clicked, run the edit function
    editTask(item); 

})


// Get to-do task from local storage
const storedTitle    = localStorage.getItem('titleKey');

// If the title is not empty then replace with the new value
if(storedTitle) {
    inputTitle.value = storedTitle;
}


const listArr     = localStorage.getItem('ToDo');

function displayList(arr) {
    arr.forEach(function(item){
        addToDo(item.name, item.id, item.done, item.trash);
    });
}

// If listArr is not empty
if(listArr) {

    // Get the list from localStorage
    LIST = JSON.parse(listArr);

    // Set the id to the LIST length, because need to see the id to the last id in the array
    id = LIST.length;

    // Load the list to the page
    displayList(LIST);

} else {
    // Create a LIST array and set the id to 0
    LIST = [];
    id = 0;
}

//clear local storage
clear.addEventListener("click", function() {
    localStorage.clear();
    location.reload();
})