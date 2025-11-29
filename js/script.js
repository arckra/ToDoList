// Data structure to store todos
let todos = JSON.parse(localStorage.getItem('todos')) || [];
let currentFilter = 'all';

// DOM elements
const todoForm = document.getElementById('todoForm');
const todoInput = document.getElementById('todoInput');
const dateInput = document.getElementById('dateInput');
const todoList = document.getElementById('todoList');
const deleteAllBtn = document.getElementById('deleteAllBtn');
const filterBtns = document.querySelectorAll('.filter-btn');

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    renderTodos();
    
    // Set today's date as default
    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;
});

// Form submission handler
todoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const title = todoInput.value.trim();
    const date = dateInput.value;
    
    if (title === '') {
        alert('Please enter a task');
        return;
    }
    
    if (date === '') {
        alert('Please select a date');
        return;
    }
    
    // Create new todo object
    const newTodo = {
        id: Date.now(),
        title,
        date,
        completed: false
    };
    
    // Add to todos array
    todos.push(newTodo);
    
    // Save to localStorage
    saveTodos();
    
    // Clear form
    todoInput.value = '';
    
    // Re-render todos
    renderTodos();
});

// Delete all button handler
deleteAllBtn.addEventListener('click', () => {
    if (todos.length === 0) {
        alert('No tasks to delete');
        return;
    }
    
    if (confirm('Are you sure you want to delete all tasks?')) {
        todos = [];
        saveTodos();
        renderTodos();
    }
});

// Filter button handlers
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Update active filter button
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Set current filter
        currentFilter = btn.dataset.filter;
        
        // Re-render todos
        renderTodos();
    });
});

// Function to render todos based on current filter
function renderTodos() {
    // Clear current list
    todoList.innerHTML = '';
    
    // Filter todos based on current filter
    let filteredTodos = [];
    
    switch (currentFilter) {
        case 'pending':
            filteredTodos = todos.filter(todo => !todo.completed);
            break;
        case 'completed':
            filteredTodos = todos.filter(todo => todo.completed);
            break;
        default:
            filteredTodos = todos;
    }
    
    // Show empty message if no todos
    if (filteredTodos.length === 0) {
        const emptyMsg = document.createElement('div');
        emptyMsg.className = 'empty-message';
        emptyMsg.textContent = 'No task found';
        todoList.appendChild(emptyMsg);
        return;
    }
    
    // Render each todo
    filteredTodos.forEach(todo => {
        const todoItem = createTodoElement(todo);
        todoList.appendChild(todoItem);
    });
}

// Function to create a todo element
function createTodoElement(todo) {
    const todoItem = document.createElement('div');
    todoItem.className = `todo-item ${todo.completed ? 'completed' : ''}`;
    todoItem.dataset.id = todo.id;
    
    const formattedDate = formatDate(todo.date);
    
    todoItem.innerHTML = `
        <div class="todo-info">
            <div class="todo-title">${todo.title}</div>
            <div class="todo-date">${formattedDate}</div>
        </div>
        <div class="todo-actions">
            <button class="complete-btn">${todo.completed ? 'UNDO' : 'DONE'}</button>
            <button class="delete-btn">DELETE</button>
        </div>
    `;
    
    // Add event listeners to action buttons
    const completeBtn = todoItem.querySelector('.complete-btn');
    const deleteBtn = todoItem.querySelector('.delete-btn');
    
    completeBtn.addEventListener('click', () => toggleComplete(todo.id));
    deleteBtn.addEventListener('click', () => deleteTodo(todo.id));
    
    return todoItem;
}

// Function to toggle todo completion status
function toggleComplete(id) {
    todos = todos.map(todo => {
        if (todo.id === id) {
            return { ...todo, completed: !todo.completed };
        }
        return todo;
    });
    
    saveTodos();
    renderTodos();
}

// Function to delete a single todo
function deleteTodo(id) {
    if (confirm('Are you sure you want to delete this task?')) {
        todos = todos.filter(todo => todo.id !== id);
        saveTodos();
        renderTodos();
    }
}

// Function to save todos to localStorage
function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

// Function to format date from YYYY-MM-DD to MM/DD/YYYY
function formatDate(dateString) {
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    
    return `${month}/${day}/${year}`;
}