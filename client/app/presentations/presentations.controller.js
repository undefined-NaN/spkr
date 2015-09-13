angular.module('spkr.presentations', [])
  .controller('PresentationsController', function($scope, $window, $location, Auth, Pres) {

    $scope.$watch(Auth.isAuth, function(authed) {
      if (authed) {
        $location.path('/presentations');
      } else {
        $location.path('/')
      }
    }, true);

    var today = new Date().toISOString().split('T')[0];
    document.getElementsByName("date")[0].setAttribute('min', today);

    $scope.submit = function(presentation){
      Pres.createPresentation(presentation).then(function(data, err){
        if(err) console.log(err);
        $scope.feedbackUrl = "http://localhost:8000/#/feedback-form/" + data.newPresentation.presentationid;
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