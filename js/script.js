// SELEÇÃO DE ELEMENTOS
const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo-input");
const todoList = document.querySelector(".todo-list");
const editForm = document.querySelector("#edit-form");
const editInput = document.querySelector("#edit-input");
const cancelEditBtn = document.querySelector("#cancel-edit-btn");
const searchInput = document.querySelector("#search-input");
const erasedBtn = document.querySelector("#erased-button");
const filterBtn = document.querySelector("#filter-select");

let oldInputValue;


// FUNÇÕES
const saveTodo = (text, done = 0, save = 1) => {
    const todo = document.createElement("div");
    todo.classList.add("todo");

    const todoTitle = document.createElement("h3");
    todoTitle.innerHTML = text;
    todo.appendChild(todoTitle);

    const doneBtn = document.createElement("button");
    doneBtn.classList.add("finish-todo");
    doneBtn.innerHTML = `<i class="fa-solid fa-check"></i>`;
    todo.appendChild(doneBtn);

    const editBtn = document.createElement("button");
    editBtn.classList.add("edit-todo");
    editBtn.innerHTML = `<i class="fa-solid fa-pen"></i>`;
    todo.appendChild(editBtn);

    const removeBtn = document.createElement("button");
    removeBtn.classList.add("remove-todo");
    removeBtn.innerHTML = `<i class="fa-solid fa-xmark"></i>`;
    todo.appendChild(removeBtn);


    // DADOS NO LOCALSTORAGE
    if (done) {
        todo.classList.add("done");
    }

    if (save) {
        saveTodoLocal({text, done});
    }



    todoList.appendChild(todo);

    todoInput.value = "";
    todoInput.focus();
}



    const toggleForms = () => {
        editForm.classList.toggle("hide");
        todoForm.classList.toggle("hide");
        todoList.classList.toggle("hide");
    }
    


    const updateTodo = (text) => {
        const todos = document.querySelectorAll(".todo");

        todos.forEach((todo) => {
            let todoTitle = todo.querySelector("h3");

            if (todoTitle.innerText === oldInputValue) {
                todoTitle.innerText = text;

                updateTodoLocalStorage(oldInputValue, text);
            }
        })
    }
    

    const getSearchTodos = (search) => {
        const todos = document.querySelectorAll(".todo");

        todos.forEach((todo) => {
            let todoTitle = todo.querySelector("h3").innerText.toLowerCase();

            const normalizedSearch = search.toLowerCase();

            todo.style.display = "flex";

            if (!todoTitle.includes(normalizedSearch)) {
                todo.style.display = "none";
            }
        })
    }


    const filterTodos = (filterValue) => {
        const todos = document.querySelectorAll(".todo");

        switch(filterValue) {
            case "all":
            todos.forEach((todo) => todo.style.display = "flex")
            break;

             case "done":
            todos.forEach((todo) => 
            todo.classList.contains("done") 
            ? (todo.style.display = "flex") 
            : (todo.style.display = "none")
            )
             break;


             case "todo":
            todos.forEach((todo) => 
            !todo.classList.contains("done") 
            ? (todo.style.display = "flex") 
            : (todo.style.display = "none")
            )
            break;

            default:
            break;
        }
    }


// EVENTOS
todoForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const inputValue = todoInput.value;

    if(inputValue) {
        saveTodo(inputValue);
    }
})


document.addEventListener("click", (e) => {
    const targetEle = e.target;
    const parentEle = targetEle.closest("div");
    let todoTitle;

    if (parentEle && parentEle.querySelector("h3")) {
        todoTitle = parentEle.querySelector("h3").innerText;
    }

    if (targetEle.classList.contains("finish-todo")) {
        parentEle.classList.toggle("done");

        updateStatusTodo(todoTitle);
    }

    if (targetEle.classList.contains("remove-todo")) {
        parentEle.remove();

        removeTodoLocal(todoTitle);
    }

    if (targetEle.classList.contains("edit-todo")) {
        toggleForms();

        editInput.value = todoTitle;
        oldInputValue = todoTitle;
    }
})


cancelEditBtn.addEventListener("click", (e) => {
    e.preventDefault();
    toggleForms();
})

editForm.addEventListener("submit", (e) => {
    e.preventDefault(0);

    const editInputValue = editInput.value;

    if (editInputValue) {
        updateTodo(editInputValue);
    }

    toggleForms();
})

searchInput.addEventListener("keyup", (e) => {
    const search = e.target.value;

    getSearchTodos(search);
})


erasedBtn.addEventListener("click", (e) => {
    e.preventDefault();

    searchInput.value  = "";

    searchInput.dispatchEvent(new Event("keyup"));
})


filterBtn.addEventListener("change", (e) => {
    const filterValue = e.target.value;

    filterTodos(filterValue);
})



// LOCAL STORAGE
const getLocalStorage = () => {
    const todos = JSON.parse(localStorage.getItem("todos")) || [];

    return todos;
}

const saveTodoLocal = (todo) => {
    const todos = getLocalStorage();

    todos.push(todo);

    localStorage.setItem("todos", JSON.stringify(todos));
}

const loadTodos = () => {
    const todos = getLocalStorage();

    todos.forEach((todo) => {
        saveTodo(todo.text, todo.done, 0)
    })
}


const removeTodoLocal = (todoText) => {
    const todos = getLocalStorage();

    const filterTodos = todos.filter((todo) => todo.text !== todoText);

    localStorage.setItem("todos", JSON.stringify(filterTodos));
}


const updateStatusTodo = (todoText) => {
    const todos = getLocalStorage();

    todos.map ((todo) => {
        todo.text === todoText ? (todo.done = !todo.done) : null;
    })

    localStorage.setItem("todos", JSON.stringify(todos));
}

const updateTodoLocalStorage = (todoOldText, todoNewText) => {
    const todos = getLocalStorage();

    todos.map ((todo) => {
        todo.text === todoOldText ? (todo.text = todoNewText) : null;
    })

    localStorage.setItem("todos", JSON.stringify(todos));
}

loadTodos();