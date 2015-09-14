angular.module('spkr.presentations', [])
  .controller('PresentationsController', function($scope, $window, $location, Auth, Pres) {
    //gets the last value/word on the url
    $scope.root = window.location.href.slice(0,window.location.href.lastIndexOf('/'));
    //makes sure the user is still logged in and does not 
    $scope.$watch(Auth.isAuth, function(authed) {
      if (authed) {
        $location.path('/presentations');
      } else {
        $location.path('/')
      }
    }, true);
    //this disables the days before today's date when selecting the date with the date picker
    var today = new Date().toISOString().split('T')[0];
    document.getElementsByName("date")[0].setAttribute('min', today);

    $scope.submit = function(presentation){
      Pres.createPresentation(presentation).then(function(data, err){
        if(err) console.log(err);
        $scope.feedbackUrl = $scope.root + "/feedback-form/" + data.newPresentation.presentationid;
        $scope.getData();
        $scope.presentation = {};
      });
    };

    $scope.getData = function(){
      Auth.getAllData()
        .then(function(data){
          $scope.presentations = data.slice(1);
        })
        .catch(function(error){
          console.err(error)
        });
    };
    $scope.getData();
  })
