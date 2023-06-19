export default class KanbanApi {

static getItems(columnId){
    const column = read().find(column => column.id == columnId);

    if(!column){
        return [];
    }

    return column.items;
}
static insertItem(columnId, content){
    const data = read();
    const column = data.find(column => column.id == columnId);
    const item = {
        id: Math.floor(Math.random()*100000),
        content: content
    };

    if(!column){
        throw new Error("Column does not exist.")
    }

    column.items.push(item);
    save(data);

    return item;
}

static updateItem(itemId, newProps){
 const data = read();
 const [item,currentColumn] = (() => {
   for(const column of data){
    const item = column.items.find(item => item.id == itemId);
    if(item){
        return[item,column];
    }
   }
 })();
 
 if(!item){
    throw new Error("Item not found.");
 }

item.content = newProps.content === undefined ? item.content : newProps.content;

if(newProps.columnId !== undefined && newProps.position !== undefined)
{
    const targetColumn = data.find(column => column.id == newProps.columnId);

    if(!targetColumn){
        throw new Error("Target column not found.");
    }

    currentColumn.items.splice(currentColumn.items.indexOf(item), 1);

    targetColumn.items.splice(newProps.position, 0, item);
}
save(data);
}

static deleteItem(itemId) {
    const data = read();

    for (const column of data) {
        const index = column.items.findIndex(i => i.id === itemId);

        if (index !== -1) {
            column.items.splice(index, 1);
        }
    }

    save(data);
}


static importToFile(){
    document.querySelector('.import_item').addEventListener('click', () => {
        const data = read();
        const jsonData = JSON.stringify(data);
      
        const element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(jsonData));
        element.setAttribute('download', 'dane.json');
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
      });      
}

static exportFile(){
    const fileInput = document.getElementById('fileInput');
    const button = document.querySelector('.export_item');
    button.addEventListener('click', () => {
        fileInput.click();
      });
    fileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const fileContent = event.target.result;

      try {
        const jsonData = JSON.parse(fileContent);
        console.log('Wczytane dane:', jsonData);
        save(jsonData);
      } catch (error) {
        console.error('Błąd wczytywania danych JSON:', error);
      }
    };

    reader.readAsText(file);
    location.reload();
  });
  
}

}

function read(){
    const json = localStorage.getItem("kanban-data");

    if(!json){
        return[
            {
                id: 1,
                items: []
            },
            {
                id: 2,
                items: []
            },
            {
                id: 3,
                items: []
            },
        ];
    }

    return JSON.parse(json);
}

function save(data){
    localStorage.setItem("kanban-data",JSON.stringify(data));
}

