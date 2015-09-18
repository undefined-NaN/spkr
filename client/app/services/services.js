angular.module('spkr.services', [])

.factory('Auth', function ($http, $rootScope, $location, $window) {
  // Don't touch this Auth service!!!
  // it is responsible for authenticating our user
  // by exchanging the user's username and password
  // for a JWT from the server
  // that JWT is then stored in localStorage as 'com.spkr'
  // after you login/signup open devtools, click resources,
  // then localStorage and you'll see your token from the server
  var login = function (user) {
    console.log('inside login')
    return $http({

      method: 'POST',
      url: '/api/users/login',
      data: user
    })
    .then(function (res) {
      return res.data;
    });
  };

  var signup = function (user) {
    return $http({
      method: 'POST',
      url: '/api/users/signup',
      data: user
    })
    .then(function (res) {
      return res.data;
    });
  };

  var isAuth = function () {
    return !!$window.localStorage.getItem('com.spkr');
  };

  var signout = function () {
    $window.localStorage.removeItem('com.spkr');
    $window.localStorage.removeItem('userid');
    $rootScope.withBackground = true;
    $location.path('/');
  };

  var getAllData = function(){
    var userid = $window.localStorage.getItem('userid');
    return $http({
      method: 'GET',
      url: 'api/users/' + userid,
    }).then(function(res){
      return res.data;
    })
  };

// this is standard to return an object of these factory functions
  return {
    login: login,
    signup: signup,
    isAuth: isAuth,
    signout: signout,
    getAllData: getAllData
  };
})
// factory for feedback form 

.factory('FeedbackService', function ($http, $location, $window) {
    var submitFeedback = function(presentation) {
      console.log(presentation, " i am inside the factory")
      return $http({
        method: 'POST',
        url: 'api/feedback/',
        data: presentation
      }).then(function(res){
        return res.data;
      })
    };

    return {
      submitFeedback: submitFeedback
    };
})

.factory('Pres', function ($http, $location, $window) {
    var createPresentation = function(presentation) {
      var userid = $window.localStorage.getItem('userid');
      presentation.userid = userid;
      console.log('in Pres#createPresentation', presentation);
      return $http({
        method: 'POST',
        url: 'api/presentations/',
        data: presentation
      }).then(function(res){
        return res.data;
      })
    };

    var getData = function(id){
      return $http({
        method: 'GET',
        url: 'api/presentations/' + id,
      }).then(function(res){
        return res.data;
      })
    };

    return {
      createPresentation: createPresentation,
      getData: getData
    };
})

