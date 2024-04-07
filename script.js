const container = document.getElementById("container")
const createTaskBtn = document.getElementById("createTaskBtn");
const tasksContainer = document.getElementById("tasksContainer");
const titleInput = document.getElementById("titleInput")
const descriptionInput = document.getElementById("descriptionInput")


//Data Base
const indexedDB = window.indexedDB;
let db;
const request = indexedDB.open('tasksList', 1);

request.onsuccess = () => {
    db = request.result
    console.log('OPEN', db)
    readData()
}

request.onupgradeneeded = (e) => {
    db = e.target.result
    console.log('Create', db)
    const objectStore = db.createObjectStore('tasks', {
        keyPath: "title"
    })
}

const addData = (data) => {
    const transaction = db.transaction(['tasks'], 'readwrite')
    const objectStore = transaction.objectStore('tasks')
    const request = objectStore.add(data)
}


const readData = () => {
    const transaction = db.transaction(['tasks'], 'readonly')
    const objectStore = transaction.objectStore('tasks')
    const request = objectStore.openCursor();

    const fragment = document.createDocumentFragment();

    request.onsuccess = (e) => {
        const cursor = e.target.result

        if (cursor) {
            const divEl = document.createElement("DIV");
            divEl.classList.add("created-task")
            fragment.appendChild(divEl)

            const taskTitle = document.createElement("H2");
            taskTitle.textContent = cursor.value.title;
            taskTitle.classList.add("created-task-title")
            divEl.appendChild(taskTitle)

            const taskDescription = document.createElement("P");
            taskDescription.textContent = cursor.value.description;
            taskDescription.classList.add("created-task-desc")
            divEl.appendChild(taskDescription)

            const spaceBtns = document.createElement("DIV");
            spaceBtns.classList.add("created-task-btns")
            divEl.appendChild(spaceBtns)

            const updateBtn = document.createElement("BUTTON");
            updateBtn.classList.add("updateBtn");
            updateBtn.classList.add("space__icon");
            updateBtn.classList.add("fa-solid");
            updateBtn.classList.add("fa-pen-to-square");
            updateBtn.key = cursor.key
            spaceBtns.appendChild(updateBtn);

            const deleteBtn = document.createElement("BUTTON");
            deleteBtn.classList.add("deleteBtn");
            deleteBtn.classList.add("space__icon");
            deleteBtn.classList.add("fa-solid");
            deleteBtn.classList.add("fa-trash");
            deleteBtn.key = cursor.key
            spaceBtns.appendChild(deleteBtn);

            titleInput.value = ""
            descriptionInput.value = ""
            titleInput.classList.remove("disabled")
            createTaskBtn.textContent = "Crear tarea"

            cursor.continue()
        }
        else {
            tasksContainer.textContent = "";
            tasksContainer.appendChild(fragment)
        }

    }
}

const getData = (key) => {
    const transaction = db.transaction(["tasks"], "readwrite");
    const objectStore = transaction.objectStore("tasks")
    const request = objectStore.get(key)

    request.onsuccess = () => {
        titleInput.value = request.result.title;
        descriptionInput.value = request.result.description;
        titleInput.classList.add("disabled")
        createTaskBtn.textContent = "Modificar tarea"
    }
}

const updateData = (data) => {
    const transaction = db.transaction(["tasks"], "readwrite");
    const objectStore = transaction.objectStore("tasks")
    const request = objectStore.put(data)
    request.onsuccess = (e) => {
        readData()
        
    }
}

const deleteData = (key) => {
    const transaction = db.transaction(["tasks"], "readwrite");
    const objectStore = transaction.objectStore("tasks")
    const request = objectStore.delete(key)
    request.onsuccess = () => {
        readData()
    }
}

container.addEventListener("click", (e) => {
    const data = {
        "title": titleInput.value,
        "description": descriptionInput.value
    }
    if (e.target.id == "createTaskBtn") {
        if (e.target.textContent.trim() == "Crear tarea") {
            addData(data)
            readData()

        } else if (e.target.textContent.trim() == "Modificar tarea") {
            updateData(data)
        }
        else {
            console.log("xd")
        }

    }
    else if (e.target.classList.contains("updateBtn")) {
        getData(e.target.key)
    }
    else if (e.target.classList.contains("deleteBtn")) {
        deleteData(e.target.key)
    }
})

