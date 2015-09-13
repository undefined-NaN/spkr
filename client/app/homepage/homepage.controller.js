angular.module('spkr.homepage', [])
  .controller('HomepageController', function ($scope, $window, $location, Auth) {

    $scope.$watch(Auth.isAuth, function(authed){
      if (authed) {
        $location.path('/data-profile');
      } else {
        $location.path('/')
      } 
    }, true);

    $scope.$on('$viewContentLoaded', function(){
      //view loaded do some stuff.
      $location.replace(); //clear last history route
    });

    Auth.getAllData()

    .then(function(data){

      $scope.user = data[0].username;

      if (data.length > 1) {

        var criteria = data[1].criteria;

        var scoresData = [];
        for (var i = 1; i < data.length; i++){
          if (data[i].feedbacks.length > 0) {
            var sums = [];
            for (var j = 0; j < criteria.length; j++){
              sums.push(0);
            }
            data[i].feedbacks.forEach(function(feedback){
              feedback.scores.forEach(function(score,i){
                sums[i] += parseInt(score);
              });
            });
            var avgs = sums.map(function(sum){return Math.round(sum/data[i].__v)});
            scoresData.push({date: data[i].date.slice(0,10), title: data[i].title, scores: avgs});
          }
        }

        if (scoresData.length === 0) {
          $("#fallbackMessage").append(
          "<h2>Oh no!</h2><p>It looks like you haven't recieved any feedback yet." +
          "  Make sure to give out your <a href='/#/presentations'>feedback form URL</a> to start recieving feedback!</p>")
        } else {

          scoresData.sort(function(a, b) {
            if (a.date > b.date) {
              return 1;
            }
            if (a.date < b.date) {
              return -1;
            }
            return 0;
          });

          var barColor = 'steelblue';
          var segColor = ["red","green","orange","grey","purple","cyan","lightgreen","pink","maroon"];

          function dateChart(data){

            $('#skill').text('scores by criteria for all presentations');

            var DC = {};
            var DCDim = {t: 15, r: 0, b: 30, l: 0};
            DCDim.w = 1000 - DCDim.l - DCDim.r;
            DCDim.h = 200 - DCDim.t - DCDim.b;
                
            var DCsvg = d3.select('#dateChart').append("svg")
                          .attr("width", DCDim.w + DCDim.l + DCDim.r)
                          .attr("height", DCDim.h + DCDim.t + DCDim.b).append("g")
                          .attr("transform", "translate(" + DCDim.l + "," + DCDim.t + ")");

            var x = d3.scale.ordinal().rangeRoundBands([0, DCDim.w], 0.1, 0)
                      .domain(data.map(function(d) { return d[0]; }));

            DCsvg.append("g").attr("class", "x axis")
                 .attr("transform", "translate(0," + DCDim.h + ")")
                 .call(d3.svg.axis().scale(x).orient("bottom"));

            var y = d3.scale.linear().range([DCDim.h, 0])
                      .domain([0, d3.max(data, function(d) { return d[1]; })]);

            var bars = DCsvg.selectAll(".bar").data(data).enter()
                            .append("g").attr("class", "bar");
            
            bars.append("rect")
                .attr("x", function(d) { return x(d[0]); })
                .attr("y", function(d) { return y(d[1]); })
                .attr("width", x.rangeBand())
                .attr("height", function(d) { return DCDim.h - y(d[1]); })
                .attr('fill',barColor)
                .on("mouseover",mouseover)
                .on("mouseout",mouseout);
                
            bars.append("text").text(function(d){ return d3.format(",")(d[1])})
                .attr("x", function(d) { return x(d[0])+x.rangeBand()/2; })
                .attr("y", function(d) { return y(d[1])-5; })
                .attr("text-anchor", "middle");
            
            function mouseover(d){  
              SC.update(scoresData.filter(function(s){return s.date === d[0];})[0].scores.map(function(s,i){return [criteria[i],s];}));
              $('#skill').text('scores by criteria for "' + d[2] + '"');
            }
            
            function mouseout(d){   
              SC.update(dateAverage);
              $('#skill').text('scores by criteria for all presentations');
            }
            
            DC.update = function(data, color){

              y.domain([0, d3.max(data, function(d) { return d[1]; })]);

              var bars = DCsvg.selectAll(".bar").data(data);
              
              bars.select("rect").transition().duration(500)
                  .attr("y", function(d) { return y(d[1]); })
                  .attr("height", function(d) { return DCDim.h - y(d[1]); })
                  .attr("fill", color);

              bars.select("text").transition().duration(500)
                  .text(function(d){ return d3.format(",")(d[1])})
                  .attr("y", function(d) { return y(d[1])-5; });     
            }  

            return DC;
          }

          function skillChart(data){

            $('#date').text('Total score for each presentation');

            var SC = {};
            var SCDim = {t: 15, r: 0, b: 30, l: 0};
            SCDim.w = 1000 - SCDim.l - SCDim.r;
            SCDim.h = 200 - SCDim.t - SCDim.b;
                
            var DCsvg = d3.select('#skillChart').append("svg")
                          .attr("width", SCDim.w + SCDim.l + SCDim.r)
                          .attr("height", SCDim.h + SCDim.t + SCDim.b).append("g")
                          .attr("transform", "translate(" + SCDim.l + "," + SCDim.t + ")");

            var x = d3.scale.ordinal().rangeRoundBands([0, SCDim.w], 0.1, 0)
                      .domain(data.map(function(d) { return d[0]; }));

            DCsvg.append("g").attr("class", "x axis")
                 .attr("transform", "translate(0," + SCDim.h + ")")
                 .call(d3.svg.axis().scale(x).orient("bottom"));

            var y = d3.scale.linear().range([SCDim.h, 0])
                    .domain([0, d3.max(data, function(d) { return d[1]; })]);

            var bars = DCsvg.selectAll(".bar").data(data).enter()
                    .append("g").attr("class", "bar");
            
            bars.append("rect")
                .attr("x", function(d) { return x(d[0]); })
                .attr("y", function(d) { return y(d[1]); })
                .attr("width", x.rangeBand())
                .attr("height", function(d) { return SCDim.h - y(d[1]); })
                .attr("fill", function(d) { return segColor[criteria.indexOf(d[0])]; })
                .on("mouseover",mouseover)
                .on("mouseout",mouseout);

            bars.append("text").text(function(d){ return d3.format(",")(d[1])})
                .attr("x", function(d) { return x(d[0])+x.rangeBand()/2; })
                .attr("y", function(d) { return y(d[1])-5; })
                .attr("text-anchor", "middle");
            
            function mouseover(d){ 
              DC.update(scoresData.map(function(s){return [s.date,s.scores[criteria.indexOf(d[0])],s.title];}),segColor[criteria.indexOf(d[0])]);
              $('#date').text(d[0] + ' score for each presentation');     
            }
            
            function mouseout(d){   
              DC.update(skillsAverage,barColor);
              $('#date').text('Total score for each presentation');
            }
            
            SC.update = function(data){

              y.domain([0, d3.max(data, function(d) { return d[1]; })]);
              
              var bars = DCsvg.selectAll(".bar").data(data);
              
              bars.select("rect").transition().duration(500)
                  .attr("y", function(d) {return y(d[1]); })
                  .attr("height", function(d) { return SCDim.h - y(d[1]); });

              bars.select("text").transition().duration(500)
                  .text(function(d){ return d3.format(",")(d[1])})
                  .attr("y", function(d) {return y(d[1])-5; });            
            }        

            return SC;
          }

          var dateAverage = criteria.map(function(d,i){return [d,Math.round(d3.mean(scoresData.map(function(t){return t.scores[i];})))];});    
          var skillsAverage = scoresData.map(function(d){return [d.date,Math.round(d3.mean(d.scores)),d.title]});
          var DC = dateChart(skillsAverage);
          var SC = skillChart(dateAverage);    
        }
      
      } else {
        $("#fallbackMessage").append(
          "<h2>Oh no!</h2><p>It looks like you haven't made any presentations yet.  <a href='/#/presentations'>Create</a> your first presentation to start recieving feedback!</p>")
      }
    })

    .catch(function(error){
      console.err(error)
    })

  });
