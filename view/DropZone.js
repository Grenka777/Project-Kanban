import KanbanApi from "../KanbanApi.js";

export default class DropZone{
static createDropeZone(){
    const range = document.createRange();

    range.selectNode(document.body);

    const dropZone = range.createContextualFragment(`
    <div class="dropzone"> </div> 
    `).children[0];

    dropZone.addEventListener("dragover", e =>{
        e.preventDefault();
        dropZone.classList.add("dropzone--active");
    });

    dropZone.addEventListener("dragleave", () =>{
        dropZone.classList.remove("dropzone--active");
    });

    dropZone.addEventListener("drop", e =>{
        e.preventDefault();
        dropZone.classList.remove("dropzone--active");

        const columnElement = dropZone.closest(".kanban_column");
        const columnId = Number(columnElement.dataset.id);
        const dropZonesInColumn = Array.from(columnElement.querySelectorAll(".dropzone"));
        const droppedIndex = dropZonesInColumn.indexOf(dropZone);
        const itemId = Number(e.dataTransfer.getData("text/plain"));
        const droppedItemElement = document.querySelector(`[data-id="${itemId}"]`);
        const insertAfter = dropZone.parentElement.classList.contains("item") ? dropZone.parentElement : dropZone;
        
        if(droppedItemElement.contains(dropZone)){
            return;
        }

        insertAfter.after(droppedItemElement);
       KanbanApi.updateItem(itemId,{
        columnId,
        position: droppedIndex
       });
    });

    return dropZone;
}

}