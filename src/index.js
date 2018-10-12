const d3 = Object.assign(require("d3"), require("d3-simple-slider"));
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

let songIds = ['id-0qjfjKFoP7LaqLI2KI9M1Q', 'id-67oVj9wKv1T0effsUcny7A'];
let currentSvgs = [];

const slugify = (string) => {
  return string.split(' ').join('-');
}

const formatDate = (date) => {
  // return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  return `${date.getFullYear()}`;
}

let keepers = [];

let fleetwoodMac = ["Fleetwood Mac",
                   "Rumours (Super Deluxe)",
                   "Tusk (Deluxe)",
                   "Mirage (Deluxe)",
                   "Tango In The Night (Deluxe)",
                   "Behind The Mask",
                   "The Dance",
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
// let statsMax = [.828, 422693, .977, 78, 206.293, .988];
let statsMax = [1, 422693, 1, 80, 206.293, 1];

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
  redrawSpeaker();
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
  redrawSpeaker();
});

let allCharts = [];

// set the dimensions and margins of the graph
var margin = {top: 20, right: 0, bottom: 220, left: 30},
    width = 350 - margin.left - margin.right,
    height = 320 - margin.top - margin.bottom;


let currentlyPlaying = false;

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
  // console.log(attribution);
  let selAlbums = keepers.map(d => d.name);

  selAlbums.forEach(album => {
    let data = fm[album];
    data = _.sortBy(data, 'track_number');
    data.forEach(d => {
      d.name = d.name.split(' - ')[0];
      d.popularity = allTracks[d.id]['pop'];
    });
    // console.log(data);
    if(album === 'Rumours (Super Deluxe)'){
      let silverSprings = _.findWhere(data, {'name': 'Silver Springs'});
      let idx = _.indexOf(data, silverSprings);
      data.splice(idx, 1);
    }

    // set the ranges
    var x = d3.scaleBand()
              .range([0, width])
              .padding(0.02);
    var y = d3.scaleLinear()
              .range([height, 0]);

    let section = d3.select('#fleetwood-section .chart-section');
    let isStevie = false;
    let artistClass = 'fleetwood';
    if(stevieNicks.indexOf(album) > -1){
      section = d3.select('#stevie-section .chart-section');
      isStevie = true;
      artistClass = 'stevie';
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
    chunk.append('h3').html(album.split(' (')[0]);
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
    x.domain(data.map(function(d) { return d.name.split(' (')[0]; }));
    // y.domain([0, d3.max(data, function(d) { return d[attr]; })]);
    y.domain([0, 80]);

    // append the rectangles for the bar chart
    svg.selectAll(".bar")
        .data(data)
      .enter().append("rect")
        .attr('id', d => { return `id-${d.id}`})
        .attr("class", d => {
          if(isStevie){
            let attr = _.findWhere(duets, {'lower': d.name.toLowerCase().split(' (')[0]});
            if(attr){
              // console.log(attr)
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
        .attr("x", function(d) { return x(d.name.split(' (')[0]); })
        .attr("width", x.bandwidth())
        .attr("y", function(d) { return y(d[attr]); })
        .attr("height", function(d) { return height - y(d[attr]); })
        .on('click', d => {
          if(d3.select(`.speaker-${d.id}`).node()){
            console.log('speaker exists - already selected');
            if(currentlyPlaying){
              d3.select(`#${artistClass}-audio audio`).node().pause();
            } else {
              d3.select(`#${artistClass}-audio audio`).node().play();
            }
          } else {
            console.log('new song selected');
            d3.select('#stevie-audio audio').node().pause();
            d3.select('#fleetwood-audio audio').node().pause();
            let barBox = d3.select(`#id-${d.id}`).node().getBBox();
            d3.selectAll(`.speaker-icon.${artistClass}`).remove();
            console.log(svg)
            svg.append('image')
               .classed(`speaker-icon playing ${artistClass} speaker-${d.id}`, true)
               .attr('xlink:href', `${window.location.href}build/assets/images/speaker.gif`)
               .attr('width', 20)
               .attr('height', 15)
               .attr('preserveAspectRatio', 'xMinYMin')
               .attr('x', barBox['x'] + (barBox['width'] - 20)/2)
               .attr('y', barBox['y'] - 20)

             svg.append('image')
                .classed(`speaker-icon paused ${artistClass} speaker-${d.id}`, true)
                .attr('xlink:href', `${window.location.href}build/assets/images/speaker_dark.png`)
                .attr('width', 20)
                .attr('height', 15)
                .attr('preserveAspectRatio', 'xMinYMin')
                .attr('x', barBox['x'] + (barBox['width'] - 20)/2)
                .attr('y', barBox['y'] - 20)
            let sourceNode = d3.select('#stevie-audio');
            if(isStevie){
              songIds[1] = `id-${d.id}`;
              currentSvgs[1] = svg;
              d3.select('#stevie-audio source').attr('src', d.preview_url);
              d3.select('#stevie-audio audio').node().load();
              d3.select('#stevie-audio audio').node().play();
            } else {
              songIds[0] = `id-${d.id}`;
              currentSvgs[0] = svg;
              sourceNode = d3.select('#fleetwood-audio');
              d3.select('#fleetwood-audio source').attr('src', d.preview_url);
              d3.select('#fleetwood-audio audio').node().load();
              d3.select('#fleetwood-audio audio').node().play();
            }
            sourceNode.select('.player-img img').attr('src', albumData.images[1]['url']);
            sourceNode.select('.song-title').html(d.name.split(' (')[0]);
            sourceNode.select('.album-title').html(`(${album.split(' (')[0]})`);
            let titleWidth = sourceNode.select('.song-title').node().getBoundingClientRect()['width'];
            let albumWidth = sourceNode.select('.album-title').node().getBoundingClientRect()['width'];
            sourceNode.select('.song-info').classed('marquee', false);
            if(titleWidth + albumWidth > d3.select('.chart-section').node().getBoundingClientRect()['width'] - 20){
              sourceNode.select('.song-info').classed('marquee', true);
            }
          }

        });

    // add the x Axis
    let xHolder = svg.append("g")
                     .classed('axis-bottom', true)
                     .attr("transform", "translate(0," + height + ")")
    xHolder.call(d3.axisBottom(x))
            .selectAll("text")
            .attr("y", 0)
            .attr("x", -15)
            .attr("dy", ".35em")
            .attr("transform", "rotate(270)")
            .style("text-anchor", "end");

    // add the y Axis
    let yHolder = svg.append("g")
    yHolder.call(d3.axisLeft(y).ticks(5));

    allCharts.push([svg, data, x, y, xHolder, yHolder]);

  })

  // console.log(allCharts);
  songIds.forEach((d, i) => {
    let barBox = d3.select(`#${d}`).node().getBBox();
    let artistClassInit = 'fleetwood';
    let svgA = allCharts[0][0];
    if(i === 1){
      artistClassInit = 'stevie';
      svgA = allCharts[3][0];
    }
    svgA.append('image')
       .classed(`speaker-icon playing ${artistClassInit}`, true)
       .style('display', 'none')
       .attr('xlink:href', `${window.location.href}build/assets/images/speaker.gif`)
       .attr('width', 20)
       .attr('height', 15)
       .attr('preserveAspectRatio', 'xMinYMin')
       .attr('x', barBox['x'] + (barBox['width'] - 20)/2)
       .attr('y', barBox['y'] - 20)

     svgA.append('image')
        .classed(`speaker-icon paused ${artistClassInit}`, true)
        .style('display', 'block')
        .attr('xlink:href', `${window.location.href}build/assets/images/speaker_dark.png`)
        .attr('width', 20)
        .attr('height', 15)
        .attr('preserveAspectRatio', 'xMinYMin')
        .attr('x', barBox['x'] + (barBox['width'] - 20)/2)
        .attr('y', barBox['y'] - 20)
  });

  currentSvgs = [allCharts[0][0], allCharts[3][0]];

}

let fleetwoodPlaying = false;

d3.select('#fleetwood-audio audio').on('pause', e => {
  console.log('paused');
  currentlyPlaying = false;
  d3.selectAll('.fleetwood.playing').style('display', 'none');
  d3.selectAll('.fleetwood.paused').style('display', 'block');
})

d3.select('#fleetwood-audio audio').on('play', e => {
  console.log('play');
  currentlyPlaying = true;
  d3.select('#stevie-audio audio').node().pause();
  d3.selectAll('.fleetwood.playing').style('display', 'block');
  d3.selectAll('.fleetwood.paused').style('display', 'none');
})

d3.select('#stevie-audio audio').on('pause', e => {
  console.log('paused');
  currentlyPlaying = false;
  d3.selectAll('.stevie.playing').style('display', 'none');
  d3.selectAll('.stevie.paused').style('display', 'block');
})

d3.select('#stevie-audio audio').on('play', e => {
  console.log('play');
  currentlyPlaying = true;
  d3.select('#fleetwood-audio audio').node().pause();
  d3.selectAll('.stevie.playing').style('display', 'block');
  d3.selectAll('.stevie.paused').style('display', 'none');
})

const redrawSpeaker = () => {
  d3.selectAll(`.speaker-icon.fleetwood`).remove();
  d3.selectAll(`.speaker-icon.stevie`).remove();
  setTimeout(function(){
    songIds.forEach((d, i) => {
      let barBox = d3.select(`#${d}`).node().getBBox();
      let artistClassInitA = 'fleetwood';
      let svgA = currentSvgs[0];
      if(i === 1){
        artistClassInitA = 'stevie';
        svgA = currentSvgs[1];
      }
      // should would could do transition here instead
      svgA.append('image')
         .classed(`speaker-icon playing ${artistClassInitA}`, true)
         .style('display', 'none')
         .attr('xlink:href', `${window.location.href}build/assets/images/speaker.gif`)
         .attr('width', 20)
         .attr('height', 15)
         .attr('preserveAspectRatio', 'xMinYMin')
         .attr('x', barBox['x'] + (barBox['width'] - 20)/2)
         .attr('y', barBox['y'] - 20)

       svgA.append('image')
          .classed(`speaker-icon paused ${artistClassInitA}`, true)
          .style('display', 'block')
          .attr('xlink:href', `${window.location.href}build/assets/images/speaker_dark.png`)
          .attr('width', 20)
          .attr('height', 15)
          .attr('preserveAspectRatio', 'xMinYMin')
          .attr('x', barBox['x'] + (barBox['width'] - 20)/2)
          .attr('y', barBox['y'] - 20)
    });
  }, 170);
}

const redraw = (svg, data, x, y, xHolder, yHolder) => {

  let phrase = attr;
  if(phrase === 'duration_ms'){
    phrase = 'duration';
  }
  // console.log('redraw', svg, data, attr)
  y.domain([0, statsMax[stats.indexOf(phrase)]]);
  // append the rectangles for the bar chart
  svg.selectAll(".bar")
      .data(data)
    .transition()
      .attr("x", function(d) { return x(d.name.split(' (')[0]); })
      .attr("width", x.bandwidth())
      .attr("y", function(d) { return y(d[attr]); })
      .attr("height", function(d) { return height - y(d[attr]); });

  xHolder.call(d3.axisBottom(x))
        .selectAll("text")
        .attr("y", 0)
        .attr("x", -15)
        .attr("dy", ".35em")
        .attr("transform", "rotate(270)")
        .style("text-anchor", "end");

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
                     "The Dance",
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
           .html(d => { return d.name.split(' (')[0]; })

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

d3.select(window).on('scroll', d => {
  const fLeg = d3.select('#fleetwood-legend').node().getBoundingClientRect();
  const fSect = d3.select('#fleetwood-section').node().getBoundingClientRect();
  const sLeg = d3.select('#stevie-legend').node().getBoundingClientRect();
  const sSect = d3.select('#stevie-section').node().getBoundingClientRect();
  console.log('fLeg[y] <= 0', fLeg['y'] <= 0, fLeg['y'])
  // console.log('Math.abs(fLeg[y]) <= fSect[height]', Math.abs(fLeg['y']) <= fSect['height'])
  // console.log('(fSect[y] - fLeg[height]*2) < 0', (fSect['y'] - fLeg['height']*2) < 0)
  // console.log('Math.abs(fSect[y]) <= fSect[height])', Math.abs(fSect['y']) <= fSect['height'])
  if(fLeg['y'] <= 0 && Math.abs(fLeg['y']) <= fSect['height'] && (fSect['y'] - fLeg['height']*2) < 0 && Math.abs(fSect['y']) <= fSect['height']){
    console.log('')
    console.log('sticky')
    d3.select('#fleetwood-legend').classed('sticky', true);
    d3.select('#fleetwood-holder').style('height', `${String(fLeg['height'])}px`).style('display', 'block');
  } else {
    console.log('not sticky')
    d3.select('#fleetwood-legend').classed('sticky', false);
    d3.select('#fleetwood-holder').style('display', 'none');
  }
  if(sLeg['y'] <= 0 && Math.abs(sLeg['y']) <= sSect['height'] && (sSect['y'] - sLeg['height']*2) < 0 && Math.abs(sSect['y']) <= sSect['height']){
    d3.select('#stevie-legend').classed('sticky', true);
    d3.select('#stevie-holder').style('height', `${String(sLeg['height'])}px`).style('display', 'block');
  } else {
    d3.select('#stevie-legend').classed('sticky', false);
    d3.select('#stevie-holder').style('display', 'none');
  }
});

d3.queue()
  .defer(d3.json, `${window.location.href}build/assets/data/fleetwood_albums.json`)
  .defer(d3.json, `${window.location.href}build/assets/data/stevie_nicks_albums.json`)
  .await(getAlbums);

// d3.queue()
//   .defer(d3.json, `${window.location.href}build/assets/data/fleetwood_top_tracks.json`)
//   .defer(d3.json, `${window.location.href}build/assets/data/stevie_top_tracks.json`)
//   .defer(d3.json, `${window.location.href}build/assets/data/lindsey_top_tracks.json`)
//   .await(getTopTracks);
