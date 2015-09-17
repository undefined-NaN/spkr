var app = angular.module('spkr.previous-pres', ['ngRoute'])

  app.controller('PrevPresController', function ($scope, $location, $routeParams, Pres, Auth, Vis, WordCloud) {
    $scope.$watch(Auth.isAuth, function(authed) {
      if (authed) {
        $location.path('/presentations/history/'+$routeParams.id);
      } else {
        $location.path('/')
      }
    }, true);

        $scope.class = "glyphicon-plus-sign";
    
    $scope.changeClass = function(){
        if ($scope.class === "glyphicon-plus-sign")
            $scope.class = "glyphicon-minus-sign";
         else
            $scope.class = "glyphicon-plus-sign";
    };

    //get the data for this presentation
    Pres.getData($routeParams.id)
    .then(function(data){
      $scope.title = data.title;
      $scope.date  = data.date.slice(0,10);
      $scope.comments = [];
      $scope.feedbacks = data.feedbacks.length;
      if ($scope.feedbacks > 0) { //if the presentation has any feedbacks
        var criteria = data.criteria;
        //create an array or arrays filled with zeroes
        var distData = [];
        //Note: Scale is hardcoded here.
        for (var i = 0; i <= 7; i++) {
          distData[i] = [];
          for (var j = 0; j < criteria.length; j++) {
            distData[i][j] = 0;
          }
        }
        //count the number of times each score was given for each criteria
        data.feedbacks.forEach(function(feedback){
          feedback.scores.forEach(function(score,i){
            distData[score][i]++;
          });
          if ( feedback.comments ) {
            $scope.comments.push(feedback.comments);
          }
        });
        //call the presentationGraph factory function (this is where d3 happens)
        Vis.presentationGraph(criteria, distData);
        // Create a word cloud if any comments have been posted.
        if ( $scope.comments.length > 0 ) {
          WordCloud.makeCloud($scope.comments);
        }      
      }
      // Set a default message in case no comments have been posted.
      if ( $scope.comments.length === 0 ) {
        $scope.comments.push('No comments have been received.');
      }
    })
    .catch(function(error){
      $location.path('/data-profile')
    })

  });

  app.directive('slideable', function () {
    return {
        restrict: 'C',
        compile: function (element, attr) {
            // wrap tag
            var contents = element.html();
            element.html('<div class="slideable_content" style="margin:0 !important; padding:0 !important" >' + contents + '</div>');

            return function postLink(scope, element, attrs) {
                // default properties
                attrs.duration = (!attrs.duration) ? '1s' : attrs.duration;
                attrs.easing = (!attrs.easing) ? 'ease-in-out' : attrs.easing;
                element.css({
                    'overflow': 'hidden',
                        'height': '0px',
                        'transitionProperty': 'height',
                        'transitionDuration': attrs.duration,
                        'transitionTimingFunction': attrs.easing
                });
            };
        }
    };
})
    .directive('slideToggle', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var target = document.querySelector(attrs.slideToggle);
            attrs.expanded = false;
            element.bind('click', function () {
                var content = target.querySelector('.slideable_content');
                if (!attrs.expanded) {
                    content.style.border = '1px solid rgba(0,0,0,0)';
                    var y = content.clientHeight;
                    content.style.border = 0;
                    target.style.height = y + 'px';
                } else {
                    target.style.height = '0px';
                }
                attrs.expanded = !attrs.expanded;
            });
        }
    }
});