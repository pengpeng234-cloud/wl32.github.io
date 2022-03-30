// https://observablehq.com/@pengpeng234-cloud/tree-explorer-for-the-city-of-champaign@141
function _1(md){return(
md`# Tree Explorer for the city of Champaign
# Author:Wanpeng Liu`
)}

function _2(htl){return(
htl.html`<p> In this data visualization project, we are using the data provided by the city of Champaign, the source of the data is: <p>https://giscityofchampaign.opendata.arcgis.com/datasets/979bbeefffea408e8f1cb7a397196c64_22.csvoutSR=%7B%22latestWkid%22%3A3857%2C%22wkid%22%3A102100%7D
<p><strong>Here are some examples and mete data for this project:</strong>`
)}

function _trees(d3){return(
d3.csv(
  "https://gis-cityofchampaign.opendata.arcgis.com/datasets/979bbeefffea408e8f1cb7a397196c64_22.csv?outSR=%7B%22latestWkid%22%3A3857%2C%22wkid%22%3A102100%7D",
  d3.autoType
)
)}

function _4(md){return(
md`# Part one: Individually-selected trees with pan-and-zoom function`
)}

function _5(htl){return(
htl.html`<p>The visualized data below shows the tree distribution in the city of champaign, as we can see, each dot represents an individual tree. When the mouse pointer to any point, the location information will show below, and when the mouse leaves, the color of the point will change to red representing that the dot has already been visited.
<p><strong> The address of the tree is:</strong>

<div id="mytreeinfo2"></div>`
)}

function* _6(d3,trees)
{
  function makeTrees() {
    
  const width = 600;
  const height = 450;
  const infoPanel = d3.select("#mytreeinfo2");
  const svg = d3
  .create("svg")
  .attr("width", width)
  .attr("height", height)
  .attr("viewBox", [4, 2, 6,4 ])
  .style("border", "solid 1px black");
  //yield svg.node();
  
  // Note: aspect ratios!
  const xScale = d3.scaleLinear().domain(d3.extent(trees, d => d.X)).range([0.0, 10]);
  const yScale = d3.scaleLinear().domain(d3.extent(trees, d => d.Y)).range([10, 0.0]);
  
  svg.append("g")
  .attr("id", "trees")
  .selectAll("circle")
  .data(trees)
  .enter()
  .append("circle")
  .attr("cx", d => xScale(d.X))
  .attr("cy", d => yScale(d.Y))
  .attr("r", 0.01)

  .on('mouseover', function(e, d) {
      infoPanel.text(`${d.ADDRESS} ${d.STREET}`);
      console.log("mouseover on", this);
      
      d3.select(this)
        .transition()
        .duration(1)
        .attr('r', 0.05)
        .attr('fill', 'Aqua');
    })
    .on('mouseout', function(d, i) {
      console.log("mouseout", this);
      d3.select(this)
        .transition()
        .duration(1)
        .attr('r', 0.01)
        .attr('fill', 'red');
    });
    
   
    
  return {svg: svg, xScale: xScale, yScale: yScale};
  }
  const {svg, xScale, yScale} = makeTrees();
  yield svg.node();
  const zoom = d3.zoom();
  const tree = svg.select("g#trees");
  const infoPanel = d3.select("#mytreeinfo");
  function zoomCalled(event) {
    
    const zx = event.transform.rescaleX(xScale);
    const zy = event.transform.rescaleY(yScale);
    tree.transition().duration(0).attr("transform", event.transform);
  }
  svg.call(zoom.on("zoom", zoomCalled))
 
  .on("mouseover", (e, d) => {infoPanel.text(`${d.ADDRESS} ${d.STREET}`);
  });
}


function _7(htl){return(
htl.html`<p><strong>Individual color tree:</strong>
<p> The tree below shows the tree-family distribution in Champaign, The different color representing the different <strong>tree family</strong>. `
)}

function* _8(d3,trees)
{
  const width = 600;
  const height = 600;
  const infoPanel = d3.select("#mytreeinfo");
  const svg = d3
  .create("svg")
  .attr("width", width)
  .attr("height", height)
  .attr("viewBox", [0.45, 0.18, 0.5, 0.45])
  .style("border", "solid 2px black");
  yield svg.node();
  
  
  // Note: aspect ratios!
  const xScale = d3.scaleLinear().domain(d3.extent(trees, d => d.X)).range([0.0, 1]);
  const yScale = d3.scaleLinear().domain(d3.extent(trees, d => d.Y)).range([1, 0.0]);
  const colorScale = d3.scaleOrdinal().domain(d3.group(trees, d => d.FAMILY)).range(d3.schemeCategory10);
  svg.selectAll("g")
  .data(d3.group(trees, d => d.FAMILY))
  .enter()
  .append("g")
  .attr("id", d => ""+d[0])
  .style("fill", d => colorScale(d[0]))
  .selectAll("circle")
  .data(d => d[1])
  .enter()
  .append("circle")
  .on("touchstart.zoom", null)
  .on("touchmove.zoom", null)
  .on("touchend.zoom", null)
  .attr("cx", d => xScale(d.X))
  .attr("cy", d => yScale(d.Y))
  .attr("r", 0.001);
}


