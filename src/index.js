import {SpaceX} from "./api/spacex";
document.addEventListener("DOMContentLoaded", setup)

function setup(){
    const spaceX = new SpaceX();
    spaceX.launches().then(data=>{
        const listContainer = document.getElementById("listContainer")
        RenderLaunches(data, listContainer);
    })
}
function RenderLaunches(launches, container){
    const list = document.createElement("ul");
    launches.forEach(launch=>{
        const item = document.createElement("li");
        item.innerHTML = launch.name;
        list.appendChild(item);
    })
    container.replaceChildren(list);
}

