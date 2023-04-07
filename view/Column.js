import KanbanApi from "../KanbanApi.js ";
import DropZone from "./DropZone.js";
import Item from "./Item.js";
import Kanban from "./Kanban.js";

export default class Column{
    constructor(id,title){
        const topDropZone = DropZone.createDropeZone();

     this.elements = {};
     this.elements.root = Column.createRoot();
     this.elements.title = this.elements.root.querySelector(".column_title");
     this.elements.items = this.elements.root.querySelector(".column_items");
     this.elements.addItem = this.elements.root.querySelector(".add_item");

     this.elements.root.dataset.id = id;
     this.elements.title.textContent = title;
     this.elements.items.appendChild(topDropZone);
     
     this.elements.addItem.addEventListener("click", () =>{
       const newItem = KanbanApi.insertItem(id,"");

       this.renderItem(newItem);
     });

     KanbanApi.getItems(id).forEach(item =>{
        this.renderItem(item);
     });
    }

    static createRoot(){
        const range = document.createRange();

        range.selectNode(document.body);

        return range.createContextualFragment(`
        <div class="kanban_column">
         <div class="column_title"></div>
         <div class="column_items"></div>
          <button class="add_item" type="button">+ Add</button>
       </div>
        `).children[0];
    }

    renderItem(data){
     const item = new Item(data.id, data.content);

     this.elements.items.appendChild(item.elements.root);
    }
}