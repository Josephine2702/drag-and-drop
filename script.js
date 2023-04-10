const addBtns = document.querySelectorAll('.add-btn:not(.solid)');
const saveItemBtns = document.querySelectorAll('.solid');
const addItemContainers = document.querySelectorAll('.add-container');
const addItems = document.querySelectorAll('.add-item');
// Item Lists
const itemLists = document.querySelectorAll('.drag-item-list');
const backlogList = document.getElementById('backlog-list');
const progressList = document.getElementById('progress-list');
const completeList = document.getElementById('complete-list');
const onHoldList = document.getElementById('on-hold-list');

// Items
let updatedOnLoad = false;

// Initialize Arrays
let backlogListArray = [];
let progressListArray = [];
let completeListArray = [];
let onHoldListArray = [];
let listArrays = [];


// Drag Functionality
let draggedItem;
let dragging = false;
let currentColumn;

// Get Arrays from localStorage if available, set default values if not
function getSavedColumns() {
  if (localStorage.getItem('backlogItems')) {
    backlogListArray = JSON.parse(localStorage.backlogItems);
    progressListArray = JSON.parse(localStorage.progressItems);
    completeListArray = JSON.parse(localStorage.completeItems);
    onHoldListArray = JSON.parse(localStorage.onHoldItems);
  } else {
    backlogListArray = ['Release the course', 'Sit back and relax'];
    progressListArray = ['Work on projects', 'Listen to music'];
    completeListArray = ['Being cool', 'Getting stuff done'];
    onHoldListArray = ['Being uncool'];
  }
}



// Set localStorage Arrays
function updateSavedColumns() {
  listArrays = [backlogListArray, progressListArray, completeListArray, onHoldListArray];
  const arrayNames = ['backlog', 'progress', 'complete', 'onHold'];
 arrayNames.forEach((arrayName, i) => {
  localStorage.setItem(`${arrayName}Items`, JSON.stringify(listArrays[i]));
 });
}


// Create DOM Elements for each list item
function createItemEl(columnEl, column, item, index) {
  // List Item
  const listEl = document.createElement('li');
  listEl.classList.add('drag-item');
  listEl.textContent = item;
  listEl.draggable = true;
  listEl.setAttribute('ondragstart', 'drag(event)');
  listEl.contentEditable = true;
  listEl.id = index;
  listEl.setAttribute('onfocusout', `updateItem(${index}, ${column})`)

  columnEl.appendChild(listEl);

}

function renderList(list, listArray, listIndex) {
  list.textContent = '';
  listArray.forEach((item, i) => {
    createItemEl(list, listIndex, item, i);
  });

}

// Update Columns in DOM - Reset HTML, Filter Array, Update localStorage
function updateDOM() {
  // Check localStorage once
if(!updatedOnLoad){
  getSavedColumns();
}

renderList(backlogList, backlogListArray, 0);
renderList(progressList, progressListArray, 1);
renderList(completeList, completeListArray, 2);
renderList(onHoldList, onHoldListArray, 3);

  // Run getSavedColumns only once, Update Local Storage
updatedOnLoad = true;
updateSavedColumns();

}

function updateItem(id, column) {
  const selectedArray = listArrays[column];
  
  const selectedColumnEl = itemLists[column].children;
 
if(!dragging){
  if(!selectedColumnEl[id].textContent) {
    selectedArray.splice(id, 1);
  } else {
    selectedArray[id] = selectedColumnEl[id].textContent;
  }
  updateDOM();
 
}
}

function addToColumn(column){
  const itemText = addItems[column].textContent;

  const selectedArray = listArrays[column];

  selectedArray.push(itemText);
  addItems[column].textContent = '';
  updateDOM();
}

function showInputBox(column) {
 addBtns[column].style.visibility = 'hidden';
 saveItemBtns[column].style.display = 'flex';
 addItemContainers[column].style.display = 'flex';
}

function hideInputBox(column) {
  addBtns[column].style.visibility = 'visible';
  saveItemBtns[column].style.display = 'none';
  addItemContainers[column].style.display = 'none';
  addToColumn(column);
}



function rebuildArrays(){
  
    const listElements = [backlogList, progressList, completeList, onHoldList];
    const listsArrays = [];
  
    listElements.forEach((listEl) => {
      const listArray = [];
      for (let i = 0; i < listEl.children.length; i++) {
        listArray.push(listEl.children[i].textContent);
      }
      listsArrays.push(listArray);
    });
  
    [backlogListArray, progressListArray, completeListArray, onHoldListArray] = listsArrays;
    updateDOM();
  

}

function drag(e) {
 draggedItem = e.target;
 dragging = true;

}

function allowDrop(e) {
  e.preventDefault();
}

function drop(e) {
  e.preventDefault();
  itemLists.forEach(column => {
    column.classList.remove('over');
  });

  const parent = itemLists[currentColumn];
  parent.appendChild(draggedItem);
  dragging = false;
  rebuildArrays();
}

function dragEnter(column) {
itemLists[column].classList.add('over');
currentColumn = column;
}

updateDOM();

itemLists.forEach((itemList, i) => {
  
  itemList.addEventListener('drop', (event) => {
    drop(event);
  })
  itemList.addEventListener('dragover', (event) => {
    allowDrop(event);
  })
  itemList.addEventListener('dragenter', (event) => {
    dragEnter(i);
  })
})

addBtns.forEach((btn, i) => {
  btn.addEventListener('click', () => {
    showInputBox(i)
  })
})

saveItemBtns.forEach((btn, i) => {
  btn.addEventListener('click', () => {
    hideInputBox(i)
  })
})