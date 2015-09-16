angular.module('spkr.previous-pres', ['ngRoute'])
  .controller('PrevPresController', function ($scope, $location, $routeParams, Pres, Auth, Vis) {
    $scope.$watch(Auth.isAuth, function(authed) {
      if (authed) {
        $location.path('/presentations/history/'+$routeParams.id);
      } else {
        $location.path('/')
      }
    }, true);

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
        for (var i = 0; i <= 100; i++) {
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
        if ( $scope.comments.length === 0 ) {
          $scope.comments.push('No comments have been received.');
        }
      }
    })

    .catch(function(error){
      $location.path('/data-profile')
    })

  });
