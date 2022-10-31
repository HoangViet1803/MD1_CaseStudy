// drag-drop
// const tasks = document.querySelectorAll('.task');
// const allStatus = document.querySelectorAll('.status');
// let draggableTask = null;
// tasks.forEach((task) => {
//     task.addEventListener('dragstart', dragStart);
//     task.addEventListener('dragend', dragEnd)
// })
// function dragStart(){
//     draggableTask = this;
//     console.log(draggableTask)
// }
// function dragEnd(){
//     draggableTask = null;
// }
// allStatus.forEach((status) => {
//     status.addEventListener('dragover',dragOver);
//     status.addEventListener('drop', dragDrop)
// })
// function dragOver(e){
//     e.preventDefault();
// }
// function dragDrop(){
//     this.appendChild(draggableTask)
// }

// Page event
class Pages {
    constructor() {
        this._pages = []
    }

    get pages() {
        return this._pages;
    }

    set pages(value) {
        this._pages = value;
    }

    pushItem(page) {
        this._pages.push(page)
    }

    removeItem(id) {
        for (let i in this._pages) {
            if (id === this._pages[i].id) {
                this._pages.splice(i, 1);
                break
            }
        }
    }
}

let listPages = new Pages();
let pages = listPages.pages

class Page {
    constructor(name, id) {
        this._name = name;
        this._tasks = [];
        this._id = id
    }

    get name() {
        return this._name;
    }

    set name(value) {
        this._name = value;
    }

    get tasks() {
        return this._tasks;
    }

    get id() {
        return this._id;
    }

    set tasks(value) {
        this._tasks = value;
    }
}

class Task {
    constructor(name, status, start, end, color, describe, note, id) {
        this._name = name;
        this._status = status;
        this._start = start;
        this._end = end;
        this._color = color;
        this._describe = describe;
        this._note = note;
        this._status = status;
        this._id = id;
    }


    get id() {
        return this._id;
    }

    set id(value) {
        this._id = value;
    }

    get name() {
        return this._name;
    }

    set name(value) {
        this._name = value;
    }

    get status() {
        return this._status;
    }

    get start() {
        return this._start;
    }

    get end() {
        return this._end;
    }

    get color() {
        return this._color;
    }

    get describe() {
        return this._describe;
    }

    get note() {
        return this._note;
    }

    set status(value) {
        this._status = value;
    }

    set start(value) {
        this._start = value;
    }

    set end(value) {
        this._end = value;
    }

    set color(value) {
        this._color = value;
    }

    set describe(value) {
        this._describe = value;
    }

    set note(value) {
        this._note = value;
    }
}

// localStorage.setItem("pages", JSON.stringify(pages));
const btnAddNewPage = document.querySelector("#addNewPage");
btnAddNewPage.addEventListener('click', addNewPageFn);
const ulPages = document.querySelector(".page");
let indexPage = 0;
let statusKanban = [
    {className:'backlog',status: "Backlog", icon : "<i class=\"fa-solid fa-list\"></i>"},
    {className:'todo',status: "Todo", icon : "<i class=\"fa-regular fa-circle\"></i>"},
    {className:'inProcess',status: "In-process", icon : "<i class=\"fa-solid fa-spinner\"></i>"},
    {className:'complete',status: "Complete", icon : "<i class=\"fa-regular fa-circle-check\"></i>"},
]

function handleClassActive(list, id) {
    list.forEach(item => item.classList.remove("li-active"))
    document.querySelector(`#${id}`).classList.add("li-active")
}

function addNewPageFn() {
    let li = `<li class="listPage" id="page-${++indexPage}" ondblclick="renamePage(id,pages)" onclick="setTimeout(renderKanban(id,pages),380)"><i class="fa-solid fa-angle-right me-2"></i>New Page</li>`;
    ulPages.innerHTML += li;
    let listPage = document.querySelectorAll(".listPage");
    console.log(listPage)
    handleClassActive(listPage, `page-${indexPage}`)
    let name = document.querySelector(`#page-${indexPage}`).textContent;
    let idPage = `page-${indexPage}`;
    let page = new Page(name, idPage);
    listPages.pushItem(page);
    console.log(listPages.pages)
}