function _9(md){return(
md`# Part two: Brushed selections of trees`
)}

function _10(htl){return(
htl.html`<p> In this part, we can brush select some trees, the total <strong>site number</strong> will be shown below the graph, also there have a bar chart to shows the site distribution.</p>`
)}

function _11(htl){return(
htl.html`<style>
  #treecircles circle {
    fill: green;
  }
  #treecircles circle.selected {
    fill: blue;
  }
</style>`
)}

function _12(htl){return(
htl.html`<p> For the style part, the unselected part will be green, while the selected part is blue.`
)}

function _13(htl){return(
htl.html`<p>We named our tree selection function below`
)}

function _selectTrees(d3,trees){return(
function (svg, selectedTrees) {
  svg.selectAll("rect").remove();
  const svgWidth = 400;
  const svgHeight = 200;
  const xScale = d3
    .scaleBand()
    .domain(d3.range(d3.max(trees, (d) => d.SITE)))
    .range([0, svgWidth])
    .paddingInner(0.1);
  const yScale = d3
    .scaleLog()
    .domain([1, selectedTrees.length])
    .range([0, svgHeight]);
  const binnedTrunks = d3.bin().value((d) => d.SITE)(selectedTrees);
  svg
    .selectAll("rect")
    .data(binnedTrunks)
    .enter()
    .append("rect")
    .attr("x", (d) => xScale(d.x0))
    .attr("y", yScale(0))
    .attr("width", xScale.bandwidth())
    .attr("height", (d) => yScale(d.length))
    .style("fill", "black");
}
)}

function* _15(d3,trees,selectTrees)
{
  const div = d3.create("div");
  const svgHeight = 400;
  const svgWidth = 400;
  const svg = div
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);
  const histSvg = div.append("svg").attr("width", svgWidth).attr("height", 200);
  const text = div.append("p");
  yield div.node();
  const xScale = d3
    .scaleLinear()
    .domain(d3.extent(trees, (d) => d.X))
    .range([0, svgWidth]);
  const yScale = d3
    .scaleLinear()
    .domain(d3.extent(trees, (d) => d.Y))
    .range([svgHeight, 0]);
  const treeDataPoints = svg
    .append("g")
    .attr("id", "treecircles")
    .selectAll("circle")
    .data(trees)
    .enter()
    .append("circle")
    .attr("cx", (d) => xScale(d.X))
    .attr("cy", (d) => yScale(d.Y))
    .attr("r", 2);
  const brush = d3.brush();
  svg
    .append("g")
    .attr("class", "brush")
    .call(
      brush.on("brush", (event) => {
        let count = 0;
        const selection = [
          [
            xScale.invert(event.selection[0][0]),
            yScale.invert(event.selection[0][1])
          ],
          [
            xScale.invert(event.selection[1][0]),
            yScale.invert(event.selection[1][1])
          ]
        ];
        let selectedTrees = [];
        treeDataPoints.classed("selected", (d) => {
          let isSelect =
            selection[0][0] <= d.X &&
            selection[1][0] >= d.X &&
            selection[0][1] >= d.Y &&
            selection[1][1] <= d.Y;
          if (isSelect) {
            count += 1;
            selectedTrees.push(d);
          }
          return isSelect;
        });
        selectTrees(histSvg, selectedTrees);
        text.text(`The total site number have been selected: ${count}`);
      })
    );
}


function _d3(require){return(
require("d3@6")
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["htl"], _2);
  main.variable(observer("trees")).define("trees", ["d3"], _trees);
  main.variable(observer()).define(["md"], _4);
  main.variable(observer()).define(["htl"], _5);
  main.variable(observer()).define(["d3","trees"], _6);
  main.variable(observer()).define(["htl"], _7);
  main.variable(observer()).define(["d3","trees"], _8);
  main.variable(observer()).define(["md"], _9);
  main.variable(observer()).define(["htl"], _10);
  main.variable(observer()).define(["htl"], _11);
  main.variable(observer()).define(["htl"], _12);
  main.variable(observer()).define(["htl"], _13);
  main.variable(observer("selectTrees")).define("selectTrees", ["d3","trees"], _selectTrees);
  main.variable(observer()).define(["d3","trees","selectTrees"], _15);
  main.variable(observer("d3")).define("d3", ["require"], _d3);
  return main;
}
