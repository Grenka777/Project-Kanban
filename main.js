import Kanban from "./view/Kanban.js";
import KanbanApi from "./KanbanApi.js";

new Kanban(
    document.querySelector(".kanban")
);

const importButton = KanbanApi.importToFile();
const exportButton = KanbanApi.exportFile();



