let createTask = document.querySelector('#createTaskButton');
let updateTaskButton = document.querySelector('#updateTaskBtn');
let deleteTaskButton = document.querySelector('#deleteTaskBtn');
$(document).ready(() => {
    loadTasks();
})
createTask.addEventListener('click', (event) => {
    event.preventDefault();
    let taskForm = document.querySelector('#addTaskForm');
    let formData = new FormData(taskForm);


    let title = formData.get('task_title').trim();
    if (title === "") {
        showCreateModalMessage('Task title cannot be blank.');
        return;
    }
    let description = formData.get('task_description');
    if (description === "") {
        showCreateModalMessage('Task description cannot be blank.');
        return;
    }
    let data = {
        title: title, description: description, status: formData.get('task_status')
    };
    fetch('/api/tasks', {
        method: 'POST', headers: {
            'Content-Type': 'application/json'
        }, body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(data => {
            taskForm.reset();
            $('#exampleModal').modal('hide');
            loadTasks();
            showCreateModalMessage('Task created successfully.', false);
        })
        .catch((error) => {
            showCreateModalMessage('An error occurred while creating the task.', false);
        });


});

updateTaskButton.addEventListener('click', (event) => {
    event.preventDefault();
    let taskForm = document.querySelector('#editTaskForm');
    let formData = new FormData(taskForm);
    let title = formData.get('task_title').trim();
    if (title === "") {
        showCreateModalMessage('Task title cannot be blank.');
    }
    let description = formData.get('task_description');
    if (description === "") {
        showCreateModalMessage('Task description cannot be blank.');
    }
    let taskId = document.querySelector('#task_id').value;
    let data = {
        title: title, description: description, status: formData.get('task_status')
    };
    console.log(data);
    fetch('/api/tasks/' + taskId, {
        method: 'PUT', headers: {
            'Content-Type': 'application/json'
        }, body: JSON.stringify(data)
    }).then(response => response.json())
        .then(data => {
            $('#editTaskModal').modal('hide');
            showCreateModalMessage(data.message, false);
            loadTasks();

        }).catch((error) => {
        showCreateModalMessage(error.message);
    })

});

deleteTaskButton.addEventListener('click', (event) => {
    event.preventDefault();
    let taskId = document.querySelector('#delete_task_id').value;
    fetch('/api/tasks/' + taskId, {
        method: 'DELETE',
    })
        .then(response => response.json())
        .then(data => {
            $('#deleteModal').modal('hide');
            showCreateModalMessage(data.message, false);
            loadTasks();
        })
})

function showCreateModalMessage(message, error = true) {
    let modalMessage = document.querySelector('#modal_message');
    modalMessage.textContent = message;
    if (error) {
        modalMessage.classList.add('alert-danger');
        modalMessage.classList.remove('alert-success');
    } else {
        modalMessage.classList.add('alert-success');
        modalMessage.classList.remove('alert-danger');
    }
    modalMessage.style.display = 'block';
    setTimeout(() => {
        modalMessage.style.display = 'none';
    }, 3000);
}

function loadTasks(searchParams = {}) {
    const tableBody = $('#table-body');
    tableBody.empty(); // Clear the table first
    const queryString = $.param(searchParams);

    fetch(`/api/tasks?${queryString}`, { method: 'GET' })
        .then(response => response.json())
        .then(data => {
            if (data.length === 0) {
                const row = $('<tr>');
                const noTaskCell = $('<td colspan="5">').text('No tasks added yet.');
                row.append(noTaskCell);
                tableBody.append(row);
            } else {
                data.forEach((task, index) => {
                    const row = $('<tr>');
                    const sNoCell = $('<td>').text(index + 1);
                    const titleCell = $('<td>').text(task.title);
                    const descriptionCell = $('<td>').text(task.description);

                    let statusClass, statusText;
                    switch (task.status) {
                        case 'todo':
                            statusClass = 'btn-info';
                            statusText = 'ToDo';
                            break;
                        case 'in_progress':
                            statusClass = 'btn-warning';
                            statusText = 'In Progress';
                            break;
                        case 'completed':
                            statusClass = 'btn-success';
                            statusText = 'Completed';
                            break;
                        default:
                            statusClass = 'btn-secondary';
                            statusText = 'Unknown';
                    }
                    const statusCell = $('<td>').html(`<button class="btn btn-sm ${statusClass}">${statusText}</button>`);

                    const actionsCell = $('<td>').html(`
                        <a href="#" onclick="editTask('${task._id}')" style="color: blue; margin-right: 10px;"><i class="fa-regular fa-pen-to-square"></i></a>
                        <a href="#" onclick="deleteTask('${task._id}')" style="color: red;"><i class="fa-solid fa-trash"></i></a>
                    `);

                    row.append(sNoCell, titleCell, descriptionCell, statusCell, actionsCell);
                    tableBody.append(row);
                });
            }
        })
        .catch(error => console.log(error));
}

async function editTask(taskId) {
    try {
        const response = await fetch(`/api/tasks/${taskId}`, {method: 'GET'});
        const data = await response.json();
        $('#task_id').val(data._id);
        $('#editTaskTitle').val(data.title);
        $('#editTaskDescription').val(data.description);
        $('#editTaskStatus').val(data.status);

        $('#editTaskModal').modal('show');
    } catch (error) {

        showCreateModalMessage(`Error fetching task details:, ${error}`);
        console.error('Error fetching task details:', error);
    }
}

function deleteTask(task) {
    $('#delete_task_id').val(task);
    $('#deleteModal').modal('show');
}

$('#searchButton').on('click', () => {
    const title = $('#searchTitle').val();
    const status = $('#searchStatus').val();

    const searchParams = {};
    if (title) searchParams.search = title;
    if (status) searchParams.status = status;

    loadTasks(searchParams);
});

$('#clearFilterButton').on('click', () => {
    $('#searchTitle').val('');
    $('#searchDescription').val('');
    $('#searchStatus').val('');
    loadTasks();
});

$('#searchBar').on('click', () => {
    const searchBar = $('#search-bar');
    if (searchBar.is(':visible')) {
        searchBar.hide();
    } else {
        searchBar.show();
    }
});