.factory('Vis', function ($http, $location, $window) {

  var homepageGraph = function(criteria, scoresData) {
    console.log(scoresData);
    
    var dateColor = 'steelblue';
    var skillColor = ["red","green","orange","grey","purple","cyan","lightgreen","pink","maroon"];

    //function to handle the date bar chart
    function dateChart(data){
      
      //add title
      $('#skill').text('scores by criteria for all presentations');

      var DC = {};
      var DCDim = {t: 15, r: 0, b: 30, l: 0};
      DCDim.w = 1000 - DCDim.l - DCDim.r;
      DCDim.h = 200 - DCDim.t - DCDim.b;
      
      //create svg for histogram
      var DCsvg = d3.select('#dateChart').append("svg")
                    .attr("width", DCDim.w + DCDim.l + DCDim.r)
                    .attr("height", DCDim.h + DCDim.t + DCDim.b).append("g")
                    .attr("transform", "translate(" + DCDim.l + "," + DCDim.t + ")");

      // create function for x-axis mapping
      var x = d3.scale.ordinal().rangeRoundBands([0, DCDim.w], 0.1, 0)
                .domain(data.map(function(d) { return d[0]; }));

      // Add x-axis to the histogram svg
      DCsvg.append("g").attr("class", "x axis")
           .attr("transform", "translate(0," + DCDim.h + ")")
           .call(d3.svg.axis().scale(x).orient("bottom"));
      
      // Create function for y-axis map
      var y = d3.scale.linear().range([DCDim.h, 0])
                .domain([0, d3.max(data, function(d) { return d[1]; })]);
      
      // Create bars for histogram to contain rectangles and freq labels
      var bars = DCsvg.selectAll(".bar").data(data).enter()
                      .append("g").attr("class", "bar");
      
      //create the rectangles
      bars.append("rect")
          .attr("x", function(d) { return x(d[0]); })
          .attr("y", function(d) { return y(d[1]); })
          .attr("width", x.rangeBand())
          .attr("height", function(d) { return DCDim.h - y(d[1]); })
          .attr('fill',dateColor)
          .on("mouseover",mouseover) // mouseover is defined below
          .on("mouseout",mouseout); // mouseout is defined below
          
      //Create the frequency labels above the rectangles
      bars.append("text").text(function(d){ return d3.format(",")(d[1])})
          .attr("x", function(d) { return x(d[0])+x.rangeBand()/2; })
          .attr("y", function(d) { return y(d[1])-5; })
          .attr("text-anchor", "middle");
      
      //utility function to be called on mouseover
      function mouseover(d){ 
        //filter for selected criteria and update the skill chart
        SC.update(scoresData.filter(function(s){return s.date === d[0];})[0].scores.map(function(s,i){return [criteria[i],s];}));
        //update title
        $('#skill').text('scores by criteria for "' + d[2] + '"');
      }
      
      //utility function to be called on mouseout
      function mouseout(d){
        //reset skill chart to original   
        SC.update(dateAverage);
        //reset title
        $('#skill').text('scores by criteria for all presentations');
      }
      
      //create function to update the date chart. This will be used by the skill chart
      DC.update = function(data, color){
        // update the domain of the y-axis map to reflect change in magnitured
        y.domain([0, d3.max(data, function(d) { return d[1]; })]);
        // Attach the new data to the bars
        var bars = DCsvg.selectAll(".bar").data(data);
        // transition the height and color of rectangles
        bars.select("rect").transition().duration(500)
            .attr("y", function(d) { return y(d[1]); })
            .attr("height", function(d) { return DCDim.h - y(d[1]); })
            .attr("fill", color);
        // transition the frequency labels location and change value
        bars.select("text").transition().duration(500)
            .text(function(d){ return d3.format(",")(d[1])})
            .attr("y", function(d) { return y(d[1])-5; });     
      }  
      return DC;
    }
    
    //function to handle the skill bar chart
    function skillChart(data){

      //add title
      $('#date').text('Total score for each presentation');

      var SC = {};
      var SCDim = {t: 15, r: 0, b: 30, l: 0};
      SCDim.w = 1000 - SCDim.l - SCDim.r;
      SCDim.h = 200 - SCDim.t - SCDim.b;
      
      //create svg for histogram
      var DCsvg = d3.select('#skillChart').append("svg")
                    .attr("width", SCDim.w + SCDim.l + SCDim.r)
                    .attr("height", SCDim.h + SCDim.t + SCDim.b).append("g")
                    .attr("transform", "translate(" + SCDim.l + "," + SCDim.t + ")");
      
      // create function for x-axis mapping
      var x = d3.scale.ordinal().rangeRoundBands([0, SCDim.w], 0.1, 0)
                .domain(data.map(function(d) { return d[0]; }));
      
      // Add x-axis to the histogram svg
      DCsvg.append("g").attr("class", "x axis")
           .attr("transform", "translate(0," + SCDim.h + ")")
           .call(d3.svg.axis().scale(x).orient("bottom"));
      
      // Create function for y-axis map
      var y = d3.scale.linear().range([SCDim.h, 0])
              .domain([0, d3.max(data, function(d) { return d[1]; })]);
      
      // Create bars for histogram to contain rectangles and freq labels
      var bars = DCsvg.selectAll(".bar").data(data).enter()
              .append("g").attr("class", "bar");
      
      //create the rectangles
      bars.append("rect")
          .attr("x", function(d) { return x(d[0]); })
          .attr("y", function(d) { return y(d[1]); })
          .attr("width", x.rangeBand())
          .attr("height", function(d) { return SCDim.h - y(d[1]); })
          .attr("fill", function(d) { return skillColor[criteria.indexOf(d[0])]; })
          .on("mouseover",mouseover)
          .on("mouseout",mouseout);
      
      //Create the frequency labels above the rectangles
      bars.append("text").text(function(d){ return d3.format(",")(d[1])})
          .attr("x", function(d) { return x(d[0])+x.rangeBand()/2; })
          .attr("y", function(d) { return y(d[1])-5; })
          .attr("text-anchor", "middle");
      
      //utility function to be called on mouseover
      function mouseover(d){ 
        //filter for selected presentation and update the date chart
        DC.update(scoresData.map(function(s){return [s.date,s.scores[criteria.indexOf(d[0])],s.title];}),skillColor[criteria.indexOf(d[0])]);
        //update title
        $('#date').text(d[0] + ' score for each presentation');     
      }
      
      //utility function to be called on mouseout
      function mouseout(d){   
        //reset skill chart to original   
        DC.update(skillsAverage,dateColor);
        //reset title
        $('#date').text('Total score for each presentation');
      }
      
      //create function to update the skill chart. This will be used by the date chart
      SC.update = function(data){
        // update the domain of the y-axis map to reflect change in magnitured
        y.domain([0, d3.max(data, function(d) { return d[1]; })]);
        // Attach the new data to the bars
        var bars = DCsvg.selectAll(".bar").data(data);
        // transition the height and color of rectangles
        bars.select("rect").transition().duration(500)
            .attr("y", function(d) {return y(d[1]); })
            .attr("height", function(d) { return SCDim.h - y(d[1]); });
        // transition the frequency labels location and change value
        bars.select("text").transition().duration(500)
            .text(function(d){ return d3.format(",")(d[1])})
            .attr("y", function(d) {return y(d[1])-5; });            
      }        
      return SC;
    }

 /* start d3-feature */
    /* BEGIN TEST */

    function lineChart() { //data is-> skillsAverage
      
      var LC = {};
      //add title
      $('#allTime').text('scores by criteria for all presentations over time');

      var data = [[
                        "2000",
                        "5"
                        
                    ], [
                        "2002",
                        "3"
                    ], [
                        "2003",
                        "7"
                    ], [
                        "2004",
                        "5"
                    ], [
                        "2004",
                        "2"
                    ]];
                    var data2 = [[
                        "2000",
                        "5"
                    ], [
                        "2002",
                        "5"
                    ], [
                        "2003",
                        "3"
                    ], [
                        "2004",
                        "7"
                    ], [
                        "2005",
                        "2"
                    ]];
                    var vis = d3.select("#visualisation"),
                        WIDTH = 400,
                        HEIGHT = 250,
                        MARGINS = {
                            top: 10,
                            right: 10,
                            bottom: 10,
                            left: 10
                        }
                        //create x and y scales and add to the axis
                        xScale = d3.scale.linear().range([MARGINS.left, WIDTH - MARGINS.right]).domain([2000, 2010]),
                        yScale = d3.scale.linear().range([HEIGHT - MARGINS.top, MARGINS.bottom]).domain([1,7]),
                        xAxis = d3.svg.axis()
                        .scale(xScale),
                        yAxis = d3.svg.axis()
                        .scale(yScale)
                        .orient("left");
                    
                    //add axis to svg
                    vis.append("svg:g")
                        .attr("class", "x axis")
                        .attr("transform", "translate(0," + (HEIGHT - MARGINS.bottom) + ")")
                        .call(xAxis);
                    vis.append("svg:g")
                        .attr("class", "y axis")
                        .attr("transform", "translate(" + (MARGINS.left) + ",0)")
                        .call(yAxis);

                    //create svg line path out of data
                    var lineGen = d3.svg.line()
                        .x(function(d) {
                          console.log(d, " :row in line svg")
                            return xScale(d[0]); // date
                        })
                        .y(function(d) {
                          console.log(d, " :col in line svg")
                            return yScale(d[1]); // score
                        })
                        .interpolate("basis");
                    vis.append('svg:path')
                        .attr('d', lineGen(data))
                        .attr('stroke', 'green')
                        .attr('stroke-width', 3)
                        .attr('fill', 'none');
                    vis.append('svg:path')
                        .attr('d', lineGen(data2))
                        .attr('stroke', 'blue')
                        .attr('stroke-width', 3)
                        .attr('fill', 'none');

      return LC;

    }


    /* END TEST */

      /* end-d3-feature */
    
    //create an array of arrays with the criteria and average score for each criteria
    var dateAverage = criteria.map(function(d,i){return [d,Math.round(d3.mean(scoresData.map(function(t){return t.scores[i];})))];});    
    console.log(dateAverage, " :date average, being fed to the skillchart")
    //create an array of arrays with the date, title, and average score for each presentation
    var skillsAverage = scoresData.map(function(d){return [d.date,Math.round(d3.mean(d.scores)),d.title]});
    console.log(skillsAverage, " :skills average, being fed into the lineChart (date chart)");
    //create an array of arrays with the date, title, and average score for each skill for each presentation
    var skillsAverageOverTime = scoresData.map(function(d){return [d.date,Math.round(d3.mean(d.scores)),d.title]});
    console.log(skillsAverage, " :skills average, being fed into the lineChart (date chart)");
    //create the date chart
    var DC = dateChart(skillsAverage);
    //create the skill chart
    var SC = skillChart(dateAverage);

    /* start line graph feature */

    //create an array of arrays with date, title and average score for each crieria for each presentation
    // var  allTimeSkillAverage = [];
    // //create the line graph
    // var LC = timeChart(allTimeSkillAverage);
    // var LC = lineChart(skillsAverage); //use this for testing. A single line chart.
    // lineChart();
    var LC = lineChart();
        /* end line graph feature */
  }

  var presentationGraph = function(criteria, distData) {
    
    //distribution functions for transforming the data
    function getPoints(_,i){ return _.map(function(d,j){ return {x:j, y:d[i]};}); }
    function getPointsZero(_,i,k){ return _.map(function(d,j){ return {x:j, y:(i===k ? d[i] : 0 )};}); }
      
    var width=800, height=200, margin=20;
    var colors = ["red","green","orange","grey","purple","cyan","lightgreen","pink","maroon"]

    //create distribution graph
    function draw(){
      var maxT = d3.max(distData.map(function(d){ return d3.sum(d); }));
      
      function tW(d){ return x(d*(distData.length - 1)/7); }
      
      var svg =d3.select("#distChart").select(".dist");
      
      //x and y axis maps
      var x = d3.scale.linear().domain([1, distData.length - 1]).range([0, width]);
      var y = d3.scale.linear().domain([0, maxT]).range([height, 0]);
      
      //graph labels
      function getHLabel(d,i){ return d; } 
      
      // add horizontal axis labels
      svg.append("g").attr("class","hlabels")
        .selectAll("text").data(d3.range(8)).enter().append("text")
        .text(getHLabel).attr("x",function(d,i){ return tW(d)-5;}).attr("y",height+14); 
      
      var area = d3.svg.area().x(function(d) { return x(d.x); })
        .y0(function(d) { return y(d.y0); })
        .y1(function(d) { return y(d.y0 + d.y); })
        .interpolate("basis");

      var layers = d3.layout.stack().offset("zero")(criteria.map(function(d,i){ return getPoints(distData, i);}));
      
      svg.selectAll("path").data(layers).enter().append("path").attr("d", area)
        .style("fill", function(d,i) { return colors[i]; })
        .style("stroke", function(d,i) { return colors[i]; });
    }
    
    //utility function for mouseover legend
    function transitionIn(p){
      var maxT = d3.max(distData.map(function(d){ return d3.sum(d); }));
      var max  = d3.max(distData.map(function(d){ return d[p]; }));
      
      var x = d3.scale.linear().domain([0, distData.length - 1]).range([0, width]);
      var y = d3.scale.linear().domain([0, max]).range([height, 0]);

      var area = d3.svg.area().x(function(d) { return x(d.x); })
        .y0(function(d) { return y(d.y0); })
        .y1(function(d) { return y(d.y0 + d.y); })
        .interpolate("basis");

      var layers = d3.layout.stack().offset("zero")(criteria.map(function(d,i){ return getPointsZero(distData, i, p);}));
      var svg = d3.select("#distChart").select(".dist");

      svg.selectAll("path").data(layers).transition().duration(500).attr("d", area);
    }

    //utility function for mouseout legend  
    function transitionOut(){
      var maxT = d3.max(distData.map(function(d){ return d3.sum(d); }));

      var x = d3.scale.linear().domain([0, distData.length - 1]).range([0, width]);
      var y = d3.scale.linear().domain([0, maxT]).range([height, 0]);

      var area = d3.svg.area().x(function(d) { return x(d.x); })
        .y0(function(d) { return y(d.y0); })
        .y1(function(d) { return y(d.y0 + d.y); })
        .interpolate("basis");
      var layers = d3.layout.stack().offset("zero")(criteria.map(function(d,i){ return getPoints(distData, i);}));
      
      var svg = d3.select("#distChart").select(".dist");   
      svg.selectAll("path").data(layers).transition().duration(500).attr("d", area);           
    }

    function mouseoverLegend(_,p){  
      transitionIn(p);
    }
 
    function mouseoutLegend(){  
      transitionOut();
    }

    d3.select("#distChart").append("svg").attr("width",width+2*margin).attr("height",height+2*margin)
      .append("g").attr("transform","translate("+margin+","+margin+")").attr("class","dist");

    draw();     
    
    //create legend
    var legRow = d3.select("#distChart").append("div").attr("class","legend")
      .append("table").selectAll("tr").data(criteria).enter().append("tr").append("td");
    legRow.append("div").style("background",function(d,i){ return colors[i];})
      .on("mouseover",mouseoverLegend).on("mouseout",mouseoutLegend).style("cursor","pointer");
    legRow.append("span").text(function(d){ return d;})
      .on("mouseover",mouseoverLegend).on("mouseout",mouseoutLegend).style("cursor","pointer"); 

  }
  return {
    homepageGraph: homepageGraph,
    presentationGraph: presentationGraph
  };

})

