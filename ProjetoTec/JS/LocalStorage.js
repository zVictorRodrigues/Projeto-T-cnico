// Função para salvar os detalhes da tarefa no Local Storage
function saveTaskDetails() {
    const taskTitle = document.getElementById('task-title').value;
    const taskProject = document.getElementById('task-project').value;
    const taskDescription = document.getElementById('task-description').value;
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;
    const taskUserInput = document.getElementById('task-user').value;

    // Armazenar os detalhes da tarefa em um objeto
    const taskDetails = {
        title: taskTitle,
        project: taskProject,
        description: taskDescription,
        startDate: startDate,
        endDate: endDate,
        user: taskUserInput
    };

    // Recuperar o ID da tarefa atual
    const taskId = document.getElementById('task-title').dataset.taskId;

    // Salvar os detalhes da tarefa no Local Storage com a chave específica da tarefa
    localStorage.setItem(`taskDetails_${taskId}`, JSON.stringify(taskDetails));

    // Atualizar a cor da borda da tarefa com base no usuário selecionado
    const taskElement = document.getElementById(taskId);
    taskElement.classList.remove('blue', 'pink', 'green', 'purple'); // Remove todas as cores possíveis
    taskElement.classList.add(taskUserInput); // Adiciona a classe da cor do usuário selecionado

    // Fechar o modal
    closeModal();
}

// Função para carregar os detalhes da tarefa do Local Storage ao abrir o modal
function loadTaskDetails(taskId) {
    const taskDetailsString = localStorage.getItem(`taskDetails_${taskId}`);
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

        // Atualizar a cor da borda da tarefa no modal
        const taskElement = document.getElementById(taskId);
        const currentColor = Array.from(taskElement.classList).find(cls => ['blue', 'pink', 'green', 'purple'].includes(cls));
        taskUserInput.value = currentColor || ''; // Definir a cor atual no select
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

    // Ajuste aqui para armazenar o ID da tarefa no campo de título (ou em outro lugar)
    taskTitle.dataset.taskId = taskElement.id;
    taskTitle.value = taskElement.innerText;
    taskProject.value = taskElement.dataset.project;
    taskDescription.value = taskElement.dataset.description || '';
    startDate.value = taskElement.dataset.startDate || '';
    endDate.value = taskElement.dataset.endDate || '';
    taskUserInput.value = taskElement.dataset.user || '';

    // Carregar detalhes da tarefa do Local Storage
    loadTaskDetails(taskElement.id);

    // Carregar a cor atual da borda da tarefa
    const currentColor = Array.from(taskElement.classList).find(cls => ['blue', 'pink', 'green', 'purple'].includes(cls));
    taskUserInput.value = currentColor || ''; // Definir a cor atual no select

    modal.style.display = 'block';
}


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

    // Adicionar a nova tarefa ao quadro com a cor baseada no usuário selecionado
    const newTaskElement = document.createElement('div');
    newTaskElement.className = 'task-card ' + document.getElementById('task-user').value;
    newTaskElement.dataset.project = project;
    newTaskElement.innerText = taskText;
    newTaskElement.draggable = true;
    newTaskElement.id = newTask.id;
    newTaskElement.addEventListener('dragstart', dragStart);
    newTaskElement.addEventListener('click', () => openModal(newTaskElement));
    document.querySelector('.add-task').before(newTaskElement);
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