function renamePage(id) {
    let current = document.querySelector(`#${id}`);
    let oldName = current.textContent;
    current.innerHTML = `<i class="fa-solid fa-angle-right"></i><input id="inRename-${id}" type="text" style="width: 180px; outline: none; border: none; background-color: #f0f0ef" value="${oldName.trim()}">`;
    let newNamePage = "";
    let liNamePag = "";
    let inputNamePage = current.querySelector(`#inRename-${id}`);
    // inputNamePage.focus();
    inputNamePage.select()
    inputNamePage.addEventListener('input', () => {
        if (inputNamePage.value.trim() !== "" && inputNamePage.value.length > 0) {
            newNamePage = inputNamePage.value.trim();
            pages = resetName(id, pages, newNamePage)
            reRenderNameKanban(id, newNamePage)
        } else {
            newNamePage = oldName.trim();
            pages = resetName(id, pages, newNamePage)
            reRenderNameKanban(id, newNamePage)
        }
    })

    inputNamePage.addEventListener('blur', () => {
        if (newNamePage.trim() == oldName.trim() || newNamePage.trim() !== "") {
            liNamePag = newNamePage;
            liNamePag = checkLengthNamePage(liNamePag)
            current.innerHTML = `<i class="fa-solid fa-angle-right me-2"></i>${liNamePag}`;
            pages = resetName(id, pages, newNamePage)
            // reRenderNameKanban(id, newNamePage);
            renderKanban(`page-${indexPage}`)
        } else {
            current.innerHTML = `<i class="fa-solid fa-angle-right me-2"></i>${oldName}`;
            pages = resetName(id, pages, oldName)
            // reRenderNameKanban(id, newNamePage);
            renderKanban(`page-${indexPage}`)
        }
    })
    inputNamePage.addEventListener("keydown", (e) => {
        if (e.code === "Enter" && newNamePage !== "") {
            liNamePag = newNamePage;
            liNamePag = checkLengthNamePage(liNamePag)
            current.innerHTML = `<i class="fa-solid fa-angle-right me-2"></i>${liNamePag}`;
            pages = resetName(id, pages, newNamePage)
            reRenderNameKanban(id, newNamePage);
            renderKanban(`page-${indexPage}`)
        } else {
            newNamePage = oldName;

        }
    });
    console.log(pages)
}

function resetName(id, pages, newName) {
    for (let i = 0; i < pages.length; ++i) {
        if (pages[i].id == id) {
            pages[i].name = newName
        }
    }
    return pages
}

function checkLengthNamePage(namePage) {
    if (namePage.length > 15) {
        namePage = namePage.slice(0, 15) + "..."
    }
    return namePage
}

function reRenderNameKanban(id, newName) {
    document.querySelector(`#name_${id}`).innerHTML = newName
}

function renderKanban(id, pages) { // id = page-1
    for (let item in pages) {
        let pageContent = document.querySelector(".page-content");
        if (id === pages[item].id) {
            let listPage = document.querySelectorAll(".listPage")
            handleClassActive(listPage, id)
            pageContent.innerHTML = ""
            let template = ``;
            template += `
        <div class="header-kanban">
            <h3 id="name_${id}">${pages[item].name}</h3>
            <i class="fa-solid fa-trash i-deletePage" id="${id}" onclick="deletePage(id,pages)"></i>
        </div>
        <div class="kanban row">
        </div>`;
            pageContent.innerHTML = template;
            let itemTemplate = ``;
            for (let item of statusKanban){
                itemTemplate += renderKanbanItem(item.status, item.icon, item.className, id)
            }
            document.querySelector(".kanban").innerHTML += itemTemplate;
            break
        }
    }
}

function renderKanbanItem(status, icon, className, idPage){
    let template = ``;
    template += `<div class="${className} col-3 status">
                <h5>${icon} ${status}</h5>
                <button type="button" class="btn-add" data-bs-toggle="modal" data-bs-target="#btn-add-${className}" onclick="openModal"><i
                        class="fa-solid fa-plus"></i> New
                </button>
                <!-- Modal button add -->
                <div class="modal fade" id="btn-add-${className}" tabindex="-1" aria-labelledby="exampleModalLabel"
                     aria-hidden="true">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <div class="modal-header-left">
                                    <h1 class="modal-title fs-5" id="nameTask-${status}"  ondblclick="renameTask(this.id)">New task</h1>
                                    <p>Status: <span id="statusTask"> ${status}</span></p>
                                </div>
                                <button type="button" class="btn-close" data-bs-dismiss="modal"
                                        aria-label="Close"></button>
                            </div>
                            <div class="modal-body">${formNewTask(className)}</div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" id="close-modal" onclick="closeModal()" data-bs-dismiss="modal">Close</button>
                                <button type="button" class="btn btn-primary" id="addTask${status}" data-name="nameTask-${status}" data-idpage="${idPage}" data-status="${className}" onclick="addTask(this.id, this.dataset)">Add new Task</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
    return template
}

function formNewTask(statusKanban) {
    let template = ``;
    template = `<form>
              <div class="time-counter">
                <div>
                  <label for="start-${statusKanban}">Start:</label>
                  <input type="time" name="time" id="start-${statusKanban}">
                </div>
                <div>
                  <label for="end-${statusKanban}">End:</label>
                  <input type="time" name="time" id="end-${statusKanban}">
                </div>
              </div>
              <div class="task-color">
                <p>Color:</p>
                <input type="radio" name="colors" id="green" value="green" checked>
                <label for="green"></label>
                <input type="radio" name="colors" id="yellow" value="yellow">
                <label for="yellow"></label>
                <input type="radio" name="colors" id="orange" value="orange">
                <label for="orange"></label>
                <input type="radio" name="colors" id="red" value="red">
                <label for="red"></label>
              </div>
              <p>Describe</p>
              <textarea id="describe" cols="78" rows="5" style="width: 100%"
                        placeholder="Describe"></textarea>
              <p>Note</p>
              <textarea id="note" cols="78" rows="5" style="width: 100%" placeholder="Note"></textarea>
            </form>`
    return template
}

function deletePage(id) {
    console.log(id)
    listPages.removeItem(id);
    document.querySelector(".page-content").innerHTML = "";
    document.querySelector(`#${id}`).remove();
}

