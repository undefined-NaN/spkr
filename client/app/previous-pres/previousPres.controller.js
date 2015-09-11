angular.module('spkr.previous-pres', ['ngRoute'])
  .controller('PrevPresController', function ($scope, $location, $routeParams, Pres, Auth) {

    $scope.$watch(Auth.isAuth, function(authed) {
      if (authed) {
        $location.path('/history/:id'+$routeParams.id);
      } else {
        $location.path('/')
      }
    }, true);

    Pres.getData($routeParams.id)
    .then(function(data){
      $scope.title = data.title;
      $scope.date  = data.date.slice(0,10);
      $scope.feedbacks = data.feedbacks.length;
      if ($scope.feedbacks > 0) {

        $('#distChart').append(
          '<h1>___________________________________________________</h1>' +
          '<h3>feedback score distribution</h3>'
        );

        var criteria = data.criteria;

        var distData = [];
        for (var i = 0; i <= 100; i++) {
          distData[i] = [];
          for (var j = 0; j < criteria.length; j++) {
            distData[i][j] = 0;
          }
        }

        data.feedbacks.forEach(function(feedback){
          feedback.scores.forEach(function(score,i){
            distData[score][i]++;
          });
        });
        
        function getPoints(_,i){ return _.map(function(d,j){ return {x:j, y:d[i]};}); }
        function getPointsZero(_,i,k){ return _.map(function(d,j){ return {x:j, y:(i===k ? d[i] : 0 )};}); }
          
        var width=800, height=200, margin=20;
        var colors = ["red","green","orange","grey","purple","cyan","lightgreen","pink","maroon"]

        function draw(){
          var maxT = d3.max(distData.map(function(d){ return d3.sum(d); }));
          
          function tW(d){ return x(d*(distData.length - 1)/50); }
          function tH(d){ return y(d*maxT/50); }
          
          var svg =d3.select("#distChart").select(".dist");
          
          var x = d3.scale.linear().domain([0, distData.length - 1]).range([0, width]);
          var y = d3.scale.linear().domain([0, maxT]).range([height, 0]);
          
          function getHLabel(d,i){ return i*10; } 
          
          svg.append("g").attr("class","hlabels")
            .selectAll("text").data(d3.range(100).filter(function(d){ return d%5===0})).enter().append("text")
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

        function transitionIn(p){
          var maxT = d3.max(distData.map(function(d){ return d3.sum(d); }));
          var max  = d3.max(distData.map(function(d){ return d[p]; }));
          
          var x = d3.scale.linear().domain([0, distData.length - 1]).range([0, width]);
          var y = d3.scale.linear().domain([0, max]).range([height, 0]);
          
          function tW(d){ return x(d*(distData.length - 1)/50); }
          function tH(d){ return y(d*maxT/50); }

          var area = d3.svg.area().x(function(d) { return x(d.x); })
            .y0(function(d) { return y(d.y0); })
            .y1(function(d) { return y(d.y0 + d.y); })
            .interpolate("basis");

          var layers = d3.layout.stack().offset("zero")(criteria.map(function(d,i){ return getPointsZero(distData, i, p);}));
          var svg = d3.select("#distChart").select(".dist");

          svg.selectAll("path").data(layers).transition().duration(500).attr("d", area);
        }

        function transitionOut(){
          var maxT = d3.max(distData.map(function(d){ return d3.sum(d); }));
          
          function tW(d){ return x(d*(distData.length - 1)/50); }
          function tH(d){ return y(d*maxT/50); }

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
          
        var legRow = d3.select("#distChart").append("div").attr("class","legend")
          .append("table").selectAll("tr").data(criteria).enter().append("tr").append("td");
        legRow.append("div").style("background",function(d,i){ return colors[i];})
          .on("mouseover",mouseoverLegend).on("mouseout",mouseoutLegend).style("cursor","pointer");
        legRow.append("span").text(function(d){ return d;})
          .on("mouseover",mouseoverLegend).on("mouseout",mouseoutLegend).style("cursor","pointer"); 

      }
    })
    .catch(function(error){
      $location.path('/profile')
    })

  });