.factory('WordCloud', function() {

  var layout;
  var fill = d3.scale.category20();;

  function wordMap(comments) {
    // Takes an array of comments and maps to an array of objects with text and size
    comments = comments.reduce(function(a,b) {
      // Flatten the comments into one string
      return a + ' ' + b;
    })
    var stopWords = /^(i|me|my|myself|we|us|our|ours|ourselves|you|your|yours|yourself|yourselves|he|him|his|himself|she|her|hers|herself|it|its|itself|they|them|their|theirs|themselves|what|which|who|whom|whose|this|that|these|those|am|is|are|was|were|be|been|being|have|has|had|having|do|does|did|doing|will|would|should|can|could|ought|i'm|you're|he's|she's|it's|we're|they're|i've|you've|we've|they've|i'd|you'd|he'd|she'd|we'd|they'd|i'll|you'll|he'll|she'll|we'll|they'll|isn't|aren't|wasn't|weren't|hasn't|haven't|hadn't|doesn't|don't|didn't|won't|wouldn't|shan't|shouldn't|can't|cannot|couldn't|mustn't|let's|that's|who's|what's|here's|there's|when's|where's|why's|how's|a|an|the|and|but|if|or|because|as|until|while|of|at|by|for|with|about|against|between|into|through|during|before|after|above|below|to|from|up|upon|down|in|out|on|off|over|under|again|further|then|once|here|there|when|where|why|how|all|any|both|each|few|more|most|other|some|such|no|nor|not|only|own|same|so|than|too|very|say|says|said|shall)$/
    var punctuation = /[!"&()*+,-\.\/:;<=>?\[\\\]^`\{|\}~]+/g
    var wordSeparators = /[\s\u3031-\u3035\u309b\u309c\u30a0\u30fc\uff70]+/g
    var discard = /^(@|https?:)/
    var maxLength = 30


    function entries(map) {
      var entries = [];
      for (var text in map) entries.push({
        text: text,
        size: map[text]
      });
      return entries;
    }; 

    function parser(text) {
      var tags = {};
      var cases = {};
      text.split(wordSeparators).forEach(function(word) {
        if (discard.test(word)) return;
        word = word.replace(punctuation, "");
        if (stopWords.test(word.toLowerCase())) return;
        word = word.substr(0, maxLength);
        cases[word.toLowerCase()] = word;
        tags[word = word.toLowerCase()] = (tags[word] || 0) + 1;
      });
      tags = entries(tags).sort(function(a, b) { return b.size - a.size; });
      tags.forEach(function(d) { 
        d.text = cases[d.text];
        d.size = Math.pow(d.size, 1.5)*10;
      });
      return tags;
    }

    var result = parser(comments);
    return result;
  }

  function makeCloud(comments) {
    // Initialize the settings of the word cloud
    var mappedWords = wordMap(comments);
    console.log(mappedWords);
    layout = d3.layout.cloud()
        .size([400, 400])
        .words(mappedWords)
        .padding(5)
        .rotate(function() { return ~~(Math.random() * 2) * 90; })
        .font("Impact")
        .fontSize(function(d) { return d.size; })
        .on("end", draw);
    layout.start();
  }

  function draw(words) {
    // render the word cloud
    d3.select("#wordcloud").append("svg")
      .attr("width", layout.size()[0])
      .attr("height", layout.size()[1])
      .append("g")
      .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
      .selectAll("text")
      .data(words)
      .enter().append("text")
      .style("font-size", function(d) { return d.size + "px"; })
      .style("font-family", "Impact")
      .style("fill", function(d, i) { return fill(i); })
      .attr("text-anchor", "middle")
      .attr("transform", function(d) {
        return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
      })
      .text(function(d) { return d.text; });
  }
  return {
    makeCloud: makeCloud,
    commentWordSizes: wordMap
  };
})
