//Select elements

const clear         = document.querySelector(".clear");
const data          = document.getElementById("date");
const list          = document.getElementById("list");
const input         = document.getElementById("input");
const inputTitle    = document.getElementById("title-input");
const titleName     = document.getElementById("title");

const CHECK         = "fa-check-circle";
const UNCHECK       = "fa-circle-thin";
const LINE_THROUGH  = "lineThrough";

const today = new Date();
const options = {weekday: "long", month:"long", day:"numeric", year:"numeric"};

date.innerHTML  = today.toLocaleString("en-CA", options);

let LIST, id;

function addTitle(name) {
    const appTitle = `${name}`;
    inputTitle.placeholder = appTitle;
}

//add to do function task = input, id = order of array, done = boolean, trash = boolean

function addToDo(task, id, done, trash) {

    // check if item is not in trash
    // if item is in trash then return which prevents the code below to run
    if(trash){
        return;
    }

    //if the task is completed then check else uncheck
    const DONE = done ? CHECK : UNCHECK;
    const LINE = done ? LINE_THROUGH : "";

    const position  = "beforeend";
    const item      = `
    <li class="item">
        <i class="fa ${DONE} complete" data-task="complete" id="${id}"></i>
        <p class="text ${LINE}">${task}</p>
        <i class="fa fa-trash-o delete" data-task="delete" id="${id}"></i>
    </li>
    `;

    list.insertAdjacentHTML(position, item);
}


// add item to list when user hit enter key
document.addEventListener("keyup" , function(e) {
    if(e.key === "Enter") {
        const task  = input.value;
        const title = inputTitle.value;

        if(title) {
            addTitle(title);          
            localStorage.setItem('titleKey', title);
        }

        inputTitle.value = title;

        //if task input is not empty
        if(task) {
            addToDo(task, id, false, false);

            //create new task object in array
            LIST.push({
                name: task,
                id: id,
                done: false,
                trash: false
            });
            
            //add item to local storage
            localStorage.setItem('ToDo', JSON.stringify(LIST));

            id++;    
        }
        input.value = ''; 
    }
});

// complete task
function completeTask(e) {
    e.classList.toggle(CHECK);
    e.classList.toggle(UNCHECK);
    e.parentNode.querySelector(".text").classList.toggle(LINE_THROUGH);

    //access the property done in list object
    //property we need to change is the done property
    // in order to toggle, if done is set to true, we need to set it to false
    // otherwise if false , we need to change it to true because of toggle

    LIST[e.id].done = LIST[e.id].done ? false : true;
}


//remove task
function removeTask(e) {
    //remove ul element by going up parent node
    e.parentNode.parentNode.removeChild(e.parentNode);

    //access item object 
    LIST[e.id].trash = true;
}


//select items in the list
list.addEventListener("click" , function(e) {
   
    //return clicked element inside list 
    const item      = e.target;
    const itemData  = item.dataset.task;

    if(itemData == "complete") {
        completeTask(item);
    }else if(itemData == "delete"){
        removeTask(item);
    }

    //add item to local storage
    localStorage.setItem('ToDo', JSON.stringify(LIST));
})


//get item from local storage
const storedTitle    = localStorage.getItem('titleKey');

if(storedTitle) {
    inputTitle.value = storedTitle;
}


let listArr     = localStorage.getItem('ToDo');

function displayList(arr) {
    arr.forEach(function(item){
        addToDo(item.name, item.id, item.done, item.trash);
    });
}


if(listArr) {
    LIST = JSON.parse(listArr);
    id = LIST.length;
    displayList(LIST);

} else {
    LIST = [];
    id = 0;
}

//clear local storage

clear.addEventListener("click", function() {
    localStorage.clear();
    location.reload();
})