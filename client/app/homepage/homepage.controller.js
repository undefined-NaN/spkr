angular.module('spkr.homepage', [])
  .controller('HomepageController', function ($scope, $window, $location, Auth, Vis) {

    $scope.$watch(Auth.isAuth, function(authed){
      if (authed) {
        $location.path('/data-profile');
      } else {
        $location.path('/')
      } 
    }, true);
    
    //get all the user's data
    Auth.getAllData()
    .then(function(data){
      //the first element of the array conatains the username, 
      //the remaining elements are presentations
      $scope.user = data[0].username;
      if (data.length > 1) { //if the user has any presentations
        //get the criteria list from the first presentation (since they are all the same)
        var criteria = data[1].criteria;
        //create an array of objects for each presentation which includes the date, title, and average score for each criteria
        var scoresData = [];
        for (var i = 1; i < data.length; i++){
          if (data[i].feedbacks.length > 0) { //only add the presentations with feedbacks
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
        //sort the scoresData by date
        scoresData.sort(function(a, b) {
          if (a.date > b.date) {
            return 1;
          }
          if (a.date < b.date) {
            return -1;
          }
          return 0;
        });
        if (scoresData.length === 0) { //if there are no presentations with feedbacks
          $("#fallbackMessage").append(
          "<h2>Oh no!</h2><p>It looks like you haven't recieved any feedback yet." +
          "  Make sure to give out your <a href='/#/presentations'>feedback form URL</a> to start recieving feedback!</p>")
        } else {
          //call the homepageGraph factory function (this is where d3 happens)
          Vis.homepageGraph(criteria, scoresData);
        }
      } else { //if the user doesn't have any presentations
        $("#fallbackMessage").append("<h2>Oh no!</h2><p>It looks like you haven't made any presentations yet.  <a href='/#/presentations'>Create</a> your first presentation to start recieving feedback!</p>")
      }
    })
    .catch(function(error){
      console.err(error)
    })
  });
