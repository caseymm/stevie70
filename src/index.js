const d3 = require("d3");
const _ = require("underscore");

const months = ["Jaunuary",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December"];

// set the dimensions and margins of the graph
// var margin = {top: 20, right: 150, bottom: 30, left: 50},
//     width = 960 - margin.left - margin.right,
//     height = 150 - margin.top - margin.bottom;
//
// // array of curve functions and tites
// var curveArray = [
//     // {"d3Curve":d3.curveLinear,"curveTitle":"curveLinear"},
//     // {"d3Curve":d3.curveStep,"curveTitle":"curveStep"}
//     // {"d3Curve":d3.curveStepBefore,"curveTitle":"curveStepBefore"}
//     {"d3Curve":d3.curveStepAfter,"curveTitle":"curveStepAfter"}
//     // {"d3Curve":d3.curveBasis,"curveTitle":"curveBasis"},
//     // {"d3Curve":d3.curveCardinal,"curveTitle":"curveCardinal"},
//     // {"d3Curve":d3.curveMonotoneX,"curveTitle":"curveMonotoneX"},
//     // {"d3Curve":d3.curveCatmullRom,"curveTitle":"curveCatmullRom"}
//   ];
//
// // parse the date / time
// var parseTime = d3.timeParse("%d-%b-%y");
//
// // set the ranges
// var x = d3.scaleTime().range([0, width]);
// var y = d3.scaleLinear().range([height, 0]);
//
// // define the line
// var valueline = d3.line()
//     .curve(d3.curveCatmullRomOpen)
//     .x(function(d) { return x(d.date); })
//     .y(function(d) { return y(d.close); });
//
// // append the svg obgect to the body of the page
// // appends a 'group' element to 'svg'
// // moves the 'group' element to the top left margin
// var svg = d3.select("body").append("svg")
//     .attr("width", width + margin.left + margin.right)
//     .attr("height", height + margin.top + margin.bottom)
//   .append("g")
//     .attr("transform",
//           "translate(" + margin.left + "," + margin.top + ")");
//
// const renderStepChart = (error, data0) => {
//   // console.log(data);
//   let data = data0['Rumours (Deluxe)'];
//   data = _.sortBy(data, 'track_number');
//   let last = data[data.length - 1];
//   let tmp = {}
//   Object.assign(tmp, last);
//   tmp.name = 'dummy';
//   tmp.track_number = tmp.track_number + 1;
//   data.push(tmp);
//   console.log(data);
//   if (error) throw error;
//
//   // format the data
//   // data.forEach(function(d) {
//   //     d.date = parseTime(d.date);
//   //     d.close = +d.close;
//   // });
//
//   // set the colour scale
//   var color = d3.scaleOrdinal(d3.schemeCategory10);
//
//   curveArray.forEach(function(daCurve,i) {
//
//     // Scale the range of the data
//     x.domain(d3.extent(data, function(d) { return d.track_number; }));
//     // y.domain(d3.extent(data, function(d) { return d.tempo; }));
//     y.domain([0, d3.max(data, function(d) { return d.tempo; })]);
//
//     // Add the paths with different curves.
//     svg.append("path")
//       .datum(data)
//       .attr("class", "line")
//       .style("stroke", function() { // Add the colours dynamically
//               return daCurve.color = color(daCurve.curveTitle); })
//       .attr("id", 'tag'+i) // assign ID
//       .attr("d", d3.line()
//                    .curve(daCurve.d3Curve)
//                    .x(function(d) { return x(d.track_number); })
//                    .y(function(d) { return y(d.tempo); })
//                );
//
//     // Add the Legend
//     // svg.append("text")
//     //     .attr("x", width+5)  // space legend
//     //     .attr("y", margin.top + 20 + (i * 20))
//     //     .attr("class", "legend")    // style the legend
//     //     .style("fill", function() { // Add the colours dynamically
//     //         return daCurve.color = color(daCurve.curveTitle); })
//     //     .on("click", function(){
//     //         // Determine if current line is visible
//     //         var active   = daCurve.active ? false : true,
//     //         newOpacity = active ? 0 : 1;
//     //         // Hide or show the elements based on the ID
//     //         d3.select("#tag"+i)
//     //             .transition().duration(100)
//     //             .style("opacity", newOpacity);
//     //         // Update whether or not the elements are active
//     //         daCurve.active = active;
//     //         })
//     //     .text(daCurve.curveTitle);
//   });
//
//   // Add the scatterplot
//   svg.selectAll("block")
//       .data(data)
//     .enter().append("rect")
//       .attr("width", d => {
//         if(d.name === 'dummy'){
//           return 0;
//         } else {
//           return width/(data.length - 1);
//         }
//       })
//       .attr("height", d => {
//         if(d.name === 'dummy'){
//           return 0;
//         } else {
//           return height - y(d.tempo);
//         }
//       })
//       .attr("x", function(d) { return x(d.track_number); })
//       .attr("y", function(d) { return y(d.tempo); })
//       .attr("fill", "#ff0080");
//
//   // Add the X Axis
//   svg.append("g")
//       .attr("class", "axis")
//       .attr("transform", "translate(0," + height + ")")
//       .call(d3.axisBottom(x));
//
//   // Add the Y Axis
//   svg.append("g")
//       .attr("class", "axis")
//       .call(d3.axisLeft(y));
// }
//
// d3.queue()
//   .defer(d3.json, `${window.location.href}build/assets/data/fleetwood_master.json`)
//   .await(renderStepChart);

const slugify = (string) => {
  return string.split(' ').join('-');
}

const formatDate = (date) => {
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

let keepers = [];

let fleetwoodMac = ["Fleetwood Mac",
                   "Rumours (Super Deluxe)",
                   "Tusk (Deluxe)",
                   "Mirage (Deluxe)",
                   "Tango In The Night (Deluxe)",
                   "Behind The Mask",
                   // "The Dance",
                   "Say You Will",];

let stevieNicks = ["Bella Donna (Remastered)",
                   "The Wild Heart (Remastered)",
                   "Rock A Little",
                   "The Other Side Of The Mirror",
                   "Street Angel",
                   "Trouble In Shangri-La",
                   "In Your Dreams",
                   "24 Karat Gold - Songs From The Vault"];

const attr = 'popularity';

const drawBar = (error, fm, stevie, allTracks, attribution) => {
  attribution.forEach(d => {
    d.lower = d.song.toLowerCase();
  });
  Object.keys(stevie).forEach(song => {
    fm[song] = stevie[song];
  });
  console.log(attribution);
  let selAlbums = keepers.map(d => d.name);

  selAlbums.forEach(album => {
    let data = fm[album];
    data = _.sortBy(data, 'track_number');
    data.forEach(d => {
      d.name = d.name.split(' - ')[0];
      d.popularity = allTracks[d.id]['pop'];
    });
    console.log(data);
    // set the dimensions and margins of the graph
    var margin = {top: 20, right: 0, bottom: 220, left: 30},
        width = 350 - margin.left - margin.right,
        height = 320 - margin.top - margin.bottom;

    // set the ranges
    var x = d3.scaleBand()
              .range([0, width])
              .padding(0.02);
    var y = d3.scaleLinear()
              .range([height, 0]);

    let section = d3.select('#fleetwood-section .chart-section');
    if(stevieNicks.indexOf(album) > -1){
      section = d3.select('#stevie-section .chart-section');
    }

    let albumSect = section.append('div')
                      .classed('album', true)
                      .attr('id', `${slugify(album)}`);

    let albumData = _.findWhere(keepers, { 'name': album });

    let titleSect = albumSect.append('div').classed('holder', true);
    titleSect.append('div').classed('inset', true)
             .append('img')
             .attr('src', albumData['images'][0]['url']);

    let chunk = titleSect.append('div').classed('info', true);
    chunk.append('h3').html(album);
    chunk.append('h5').html(d => { return formatDate(albumData.js_date); });

    var svg = albumSect.append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");

    let defs = svg.append('defs')
    defs.append('pattern')
       .attr('id', 'both')
       .attr('patternUnits', 'userSpaceOnUse')
       .attr('width', 4)
       .attr('height', 4)
       .append('path')
       .attr('d', "M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2")
       .attr('style', 'stroke: #f44153; fill: #ccc;');

    defs.append('pattern')
        .attr('id', 'write')
        .attr('patternUnits', 'userSpaceOnUse')
        .attr('width', 4)
        .attr('height', 4)
        .append('path')
        .attr('d', "M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2")

    // Scale the range of the data in the domains
    x.domain(data.map(function(d) { return d.name; }));
    y.domain([0, d3.max(data, function(d) { return d[attr]; })]);
    // y.domain([0, 200]);

    // append the rectangles for the bar chart
    svg.selectAll(".bar")
        .data(data)
      .enter().append("rect")
        // .attr('fill', d => { return `rgba(7,73,181,.${d.mode})`})
        .attr("class", d => {
          // console.log(d.name, _.findWhere(attribution, {'song': d.name}))
          let attr = _.findWhere(attribution, {'lower': d.name.toLowerCase()});
          if(attr){
            if(attr.write === 'true' && attr.vocals === 'true'){
              return 'bar both';
            } else if(attr.write === 'true'){
              return 'bar write';
            } else {
              return 'bar vocals';
            }
          } else {
            return 'bar';
          }
        })
        .attr("x", function(d) { return x(d.name); })
        .attr("width", x.bandwidth())
        .attr("y", function(d) { return y(d[attr]); })
        .attr("height", function(d) { return height - y(d[attr]); });

    // add the x Axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
        // .attr("y", 15)
        // .attr("x", -10)
        // .attr("dy", "0em")
        // .attr("transform", "rotate(315)")
        // .attr("y", 0)
        // .attr("x", -15)
        // .attr("dy", ".35em")
        // .attr("transform", "rotate(270)")
        .attr("y", 0)
        .attr("x", 15)
        .attr("dy", ".35em")
        .attr("transform", "rotate(90)")
        .style("text-anchor", "start");

    // add the y Axis
    svg.append("g")
        .call(d3.axisLeft(y));
  })
}

// load all albums first
// need album name, release date, images

const getAlbums = (error, fmAlbums, stevieAlbums) => {
  let allAlbums = fmAlbums['items'].concat(stevieAlbums['items']);
  // console.log(allAlbums);
  const selAlbums = ["Fleetwood Mac",
                     "Rumours (Super Deluxe)",
                     "Tusk (Deluxe)",
                     "Mirage (Deluxe)",
                     "Tango In the Night (Deluxe)",
                     "Behind The Mask",
                     // "The Dance",
                     "Say You Will",
                     "Bella Donna (Remastered)",
                     "The Wild Heart (Remastered)",
                     "Rock A Little",
                     "The Other Side Of The Mirror",
                     "Street Angel",
                     "Trouble In Shangri-La",
                     "In Your Dreams",
                     "24 Karat Gold - Songs From The Vault"];

  allAlbums.forEach(album => {
    if(selAlbums.indexOf(album.name) > -1){
      album.js_date = new Date(album.release_date)
      keepers.push(album);
    }
  });
  keepers = _.sortBy(keepers, 'js_date');

  let timeline = d3.select('#album-timeline');
  let albumItem = timeline.selectAll('div')
                          .data(keepers)
                          .enter()
                          .append('div')
                          .attr('class', d => {
                            if(stevieNicks.indexOf(d.name) > -1){
                              return 'album-item stevie';
                            } else
                            {
                              return 'album-item fm';
                            }
                          })

  albumItem.append('div')
           .classed('image-div', true)
           .append('img')
           .attr('src', d => { return d.images[0]['url']; });

  let albumText = albumItem.append('div')
                           .classed('album-text', true);

  albumText.append('h3')
           .html(d => { return d.name; })

  albumText.append('h5')
          .html(d => { return formatDate(d.js_date); })



  d3.queue()
    .defer(d3.json, `${window.location.href}build/assets/data/fleetwood_master.json`)
    .defer(d3.json, `${window.location.href}build/assets/data/stevie_master.json`)
    .defer(d3.json, `${window.location.href}build/assets/data/all_tracks_master.json`)
    .defer(d3.csv, `${window.location.href}build/assets/data/stevie_attribution.csv`)
    .await(drawBar);
}

const getTopTracks = (error, fm_top, stevie_top, lindsey_top) => {
  fm_top['tracks'].forEach(track => {
    console.log(track.popularity, track.name, track.album.name);
  });

  console.log('');
  console.log('stevie');
  stevie_top['tracks'].forEach(track => {
    console.log(track.popularity, track.name, track.album.name);
  });

  console.log('');
  console.log('lindsey');
  lindsey_top['tracks'].forEach(track => {
    console.log(track.popularity, track.name, track.album.name);
  });
}

d3.queue()
  .defer(d3.json, `${window.location.href}build/assets/data/fleetwood_albums.json`)
  .defer(d3.json, `${window.location.href}build/assets/data/stevie_nicks_albums.json`)
  .await(getAlbums);

d3.queue()
  .defer(d3.json, `${window.location.href}build/assets/data/fleetwood_top_tracks.json`)
  .defer(d3.json, `${window.location.href}build/assets/data/stevie_top_tracks.json`)
  .defer(d3.json, `${window.location.href}build/assets/data/lindsey_top_tracks.json`)
  .await(getTopTracks);
