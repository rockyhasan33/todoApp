const AddTaskBtn = document.getElementById('popUp');
const wrapper = document.querySelector('.wrapper');
const showEmptyList = document.querySelector('.show_empty');
const todosItemsContainer = document.querySelector('.todo_item_container');
const optionSelect = document.getElementById('options');


let isEditable = false;
let editElement;
let editID;
let isEdited = false;
let grabOptionValue;
let getOptionValue = 'all';

function setBackToDefault() {
    isEditable = false;
    editElement = null;
    editID = null;
    isEdited = false;
}

optionSelect.addEventListener('change', todoListChange);

function todoListChange(e) {
    
    if(this.value != undefined) {
        getOptionValue = this.value;
    }
    const getLocalStorageTodos = getLocalStorage();
    const todos = todosItemsContainer.querySelectorAll('.todo_item');
    todos.forEach(todo => {
        todo.remove();
    })
    

    getLocalStorageTodos.forEach(todo => {

        if(getOptionValue == 'all') {
            let item = setTodo(todo.title, todo.status, todo.time, todo.id);
            todosItemsContainer.appendChild(item);
        }
        if(getOptionValue == todo.status) {

            let item = setTodo(todo.title, todo.status, todo.time, todo.id);
            todosItemsContainer.appendChild(item);
        }

    })





    isListContainerEmpty()
}

AddTaskBtn.addEventListener('click', showFormPopUp);


function showFormPopUp() {
    
    const formWrapper = createForm();
    wrapper.appendChild(formWrapper);    
    const closeBtn = wrapper.querySelector('.close_btn');
    closeBtn.addEventListener('click', () => {
        closeForm(formWrapper);
    });
    // form submit 
    const form = wrapper.querySelector('.form');
    form.addEventListener('submit', formSubmit);
    // On Click Cancel Btn
    const cancelBtn = form.querySelector('.cancel_btn');
    cancelBtn.addEventListener('click', () => {
        closeForm(formWrapper);
    })
    

    
}

// add todo from localstorage 

function addTodoFromLocalStorage() {

    // title, status, time, id

    const allTodos = todosItemsContainer.querySelectorAll('.todo_item');
    
    allTodos.forEach(todo => {
        todo.remove();
    })
    const todos = getLocalStorage();
    let getAllItems = todos.map(todo => {
        return setTodo(todo.title, todo.status, todo.time, todo.id);
    })


    getAllItems.forEach(todo => {
        todosItemsContainer.appendChild(todo);
    })


}


// Create form 

function createForm(isEdited) {
    const formWrapper = createElement('div', 'wrapper_form'); 
    
    let element;
    element = `
        <div class="fit_center">
                        <form class="form">
                            <div tabindex="0" class="close_btn" id="closeBtn">
                                <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                    <path fill="none" d="M0 0h24v24H0V0z"></path>
                                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"></path>
                                </svg>
                            </div>
                            <h2>Add TODO</h2>
                            <label for="title">
                                Title
                                <input type="text" name="title" id="title" >
                            </label>
                            <label for="status">
                                Status
                                <select name="" id="status">
                                    <option value="incomplete">Incomplete</option>
                                    <option value="complete">Completed</option>
                                </select>
                            
                            </label>
                            <div class="form_btn_wrapper">
                                <button type="submit" class="add_btn">${isEdited ? 'Update' : 'Add'} Task</button>
                                <button type="button" class="cancel_btn">Cancel</button>
                            </div>
                        </form>
                    </div>
    `;

    formWrapper.innerHTML = element;
    return formWrapper;
}


// create element 
function createElement(tag, className) {
    let element = document.createElement(tag);
    element.className = className;
    return element;
}


// Close form section 
function closeForm(parentWrapper) {
    parentWrapper.remove();
}


// ========= Form Submited =========
function formSubmit(e) {

    e.preventDefault();

    // getting time from fucntion
    const time = getCurrTime();

    // getting getTime();
    const id = new Date().getTime().toString();
    const title = wrapper.querySelector('#title').value;
    const status = wrapper.querySelector('#status').value;

    let obj = {id, title, time, status};


    // Check if localStorage is empty
    if(getLocalStorage().length == 0) {
        localStorage.setItem("todoList", JSON.stringify([obj]));
    }else {
        let getLocalStorageData = getLocalStorage();
        localStorage.setItem("todoList", JSON.stringify([...getLocalStorageData,obj]));
    }

    addTodoFromLocalStorage();

    todoListChange();

    // check if todoList is empty 
    isListContainerEmpty();

    

    
    // Remove form section 
    const wrapperForm = wrapper.querySelector('.wrapper_form');
    wrapperForm.remove();

}

