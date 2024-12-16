document.addEventListener('DOMContentLoaded', loadTodos);

const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');

todoForm.addEventListener('submit', function(e) {
    e.preventDefault();
    addTodo(todoInput.value);
    todoInput.value = '';
});

function addTodo(todo) {
    const li = document.createElement('li');
    li.className = 'todo-item';
    li.draggable = true;

    const todoText = document.createElement('span');
    todoText.className = 'todo-text';
    todoText.textContent = todo;

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.classList.add('delete-btn');
    deleteBtn.onclick = () => removeTodo(todo, li);

    li.addEventListener('dragstart', dragStart);
    li.addEventListener('dragend', dragEnd);
    li.addEventListener('dragover', dragOver);
    li.addEventListener('drop', drop);

    li.appendChild(todoText);
    li.appendChild(deleteBtn);
    todoList.appendChild(li);
    saveTodoToLocalStorage(todo);
}

function dragStart(e) {
    e.target.classList.add('dragging');
}

function dragEnd(e) {
    e.target.classList.remove('dragging');
    saveOrderToLocalStorage();
}

function dragOver(e) {
    e.preventDefault();
    const draggingItem = document.querySelector('.dragging');
    const siblings = [...todoList.querySelectorAll('.todo-item:not(.dragging)')];

    const nextSibling = siblings.find(sibling => {
        const box = sibling.getBoundingClientRect();
        const offset = e.clientY - box.top - box.height / 2;
        return offset < 0;
    });

    siblings.forEach(sibling => sibling.classList.remove('drag-over'));

    if (nextSibling) {
        nextSibling.classList.add('drag-over');
    }

    todoList.insertBefore(draggingItem, nextSibling);
}

function drop(e) {
    e.preventDefault();
    document.querySelectorAll('.todo-item').forEach(item => {
        item.classList.remove('drag-over');
    });
}

function saveOrderToLocalStorage() {
    const todos = [];
    document.querySelectorAll('.todo-text').forEach(todoText => {
        todos.push(todoText.textContent);
    });
    localStorage.setItem('todos', JSON.stringify(todos));
}

function removeTodo(todo, listItem) {
    listItem.remove();
    saveOrderToLocalStorage();
}

function saveTodoToLocalStorage(todo) {
    let todos = getTodosFromLocalStorage();
    if (!todos.includes(todo)) {
        todos.push(todo);
        localStorage.setItem('todos', JSON.stringify(todos));
    }
}

function getTodosFromLocalStorage() {
    const todos = localStorage.getItem('todos');
    return todos ? JSON.parse(todos) : [];
}

function loadTodos() {
    const todos = getTodosFromLocalStorage();
    todos.forEach(todo => addTodo(todo));
}