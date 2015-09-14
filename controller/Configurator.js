var app = angular.module('configApp', []);

app.directive('navbar',function() {
    return {
        restrict: "E",
        replace: true,
        templateUrl:"templates/navbar.html"
    }
});

app.directive('jumbotron',function() {
    return {
        restrict: "E",
        replace: true,
        templateUrl:"templates/jumbotron.html"
    }
});


app.controller('myCtrl', function($scope, $http) {
    //this can be pulled and put into a angular service


    $http.get('products.json').then(function(res) {
        $scope.data = res.data;
    });
    $http.get('ready-config.json').then(function(res) {
           $scope.config = res.data;
       });
    $scope.cart = {
        count: 0,
        cost: 0,
        thirdprtycost: 0,
        vtcost: 0,
        vtcount: 0,
        thirdprtycount: 0
    }; //this is the magic model,  as the data changes angular.js auto updated the HTML so you don't have to
    $scope.initGallery=function(galid){//inits the gallary
      //console.log("startging" +galid);
      setTimeout(function(){
       $($("#"+galid).find(".item")[0]).addClass("active");
     	 $("#"+galid).carousel();

         var children = $('.GalleryThumbNail > .thumb');
         for (var i = 0, l = children.length; i < l; i += 4) {
             children.slice(i, i + 4).wrapAll('<div class="item"></div>');
         }

         $('.GallerySlideshow > .item:nth-child(1)').addClass('active');
         $('.GalleryThumbNail > .item:nth-child(1)').addClass('active');
      },1000);
    }

    $scope.makeJSON = function() {
        var something = window.open("data:text/json," + encodeURIComponent(JSON.stringify($scope.cart)),
            "_blank");
        something.focus();
    }

    $scope.readyConfig = function($event) {

            var runitem;

           //if ($($event.currentTarget).attr('fors') == "Entry") {
                runitem = $scope.config.A1;
            /*} else if ($($event.currentTarget).attr('fors') == "High") {
                runitem = $scope.config.A2;
            }*/

            alert(runitem);

            angular.forEach($scope.config.A1, function(value, index) {
                alert(value);
                console.log($(value))
                //$('#A2').prop('checked');
                $(value).prop('checked','true');
            });
        }

    $scope.initIndex = function(chapterIndex, SectionIndex, item) {
        //console.log(arguments);

        //chapterIndex = chapter
        //SectionIndex = Section
        //values = radio button

        if (typeof $scope.cart[chapterIndex] === 'undefined') {
            $scope.cart[chapterIndex] = {};
            $scope.cart[chapterIndex].cost = 0; //chapter cost
            $scope.cart[chapterIndex].count = 0; //chapter cost
        }
        if (typeof $scope.cart[chapterIndex][SectionIndex] === 'undefined') {
            $scope.cart[chapterIndex][SectionIndex] = {};
            $scope.cart[chapterIndex][SectionIndex]["lastclicked"] = null;
            $scope.cart[chapterIndex][SectionIndex]["cost"] = 0;
        }
        if (typeof $scope.cart[chapterIndex][SectionIndex]["data"] === 'undefined') {
            $scope.cart[chapterIndex][SectionIndex]["data"] = {}; //this is what the checkboxes bind to
        }
        $scope.cart[chapterIndex][SectionIndex]["data"][item.name] = item.value;

        //console.log($scope.cart);


        //console.log($scope.cart);
    }


    $scope.toggle = function($event) { //accordions
        var panel = $($event.currentTarget).next(".collapsable");
        var endstate = $(panel).slideToggle("fast", function() {
            if ($(panel).is(':visible')) {
                $($event.currentTarget).find("i").addClass("fa-rotate-90");
            } else {
                $($event.currentTarget).find("i").removeClass("fa-rotate-90");
            }

        });
    }

    $scope.priceToNum = function(value) {
        return Number(value.toString().replace(/[^0-9\.]+/g, ""));
    }
    $scope.radioClick = function(button,chapter, section) {
        //console.log(arguments);
        cart = $scope.cart,
        chap = $scope.cart[chapter],
        sec = $scope.cart[chapter][section];

        if (sec["lastclicked"] != button.name) { //if different item clicked
            if (sec["lastclicked"] != null && sec["lastclicked"] != "None") { //if not first selection

                cart.count--; //remove old count
                chap.count--; //remove old chapter count

                cart.cost -= sec.cost; //remove old cost
                chap.cost -= sec.cost; //remove old chapter cost
            }

            if (button.name != "None") { //if not None

                button.value = $scope.priceToNum(button.value);


                cart.count++; //add back count
                chap.count++; //add back count

                cart.cost += button.value; //add new cost
                chap.cost += button.value; //remove old chapter cost
            }
            //update the model
            sec.lastclicked = button.name;
            sec.lastclickedImg = button.img;
            sec.lastclickedLink = button.link;
            sec.cost = button.value;

        }



        //recalulate 3rd party cost, this can be refactored by adding a type to each radio button village vs 3rd party.
        cart.vtcost = cart["2. ViCase"].cost + cart["3. ViDock"].cost;

        //this should be done in a loop
        cart.thirdprtycost = cart["5. Accessories"].cost + cart["4. PC Parts"].cost;

        cart.vtcount = cart["2. ViCase"].count + cart ["3. ViDock"].count;
        cart.thirdprtycount = cart["4. PC Parts"].count + cart["5. Accessories"].count;
        console.log(cart.vtcount);
    }
 });



 