function setTodo(title, status, time, id) {
    const todoItemParent = createElement('div', "todo_item");
    todoItemParent.setAttribute('data-id', id);
    let element = 
                        `<div class="left">
                            <div class="checkbox_">
                                <input type="checkbox" ${status == 'complete' && 'checked'} name="" id="checkbox">
                            </div>
                            <div class="title_text">
                                <p class="text">${title}</p>
                                <div class="ydxyy">
                                    <div class="create_time">${time}</div>
                                </div>
                            </div>
                        </div>
                        <div class="right">
                            <button class="delete_btn">
                                <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                    <path fill="none" d="M0 0h24v24H0z"></path>
                                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path>
                                </svg>
                            </button>
                            <button class="edit_btn">
                                <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                    <path fill="none" d="M0 0h24v24H0z"></path>
                                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a.996.996 0 000-1.41l-2.34-2.34a.996.996 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"></path>
                                </svg>
                            </button>
                        </div>
    `;

    todoItemParent.innerHTML = element; 

    const editBtn = todoItemParent.querySelector('.edit_btn');
    const deleteBtn = todoItemParent.querySelector('.delete_btn');
    const checkClick = todoItemParent.querySelector('#checkbox');

    // EditBtn eventListener
    editBtn.addEventListener('click', editItem);
    // DeleteBtn EventListener
    deleteBtn.addEventListener('click', deleteItem);
    // checkbox 
    checkClick.addEventListener('change', clickOnCheckbox);

    return todoItemParent;
}


function getCurrTime() {
    let date = new Date();
    let hour = date.getHours();
    let minute = date.getMinutes();
    let day = date.getDate();
    let month = date.getMonth();
    let year = date.getFullYear();
    let time = `${hour > 12 ? hour % 12 : hour}:${minute > 9 ? minute : "0" + minute} ${hour >= 12 ? 'PM':'AM'}, ${day}/${month}/${year}`;
    return time;
}

// Check is List Contaienr is Empty 
function isListContainerEmpty() {
    
    let todos = todosItemsContainer.querySelectorAll('.todo_item');
    if(todos.length > 0) {
        showEmptyList.classList.add('hide');
    }else {
        showEmptyList.classList.remove('hide');
    }
}

// Delete Function

function deleteItem(e) {
    let element = e.currentTarget.parentElement.parentElement;
    element.remove();
    let id = e.currentTarget.parentElement.parentElement.getAttribute('data-id');
    let getItems = getLocalStorage();
    let GetFilterItem = getItems.filter(item => item.id != id);
    localStorage.setItem("todoList", JSON.stringify(GetFilterItem));
    isListContainerEmpty();
}


// Edit Todo
function editItem(e) {

    isEdited = true;
    let value = e.currentTarget.parentElement.previousElementSibling.lastElementChild.firstElementChild.textContent;

    editID = e.currentTarget.parentElement.parentElement.getAttribute('data-id');

    editElement = e.currentTarget.parentElement.previousElementSibling.lastElementChild.firstElementChild;

    // creating the form again
    const createEditForm = createForm(isEdited);
    wrapper.appendChild(createEditForm);
    const closeBtn = wrapper.querySelector('.close_btn');
    const grabInputField = createEditForm.querySelector('#title');
    grabInputField.value = value;

    // Close Btn
    closeBtn.addEventListener('click', () => {
        closeForm(createEditForm);
    });

    // Cancel Btn
    const cancelBtn = createEditForm.querySelector('.cancel_btn');
    cancelBtn.addEventListener('click', () => {
        closeForm(createEditForm);
    })
    // edit submit button
    const sumbitEditBtn = createEditForm.querySelector('.add_btn');
    sumbitEditBtn.addEventListener('click', editTodoSubmit);
    // select option container

    const selectOptions = createEditForm.querySelector('#status');
    grabOptionValue = selectOptions;
     
    

}

function clickOnCheckbox() {
    let id = this.parentElement.parentElement.parentElement.getAttribute('data-id');
    const getLocalStorageData = getLocalStorage();
    getLocalStorageData.forEach(todo => {
        if(todo.id == id) {
            todo.status = (this.checked) ? 'complete': 'incomplete';
        }
    })

    localStorage.setItem("todoList", JSON.stringify(getLocalStorageData));

    todoListChange();


    
}



// Get Data From LocalStorage
function getLocalStorage() {
    return localStorage.getItem("todoList") ? JSON.parse(localStorage.getItem("todoList")) : [];
}


// after edit todo then click on addTask

function editTodoSubmit(e) {
    e.preventDefault();
    let value = e.currentTarget.parentElement.previousElementSibling.previousElementSibling.firstElementChild.value;
    editElement.textContent = value;
    let getLocalStorageData = getLocalStorage();
    let getAllTodoItem = getLocalStorageData.map(todo => {
        if(todo.id == editID) {
            todo.title = value;
        }

        return todo;
    })

    localStorage.setItem("todoList", JSON.stringify(getAllTodoItem));
    const wrapperForm = wrapper.querySelector('.wrapper_form');
    wrapperForm.remove();
    setBackToDefault();
}

document.addEventListener("DOMContentLoaded", () => {
   
    let getLocalStorageData = getLocalStorage();
    let getTodosElement = getLocalStorageData.map(todo => {
        return setTodo(todo.title, todo.status, todo.time, todo.id, todo.isEdited);
    })

    getTodosElement.forEach(item => todosItemsContainer.appendChild(item));

    isListContainerEmpty();
})