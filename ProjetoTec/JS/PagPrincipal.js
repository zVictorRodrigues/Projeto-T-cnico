document.addEventListener('DOMContentLoaded', () => {
    const addTaskButtons = document.querySelectorAll('.add-task');
    const projectListItems = document.querySelectorAll('.project-list li');

    addTaskButtons.forEach(button => {
        button.addEventListener('click', () => {
            const taskText = prompt('Qual é a nova tarefa?');
            const project = document.querySelector('.project-list li.active').dataset.project;
            if (taskText) {
                const newTask = document.createElement('div');
                newTask.className = 'task-card';
                newTask.dataset.project = project;
                newTask.innerText = taskText;
                newTask.draggable = true;
                newTask.id = 'task' + Date.now(); // Assigning a unique id to each task
                newTask.addEventListener('dragstart', dragStart);
                newTask.addEventListener('click', () => openModal(newTask));
                button.before(newTask);
                saveNewTask(taskText, project); // Saving the new task
            }
        });
    });

    const tasks = document.querySelectorAll('.task-card');

    tasks.forEach(task => {
        task.draggable = true;
        task.addEventListener('dragstart', dragStart);
        task.addEventListener('click', () => openModal(task));
    });

    const columns = document.querySelectorAll('.column');

    columns.forEach(column => {
        column.addEventListener('dragover', dragOver);
        column.addEventListener('drop', drop);
    });

    projectListItems.forEach(item => {
        item.addEventListener('click', () => {
            projectListItems.forEach(item => item.classList.remove('active'));
            item.classList.add('active');
            filterTasks(item.dataset.project);
        });
    });

    document.getElementById('search-input').addEventListener('input', (e) => {
        const searchText = e.target.value.toLowerCase();
        const tasks = document.querySelectorAll('.task-card');
        tasks.forEach(task => {
            const taskTitle = task.innerText.toLowerCase();
            if (taskTitle.includes(searchText)) {
                task.style.display = 'block';
            } else {
                task.style.display = 'none';
            }
        });
    });

    // Load task details when modal is shown
    document.getElementById('task-modal').addEventListener('show.bs.modal', loadTaskDetails);

    // Save task details when "Save" button is clicked
    document.getElementById('task-form').addEventListener('submit', function(e) {
        e.preventDefault();
        saveTaskDetails();
    });

    // Create a new task when "Create" button is clicked
    document.querySelector('.add-task').addEventListener('click', () => {
        const taskText = prompt('Qual é a nova tarefa?');
        const project = document.querySelector('.project-list li.active').dataset.project;
        if (taskText) {
            saveNewTask(taskText, project);
            loadTasks(); // Reload tasks after adding a new one
        }
    });

    // Load tasks when the page is loaded
    loadTasks();
});

function dragStart(event) {
    event.dataTransfer.setData('text/plain', event.target.id);
    setTimeout(() => {
        event.target.classList.add('hidden');
    }, 0);
}

function dragOver(event) {
    event.preventDefault();
}

function drop(event) {
    event.preventDefault();
    const id = event.dataTransfer.getData('text/plain');
    const draggableElement = document.getElementById(id);
    const targetColumn = event.target.closest('.column');

    if (targetColumn) {
        draggableElement.classList.remove('hidden');
        targetColumn.appendChild(draggableElement);
    }
}

function openModal(taskElement) {
    const modal = document.getElementById('task-modal');
    const taskTitle = document.getElementById('task-title');
    const taskProject = document.getElementById('task-project');
    const taskDescription = document.getElementById('task-description');
    const startDate = document.getElementById('start-date');
    const endDate = document.getElementById('end-date');
    const taskUserInput = document.getElementById('task-user');

    taskTitle.value = taskElement.innerText;
    taskProject.value = taskElement.dataset.project;
    taskDescription.value = taskElement.dataset.description || '';
    startDate.value = taskElement.dataset.startDate || '';
    endDate.value = taskElement.dataset.endDate || '';
    taskUserInput.value = taskElement.dataset.user || '';

    modal.style.display = 'block';
}

function closeModal() {
    const modal = document.getElementById('task-modal');
    modal.style.display = 'none';
}

window.onclick = function(event) {
    const modal = document.getElementById('task-modal');
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}

// Function to filter tasks by project
function filterTasks(project) {
    const tasks = document.querySelectorAll('.task-card');
    tasks.forEach(task => {
        if (project === 'todos' || task.dataset.project === project) {
            task.style.display = 'block';
        } else {
            task.style.display = 'none';
        }
    });
}

// Load task details from Local Storage when modal is shown
function loadTaskDetails() {
    const taskDetailsString = localStorage.getItem('taskDetails');
    if (taskDetailsString) {
        const taskDetails = JSON.parse(taskDetailsString);
        const taskTitle = document.getElementById('task-title');
        const taskProject = document.getElementById('task-project');
        const taskDescription = document.getElementById('task-description');
        const startDate = document.getElementById('start-date');
        const endDate = document.getElementById('end-date');
        const taskUserInput = document.getElementById('task-user');

        taskTitle.value = taskDetails.title;
        taskProject.value = taskDetails.project;
        taskDescription.value = taskDetails.description || '';
        startDate.value = taskDetails.startDate || '';
        endDate.value = taskDetails.endDate || '';
        taskUserInput.value = taskDetails.user || '';
    }   
}

// Save task details to Local Storage
function saveTaskDetails() {
    const taskTitle = document.getElementById('task-title').value;
    const taskProject = document.getElementById('task-project').value;
    const taskDescription = document.getElementById('task-description').value;
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;
    const taskUserInput = document.getElementById('task-user').value;

    // Store task details in an object
    const taskDetails = {
        title: taskTitle,
        project: taskProject,
        description: taskDescription,
        startDate: startDate,
        endDate: endDate,
        user: taskUserInput
    };

    // Save task details to Local Storage
    localStorage.setItem('taskDetails', JSON.stringify(taskDetails));

    // Close the modal
    closeModal();
}

// Save a new task to Local Storage
function saveNewTask(taskText, project) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const newTask = {
        id: 'task' + Date.now(),
        text: taskText,
        project: project
    };
    tasks.push(newTask);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Load tasks from Local Storage
function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => {
        const newTask = document.createElement('div');
        newTask.className = 'task-card';
        newTask.dataset.project = task.project;
        newTask.innerText = task.text;
        newTask.draggable = true;
        newTask.id = task.id;
        newTask.addEventListener('dragstart', dragStart);
        newTask.addEventListener('click', () => openModal(newTask));
        document.querySelector('.add-task').before(newTask);
    });
}
