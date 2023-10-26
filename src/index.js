import {SpaceX} from "./api/spacex";
import * as d3 from "d3";
import * as Geo from './geo.json'


document.addEventListener("DOMContentLoaded", setup)

const mp = {}

function setup(){
    const spaceX = new SpaceX();
    spaceX.launches().then(data=>{
        const listContainer = document.getElementById("listContainer")
        renderLaunches(data, listContainer);
    })

    spaceX.launchpads().then(data => {
        console.log(data)
        const d = {
            "ids":[],
            "features": []};
            data.forEach(launchpad => {
                d.features.push({
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [launchpad.longitude, launchpad.latitude ]
            }});
            d.ids.push(launchpad.id)
        })
        
        drawMap(d);
    })
}
function renderLaunches(launches, container){
    const list = document.createElement("ul");
    launches.forEach(launch=>{
        const item = document.createElement("li");
        item.innerHTML = launch.name;
        item.id = launch.id
        mp[launch.id] = launch.launchpad
        item.onmouseover = liItemOnMouseHover
        item.onmouseleave = liItemOnMouseLeave
        list.appendChild(item);
    })
    container.replaceChildren(list);
}

function liItemOnMouseHover(){
    launchpadId = mp[this.id]
    launchpad = document.getElementById(launchpadId)
    launchpad.setAttribute('fill','yellow')
}


function liItemOnMouseLeave(){
    launchpadId = mp[this.id]
    launchpad = document.getElementById(launchpadId)
    launchpad.setAttribute('fill','red')
}

function drawMap(data){
    const width = 640;
    const height = 480;
    const margin = {top: 20, right: 10, bottom: 40, left: 100};
    const svg = d3.select('#map').append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");
    const projection = d3.geoMercator()
        .scale(70)
        .center([0,20])
        .translate([width / 2 - margin.left, height / 2]);
    svg.append("g")
        .selectAll("path")
        .data(Geo.features)
        .enter()
        .append("path")
        .attr("class", "topo")
        .attr("d", d3.geoPath()
            .projection(projection)
        ).attr("fill", function (d) {
            return 'green';
        })
        .style("opacity", .7)
    
    svg.selectAll('.dots')
        .data(data.features)
        .enter()
        .append('path')
        .attr('d',d3.geoPath()
        .projection(projection))
        .attr('class', 'dots')
        .attr('fill','red')

    const element  = document.querySelectorAll('.dots');
    console.log(element)
        element.forEach((e, i) => {
            e.setAttribute("id", data.ids[i]);
        });
}
