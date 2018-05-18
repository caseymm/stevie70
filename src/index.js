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

let attr = 'popularity';
let counter = 0;
 // 'loudness', 'speechiness', time_signature',
let stats = ['danceability', 'duration', 'energy', 'popularity', 'tempo', 'valence'];

let statsDesc = ['Danceability measures how suitable a track is for dancing and is scored based on the track\'s \
tempo, rhythm stability, beat strength, and overall regularity. The score is measured between 0 and 1, \
with 0 being the least danceable and 1 being the most danceable.',
'Duration of the track',
'Energy mesasures the intensity and activity of a track. It is valued from 0 to 1, with 0 representing \
the least energetic and 1 the most.',
'Popularity is measured between 0 and 100, with 100 being the most popular. The score is based on the total \
number of plays the track has combined with how recently the track was played.',
'The estimated tempo of the track in beats per minute (BPM).',
'Valence measures the musical positivity of a track. It is scored from 0 to 1. Tracks with a lower valence \
score are usually more negative (e.g. sad, depressed, angry), while tracks with a higher valence are usually \
more positive (e.g. happy, cheerful, euphoric).'];

// Danceability describes how suitable a track is for dancing based on a combination of musical elements
// including tempo, rhythm stability, beat strength, and overall regularity. A value of 0.0 is least
// danceable and 1.0 is most danceable.

// The duration of the track in milliseconds.

// Energy is a measure from 0.0 to 1.0 and represents a perceptual measure of intensity and activity.
// Typically, energetic tracks feel fast, loud, and noisy. For example, death metal has high energy,
// while a Bach prelude scores low on the scale. Perceptual features contributing to this attribute
// include dynamic range, perceived loudness, timbre, onset rate, and general entropy

// The popularity of a track is a value between 0 and 100, with 100 being the most popular.
// The popularity is calculated by algorithm and is based, in the most part, on the total number
// of plays the track has had and how recent those plays are.
// Generally speaking, songs that are being played a lot now will have a higher popularity than
// songs that were played a lot in the past.

// The overall estimated tempo of a track in beats per minute (BPM). In musical terminology, tempo
// is the speed or pace of a given piece and derives directly from the average beat duration.

// A measure from 0.0 to 1.0 describing the musical positiveness conveyed by a track. Tracks with high
// valence sound more positive (e.g. happy, cheerful, euphoric), while tracks with low valence sound
// more negative (e.g. sad, depressed, angry).

let selects = d3.selectAll('.song-stats');
selects.selectAll('option')
      .data(stats)
      .enter()
      .append('option')
      .html(d => { return d; });

selects.property('value', attr);
d3.selectAll('.stats-desc').html(() => {
  let idx = stats.indexOf(attr);
  return statsDesc[idx];
});

d3.select('#stevie-sel').on('change', d => {
  attr = d3.select('#stevie-sel').property('value');
  selects.property('value', attr);
  d3.selectAll('.stats-desc').html(() => {
    let idx = stats.indexOf(attr);
    return statsDesc[idx];
  });
  if(attr === 'duration'){
    attr = 'duration_ms';
  }
  allCharts.forEach(d => {
    redraw(d[0], d[1], d[2], d[3], d[4], d[5]);
  });
});
d3.select('#fm-sel').on('change', d => {
  attr = d3.select('#fm-sel').property('value');
  selects.property('value', attr);
  d3.selectAll('.stats-desc').html(() => {
    let idx = stats.indexOf(attr);
    return statsDesc[idx];
  });
  if(attr === 'duration'){
    attr = 'duration_ms';
  }
  allCharts.forEach(d => {
    redraw(d[0], d[1], d[2], d[3], d[4], d[5]);
  });
});

let allCharts = [];

// set the dimensions and margins of the graph
var margin = {top: 20, right: 0, bottom: 220, left: 30},
    width = 350 - margin.left - margin.right,
    height = 320 - margin.top - margin.bottom;

