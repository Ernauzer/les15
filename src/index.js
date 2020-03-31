const input = document.querySelector('input');
const form = document.querySelector('form');
const noteList = document.querySelector('ul');
let value = '';

function renderTask(taskObject) {
    // Создание елементов \\
    const taskItem = document.createElement('li');
    const taskItemContent = document.createElement('span');
    const taskItemBtnComplete = document.createElement('button');
    const taskItemBtnRemove = document.createElement('button');
    const taskItemBtnEdit = document.createElement('button');
    // Добавили класс \\
    taskItem.classList.add('note-list__item');
    taskItemContent.classList.add('notes');
    taskItemBtnComplete.classList.add('complete');
    taskItemBtnRemove.classList.add('remove');
    taskItemBtnEdit.classList.add('edit');
    // Добавили текст \\
    taskItemContent.innerText = taskObject.value;
    // Добавили к родителю \\
    taskItem.prepend(taskItemContent);
    taskItem.append(taskItemBtnComplete);
    taskItem.append(taskItemBtnRemove);
    taskItem.append(taskItemBtnEdit);
    // Добавили атрибут taskItem(li) \\
    taskItem.setAttribute('data-id', taskObject.id);
    // Проверка \\
    if (taskObject.completed) {
        taskItem.classList.add('note-list__item--completed');
    }
    return taskItem;
}
function editTask(editTaskObject) {
    const taskItem = editTaskObject;
    const taskItemEditSave = document.createElement('button');
    const taskItemEditCancel = document.createElement('button');
    taskItem.innerHTML = '<input type = text  class = text_edit>';
    const textEdit = editTaskObject.children[0];
    
    taskItem.classList.add('note-list__item');
    taskItemEditSave.classList.add('save');
    taskItemEditCancel.classList.add('cancel');

    // Добавили к родителю \\
    taskItem.append(taskItemEditSave);
    taskItem.append(taskItemEditCancel);
    //\\
    textEdit.value = value;
    // Ф-кция удаления потомков при нажатии на Edit \\
    function delChild (child) {
        for (let i = 0; i < child.length; i++) {

            switch (child[i].className) {
            case 'complete':
            case 'remove':
            case 'edit':
            case 'notes':
                child[i].style.display = 'none';
                break;
            }
        }
    }
    delChild(taskItem.children);
    return taskItem;
}

// Массив обьектов списка дел \\
let taskList = [];
// Событие клик на форму \\
form.addEventListener('submit', e => {
    e.preventDefault();
    if (input.value.trim()) {
        const task = {
            value: input.value,
            completed: false,
            id: String(new Date).slice(16,24).replace(/:/g,''),
        };
        // Добавили обьект(ы) в массив \\
        taskList.unshift(task);
        // Добавили ul вызов функции с агрументом обьекта \\
        noteList.prepend(renderTask(task));
        input.value = '';
    }
});

// Событие клик на кнопки \\
noteList.addEventListener('click', e => {
    const element = e.target;
    const targetClassName = e.target.className;
    let currentId;

    switch (targetClassName) {
        case 'remove':
        case 'complete':
        case 'edit':
        case 'save':
        currentId = element.closest('.note-list__item').getAttribute('data-id');
        break;
        
        
    }

    switch (targetClassName) {
        case 'remove':
            noteList.innerHTML = '';
            //Перезаписали масив = останутся те что не совпадают currentId \\
            taskList = taskList.filter(task => task.id !== currentId);
            // Добавили вызов ф-кции с обьектом заметки \\
            taskList.forEach(task => {
                noteList.append(renderTask(task));
            });
            break;

        case 'complete':
            // Если id совпадает то completed = true (выполнено) \\
            taskList.find(task => task.id === currentId).completed = true;
            noteList.innerHTML = '';
            // Добавили вызов ф-кции с обьектом заметки \\
            taskList.forEach(task => {
                noteList.append(renderTask(task));
            });
            break;

        case 'edit':
            // Находим значение с с выбраного списка \\
            value = taskList.find(task => task.id === currentId).value;
            // Передаём в ф-кцию именно этот список который редактируется \\
            editTask(element.closest('.note-list__item')); 
            break;

        case 'save':
            // Находим именно тот инпут который хотим сохранить \\
            let inpEdit = element.closest('.note-list__item').querySelector('input');
            taskList.forEach(task => {
                noteList.innerHTML = '';
                if (task.id === currentId) {
                    task.value = inpEdit.value;
                }
                noteList.append(renderTask(task));
            })
        
        case 'cancel':
            noteList.innerHTML = '';
            taskList.forEach(task => {
                noteList.append(renderTask(task));
            });
    }
});