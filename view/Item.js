import KanbanApi from "../KanbanApi.js";

export default class Item{
    constructor(id, content){
        this.elements = {};
        this.elements.root = Item.createRoot();
        this.elements.input = this.elements.root.querySelector(".item_input");

        this.elements.root.dataset.id = id;
        this.elements.input.textContent = content;
        this.content = content;

        const onBlur = () => {
            const newContent = this.elements.input.textContent.trim();
            
            if(newContent == this.content){
                return;
            }
            
            this.content = newContent;

            KanbanApi.updateItem(id, {
                content: this.content
            });
        };

        this.elements.input.addEventListener("blur",onBlur);
        this.elements.root.addEventListener("dblclick", () => {
         const check = confirm("Are you sure you want to delete this item?");

         if(check){
            KanbanApi.deleteItem(id);

            this.elements.input.removeEventListener("blur", onBlur);
            this.elements.root.parentElement.removeChild(this.elements.root);
         }
        });
    }

    static createRoot(){
        const range = document.createRange();

        range.selectNode(document.body);

        return range.createContextualFragment(`
        <div class="item" draggable="true">
           <div class="item_input" contenteditable></div>
        </div> 
        `).children[0];
    }
}