const drawBar = (error, fm, stevie, allTracks, attribution, duets) => {
  attribution.forEach(d => {
    d.lower = d.song.toLowerCase();
  });
  duets.forEach(d => {
    d.lower = d.song.toLowerCase().split(' (')[0];
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

    // set the ranges
    var x = d3.scaleBand()
              .range([0, width])
              .padding(0.02);
    var y = d3.scaleLinear()
              .range([height, 0]);

    let section = d3.select('#fleetwood-section .chart-section');
    let isStevie = false;
    if(stevieNicks.indexOf(album) > -1){
      section = d3.select('#stevie-section .chart-section');
      isStevie = true;
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

    defs.append('pattern')
       .attr('id', 'other_author_duet')
       .attr('patternUnits', 'userSpaceOnUse')
       .attr('width', 4)
       .attr('height', 4)
       .append('path')
       .attr('d', "M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2")
       .attr('style', 'stroke: #d142f4; fill: #ccc;');

    defs.append('pattern')
      .attr('id', 'co_author_duet')
      .attr('patternUnits', 'userSpaceOnUse')
      .attr('width', 4)
      .attr('height', 4)
      .append('path')
      .attr('d', "M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2")
      .attr('style', 'stroke: #41f49b; fill: #ccc;');

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
          if(isStevie){
            let attr = _.findWhere(duets, {'lower': d.name.toLowerCase().split(' (')[0]});
            if(attr){
              let str = 'bar';
              if(attr.author !== 'Nicks'){
                str += ' other-author';
              } else if(attr['co_authored'] !== 'NA'){
                str += ' co-authored';
              }
              if(attr.duet !== 'FALSE'){
                str += ' duet';
              }
              return str;
            } else {
              return 'bar';
            }
          } else {
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
          }
        })
        .attr("x", function(d) { return x(d.name); })
        .attr("width", x.bandwidth())
        .attr("y", function(d) { return y(d[attr]); })
        .attr("height", function(d) { return height - y(d[attr]); });

    // add the x Axis
    let xHolder = svg.append("g")
                     .classed('axis-bottom', true)
                     .attr("transform", "translate(0," + height + ")")
    xHolder.call(d3.axisBottom(x))
            .selectAll("text")
            .attr("y", 0)
            .attr("x", 15)
            .attr("dy", ".35em")
            .attr("transform", "rotate(90)")
            .style("text-anchor", "start");

    // add the y Axis
    let yHolder = svg.append("g")
    yHolder.call(d3.axisLeft(y).ticks(5));

    allCharts.push([svg, data, x, y, xHolder, yHolder]);

    // d3.interval(function(){
    //   redraw();
    // }, 1000);


  })
}

const redraw = (svg, data, x, y, xHolder, yHolder) => {
  // console.log('redraw', svg, data, attr)
  y.domain([0, d3.max(data, function(d) { return d[attr]; })]);
  if(attr === 'energy' || attr === 'danceability' || attr === 'valence'){
    y.domain([0, 1]);
  }
  // append the rectangles for the bar chart
  svg.selectAll(".bar")
      .data(data)
    .transition()
      .attr("x", function(d) { return x(d.name); })
      .attr("width", x.bandwidth())
      .attr("y", function(d) { return y(d[attr]); })
      .attr("height", function(d) { return height - y(d[attr]); });

  xHolder.call(d3.axisBottom(x))
          .selectAll("text")
          .attr("y", 0)
          .attr("x", 15)
          .attr("dy", ".35em")
          .attr("transform", "rotate(90)")
          .style("text-anchor", "start");

  let ticks = d3.axisLeft(y).ticks(5);
  if(attr === 'duration_ms'){
    ticks = d3.axisLeft(y).ticks(5).tickFormat(d => {
      // console.log(d, (d/1000)/60, Math.floor((d/1000)/60), (d/1000)%60)
      let minutes = Math.floor((d/1000)/60);
      let seconds = (d/1000)%60;
      if(seconds === 0){
        seconds = '00';
      }
      return `${minutes}:${seconds}`; });
  }

  yHolder.call(ticks);
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
           .attr('src', d => { return d.images[1]['url']; });

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
    .defer(d3.csv, `${window.location.href}build/assets/data/stevie_duets.csv`)
    .await(drawBar);
}

const getTopTracks = (error, fm_top, stevie_top, lindsey_top) => {
  fm_top['tracks'].forEach(track => {
    console.log(`${track.popularity},${track.name},${track.album.name}`);
  });

  console.log('');
  console.log('stevie');
  stevie_top['tracks'].forEach(track => {
    // console.log(track.popularity, track.name, track.album.name);
    console.log(`${track.popularity},${track.name},${track.album.name}`);
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