// user creates a new presentation to generate a form
angular.module('spkr.new-form', [])
  .controller('NewFormController', function ($scope, $location, $window, Auth, 
  	Pres) {
  
    $scope.$watch(Auth.isAuth, function(authed){
      if (authed) {
        $location.path('/new-form');
      } else {
        $location.path('/landing')
      } 
    }, true);

    $scope.submit = function(presentation){
    	
    	//console.log('in NewFormController#submit');
    	//console.log(Pres);
    	
    	Pres.createPresentation(presentation).then(function(data){
    		console.log(data);
    	});
    };

  })

