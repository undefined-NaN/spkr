angular.module('spkr.homepage', [])
  .controller('HomepageController', function ($scope, $window, $location, Auth) {
    $scope.$watch(Auth.isAuth, function(authed){
      if (authed) {
        $location.path('/homepage');
      } else {
        $location.path('/landing')
      } 
    }, true);

    var scoresData=[
      {date:'01/03/13', scores:{'Organization':54, 'Clarity':66, 'Volume':58, 'Posture':42, 'Preperation':79, 'Visual Aids':88, 'Connection':20, 'Questions':33, 'Overall':59}},
      {date:'02/12/13', scores:{'Organization':57, 'Clarity':55, 'Volume':52, 'Posture':48, 'Preperation':82, 'Visual Aids':50, 'Connection':35, 'Questions':34, 'Overall':73}},
      {date:'06/13/13', scores:{'Organization':68, 'Clarity':70, 'Volume':49, 'Posture':45, 'Preperation':65, 'Visual Aids':42, 'Connection':29, 'Questions':45, 'Overall':44}},
      {date:'09/25/13', scores:{'Organization':85, 'Clarity':68, 'Volume':67, 'Posture':55, 'Preperation':77, 'Visual Aids':65, 'Connection':42, 'Questions':50, 'Overall':65}},
      {date:'03/14/14', scores:{'Organization':75, 'Clarity':85, 'Volume':59, 'Posture':67, 'Preperation':43, 'Visual Aids':70, 'Connection':47, 'Questions':64, 'Overall':88}},
      {date:'07/19/14', scores:{'Organization':77, 'Clarity':79, 'Volume':63, 'Posture':72, 'Preperation':70, 'Visual Aids':50, 'Connection':61, 'Questions':58, 'Overall':76}},
      {date:'11/01/14', scores:{'Organization':90, 'Clarity':82, 'Volume':70, 'Posture':80, 'Preperation':73, 'Visual Aids':82, 'Connection':72, 'Questions':73, 'Overall':80}},
      {date:'02/28/15', scores:{'Organization':81, 'Clarity':88, 'Volume':72, 'Posture':76, 'Preperation':78, 'Visual Aids':55, 'Connection':65, 'Questions':84, 'Overall':70}},
      {date:'05/17/15', scores:{'Organization':85, 'Clarity':98, 'Volume':65, 'Posture':82, 'Preperation':85, 'Visual Aids':78, 'Connection':59, 'Questions':90, 'Overall':95}},
      {date:'08/05/15', scores:{'Organization':95, 'Clarity':92, 'Volume':68, 'Posture':79, 'Preperation':90, 'Visual Aids':67, 'Connection':68, 'Questions':91, 'Overall':87}}
    ];

    var barColor = 'steelblue';
    function segColor(c){return {'Organization':"red", 'Clarity':"green", 'Volume':"orange", 'Posture':"grey", 'Preperation':"purple", 'Visual Aids':"cyan", 'Connection':"lightgreen", 'Questions':"pink", 'Overall':"maroon"}[c];}

    function dateChart(data){

      var DC = {};
      var DCDim = {t: 60, r: 0, b: 30, l: 0};
      DCDim.w = 1000 - DCDim.l - DCDim.r;
      DCDim.h = 250 - DCDim.t - DCDim.b;
          
      var DCsvg = d3.select('#dateChart').append("svg")
                    .attr("width", DCDim.w + DCDim.l + DCDim.r)
                    .attr("height", DCDim.h + DCDim.t + DCDim.b).append("g")
                    .attr("transform", "translate(" + DCDim.l + "," + DCDim.t + ")");

      var x = d3.scale.ordinal().rangeRoundBands([0, DCDim.w], 0.1)
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
        var st = scoresData.filter(function(s){ return s.date === d[0];})[0];
        var data = d3.keys(st.scores).map(function(s){ return [s,st.scores[s]]; }); 
        SC.update(data);
        $('#skill').text('Scores by Criteria for ' + d[0]);
      }
      
      function mouseout(d){   
        SC.update(dateAverage);
        $('#skill').text('Scores by Criteria for all Presentations');
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

      var SC = {};
      var SCDim = {t: 60, r: 0, b: 30, l: 0};
      SCDim.w = 1000 - SCDim.l - SCDim.r;
      SCDim.h = 250 - SCDim.t - SCDim.b;
          
      var DCsvg = d3.select('#skillChart').append("svg")
                    .attr("width", SCDim.w + SCDim.l + SCDim.r)
                    .attr("height", SCDim.h + SCDim.t + SCDim.b).append("g")
                    .attr("transform", "translate(" + SCDim.l + "," + SCDim.t + ")");

      var x = d3.scale.ordinal().rangeRoundBands([0, SCDim.w], 0.1)
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
          .attr("fill", function(d) { return segColor(d[0]); })
          .on("mouseover",mouseover)
          .on("mouseout",mouseout);

      bars.append("text").text(function(d){ return d3.format(",")(d[1])})
          .attr("x", function(d) { return x(d[0])+x.rangeBand()/2; })
          .attr("y", function(d) { return y(d[1])-5; })
          .attr("text-anchor", "middle");
      
      function mouseover(d){ 
        var data = scoresData.map(function(s){ return [s.date,s.scores[d[0]]]; });
        DC.update(data,segColor(d[0]));
        $('#date').text(d[0] + ' Score for each Presentation');     
      }
      
      function mouseout(d){   
        DC.update(skillsAverage,barColor);
        $('#date').text('Total Score for each Presentation');
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

    var dateAverage = ['Organization','Clarity','Volume','Posture','Preperation','Visual Aids','Connection','Questions','Overall'].map(function(d){ return [d,Math.round(d3.mean(scoresData.map(function(t){ return t.scores[d]; })))]; });    

    var skillsAverage = scoresData.map(function(d){return [d.date,Math.round((d.scores['Organization']+d.scores['Clarity']+d.scores['Volume']+d.scores['Posture']+d.scores['Preperation']+d.scores['Visual Aids']+d.scores['Connection']+d.scores['Questions']+d.scores['Overall'])/9)];});

    var DC = dateChart(skillsAverage);
    var SC = skillChart(dateAverage);

  });