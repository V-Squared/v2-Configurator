var hello;
angular.module('configApp', []).controller('myCtrl', function($scope, $http) {
    //this can be pulled and put into a angular service
    $http.get('data.json')
       .then(function(res){
         $scope.data = res.data;

         var button_logic_Data = $scope.data[2].ViCase;

         $scope.buttonIdArray = [];

         angular.forEach(button_logic_Data,function(value,index){
            var hello = value.yourChoice
            angular.forEach(value.yourChoice,function (value,index){
                var buttonId = value.name.replace(/\s+/g,'-').toLowerCase();
                $scope.buttonIdArray.push(buttonId);
            });
            /*angular.forEach(value.Logic,function(value,index){
                console.log(value);

                $scope.logic = value;
            });*/
         });
         console.log($scope.buttonIdArray);
        });

      $scope.domloaded=function(){
        runjquery();
      };  

     

});


var runjquery=function(){
    $.getScript("js/test.js");
};

