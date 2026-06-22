let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';

const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const emptyState = document.getElementById('emptyState');
const counter = document.getElementById('counter');
const clearBtn = document.getElementById('clearBtn');
const filterInputs = document.querySelectorAll('input[name="filter"]');

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTasks() {
    taskList.innerHTML = '';

    let filteredTasks = tasks;
    if (currentFilter === 'active') {
        filteredTasks = tasks.filter(t => !t.completed);
    } else if (currentFilter === 'completed') {
        filteredTasks = tasks.filter(t => t.completed);
    }

    emptyState.style.display = filteredTasks.length === 0 ? 'block' : 'none';

    filteredTasks.forEach(task => {
        const li = document.createElement('li');
        li.className = 'list-row w-full rounded-3xl border border-gray-300 items-center flex gap-3 p-3 cursor-pointer';

        li.innerHTML = `
            <input type="checkbox" data-id="${task.id}"
                    class="checkbox border-black rounded-full checkbox-sm task-checkbox"
                    ${task.completed ? 'checked' : ''} />
            <div class="flex-1 ${task.completed ? 'line-through opacity-50' : ''}">
                <div>${task.text}</div>
            </div>
            <button data-id="${task.id}"
                    class="btn btn-sm bg-transparent border border-transparent shadow-none task-delete">
                <i class="fa-solid fa-trash-can pointer-events-none"></i>
            </button>
        `;

        taskList.appendChild(li);
    });

    const remaining = tasks.filter(t => !t.completed).length;
    counter.textContent = `${remaining} task${remaining !== 1 ? 's' : ''} remaining`;
}

function addTask() {
    const text = taskInput.value.trim();
    if (text === '') return;

    tasks.push({
        id: Date.now(),
        text: text,
        completed: false
    });

    saveTasks();
    renderTasks();
    taskInput.value = '';
    taskInput.focus();
}

addBtn.addEventListener('click', addTask);

taskInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
        addTask();
    }
});

taskList.addEventListener('click', function (e) {
    const deleteBtn = e.target.closest('.task-delete');
    if (deleteBtn) {
        const id = Number(deleteBtn.dataset.id);
        tasks = tasks.filter(t => t.id !== id);
        saveTasks();
        renderTasks();
        return;
    }

    const li = e.target.closest('li');
    if (li) {
        const checkbox = li.querySelector('.task-checkbox');
        const id = Number(checkbox.dataset.id);
        const task = tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            saveTasks();
            renderTasks();
        }
    }
});

filterInputs.forEach(input => {
    input.addEventListener('change', function () {
        currentFilter = this.value;
        renderTasks();
    });
});

clearBtn.addEventListener('click', function () {
    tasks = tasks.filter(t => !t.completed);
    saveTasks();
    renderTasks();
});

renderTasks();