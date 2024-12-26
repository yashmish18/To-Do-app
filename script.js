document.addEventListener('DOMContentLoaded', function() {
    loadTasks(); // Load tasks from local storage on page load

    document.getElementById('addButton').addEventListener('click', function() {
        const taskInput = document.getElementById('taskInput');
        const noteInput = document.getElementById('noteInput');
        const taskText = taskInput.value.trim();
        const noteText = noteInput.value.trim();

        if (taskText) {
            const task = {
                text: taskText,
                note: noteText,
                completed: false
            };

            addTaskToDOM(task);
            saveTaskToLocalStorage(task);
            taskInput.value = ''; // Clear input after adding
            noteInput.value = ''; // Clear note input after adding
        }
    });
});

function addTaskToDOM(task) {
    const li = document.createElement('li');
    const uncheckedIcon = document.createElement('img');
    uncheckedIcon.src = 'images/unchecked.png'; // Path to unchecked icon
    uncheckedIcon.className = 'task-icon'; // Add class for styling
    li.appendChild(uncheckedIcon);
    li.appendChild(document.createTextNode(task.text));
    
    if (task.note) {
        const noteSpan = document.createElement('span');
        noteSpan.textContent = ` - Note: ${task.note}`;
        noteSpan.className = 'note'; // Add class for styling
        li.appendChild(noteSpan);
    }

    // Create delete button
    const deleteButton = document.createElement('button');
    deleteButton.textContent = '✖'; // Cross symbol
    deleteButton.className = 'delete-button'; // Add class for styling
    deleteButton.addEventListener('click', function(event) {
        event.stopPropagation(); // Prevent triggering the task click event
        li.remove(); // Remove task from DOM
        updateLocalStorage(); // Update local storage
    });
    li.appendChild(deleteButton); // Append delete button to the task

    // Check if the task is completed and set the appropriate state
    if (task.completed) {
        li.classList.add('completed');
        uncheckedIcon.src = 'checked.png'; // Change to checked icon
        document.getElementById('completedTasks').appendChild(li);
    } else {
        li.addEventListener('click', function() {
            li.classList.toggle('completed');
            if (li.classList.contains('completed')) {
                uncheckedIcon.src = 'images/checked.png'; // Path to checked icon
                document.getElementById('completedTasks').appendChild(li);
            } else {
                uncheckedIcon.src = 'images/unchecked.png'; // Path to unchecked icon
                document.getElementById('uncompletedTasks').appendChild(li);
            }
            updateLocalStorage();
        });

        document.getElementById('uncompletedTasks').appendChild(li);
    }
}

function saveTaskToLocalStorage(task) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => addTaskToDOM(task));
}

function updateLocalStorage() {
    const tasks = [];
    document.querySelectorAll('#uncompletedTasks li, #completedTasks li').forEach(li => {
        const taskText = li.childNodes[1].textContent; // Get task text
        const noteText = li.querySelector('.note') ? li.querySelector('.note').textContent.replace(' - Note: ', '') : ''; // Get note text
        const completed = li.classList.contains('completed');
        tasks.push({ text: taskText, note: noteText, completed: completed });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}