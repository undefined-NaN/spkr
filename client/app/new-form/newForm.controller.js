// user creates a new presentation to generate a form
angular.module('spkr.new-form', [])
  .controller('NewFormController', function ($scope, $location, $window, Auth, 
  	Pres) {
  
    $scope.$watch(Auth.isAuth, function(authed){
      if (authed) {
        $location.path('/presentations/new');
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
    	});
    };

  })