function renameTask(id) { // id = nameTask-Backlog
    let nameTask = document.querySelector(`#${id}`);
    let oldName = nameTask.innerHTML;
    let newName = ""
    nameTask.innerHTML = `<input type="text" class="nameTask" value="${oldName}">`;
    let inputNameTask = document.querySelector(".nameTask");
    inputNameTask.select()
    inputNameTask.addEventListener('input', () => {
        if (inputNameTask.value.trim() !== "" && inputNameTask.value.length > 0) {
            newName = inputNameTask.value.trim();
        } else {
            newName = oldName
        }
    })
    inputNameTask.addEventListener('blur', () => {
        if (newName.trim() == oldName.trim() || newName.trim() !== "") {
            nameTask.innerHTML = newName
        } else {
            nameTask.innerHTML = oldName;
        }
    })

    // inputNameTask.addEventListener("keydown", (e) => {
    //         if (e.code === "Enter" && newName !== "") {
    //             nameTask.innerHTML = newName
    //         } else {
    //             newName = oldName
    //         }
    //     }
    // );
}

function addTask(id, dataset) { // id = addTaskBacklog
    let btnSave = document.querySelector(`#${id}`)
    let idPageData = btnSave.dataset.idpage; // page-1
    let idNameData = btnSave.dataset.name; // nameTask-Backlog;
    let statusData = btnSave.dataset.status; // backlog
    let name = document.querySelector(`#${idNameData}`).textContent;
    let status = document.querySelector('#statusTask').textContent;
    let start = document.querySelector(`#start-${statusData}`).value;
    let end = document.querySelector(`#end-${statusData}`).value;
    let color = document.querySelector('input[name="colors"]:checked').value;
    let describe = document.querySelector('#describe').value;
    let note = document.querySelector("#note").value
    let task = new Task(name, status, start, end, color, describe, note, `task${idPageData}-${listPages.pages.length++}`);
    console.log(task)
    let template = ``;
    let number = 0;
    for (let i in listPages.pages) {
        if(idPageData == listPages.pages[i].id) {
            listPages.pages[i].tasks.push(task);
            template += renderTask(listPages.pages[i].tasks, ++number)
        }
    }
    document.querySelector(`.${statusData}`).innerHTML+= template
}

function renderTask(listTasks, number){
    let lastTask = listTasks[listTasks.length-1];
    let template = ``;
        template += `<!-- Task -->
                <div class="task" style="border-left: 5px solid ${lastTask.color}" data-bs-toggle="modal" data-bs-target="#${lastTask.id}">
                    <span>${lastTask.name}</span>
                    <i class="fa-solid fa-xmark i-close"></i>
                </div>
                <!-- Modal -->
                <div class="modal fade" tabindex="-1" id="${lastTask.id}" tabindex="-1"
                     aria-labelledby="exampleModalLabel"
                     aria-hidden="true">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <div class="modal-header-left">
                                    <h1 class="modal-title fs-5" id="task-1">${lastTask.name}</h1>
                                    <p>Status: <span>${lastTask.status}</span></p>
                                </div>
                                <button type="button" class="btn-close" data-bs-dismiss="modal"
                                        aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <form>
                                    <div class="time-counter">
                                        <div>
                                            <label for="start-backlog-1">Start:</label>
                                            <input type="time" name="time" id="start-backlog-1">
                                        </div>
                                        <div>
                                            <label for="end-backlog-1">End:</label>
                                            <input type="time" name="time" id="end-backlog-1">
                                        </div>
                                    </div>
                                    <div class="task-color">
                                        <p>Color:</p>
                                        <input type="radio" name="colors" id="green">
                                        <label for="green"></label>
                                        <input type="radio" name="colors" id="yellow">
                                        <label for="yellow"></label>
                                        <input type="radio" name="colors" id="orange">
                                        <label for="orange"></label>
                                        <input type="radio" name="colors" id="red">
                                        <label for="red"></label>
                                    </div>
                                    <p>Describe</p>
                                    <textarea cols="78" rows="5" style="width: 100%"
                                              placeholder="Describe">${lastTask.describe}</textarea>
                                    <p>Note</p>
                                    <textarea cols="78" rows="5" style="width: 100%" placeholder="Note">${lastTask.note}</textarea>
                                </form>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close
                                </button>
                                <button type="button" class="btn btn-primary" id="backlog-save-${number}">Save changes</button>
                            </div>
                        </div>
                    </div>
                </div>`

    return template
}


