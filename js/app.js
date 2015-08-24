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


app.directive('buttondir',function() {
    return {
        restrict: 'A',
        scope : {
            directiveData : '=directivedata'
        },
        controller : function ($scope, $element, $timeout) {
            $timeout(function(){
                $($element).next().next().prepend('$' + $scope.directiveData[0] + " US - ");

                var children = $('.GalleryThumbNail > .thumb');
                for (var i = 0, l = children.length; i < l; i += 4) {
                    children.slice(i, i + 4).wrapAll('<div class="item"></div>');
                }

                $('.GallerySlideshow > .item:nth-child(1)').addClass('active');
                $('.GalleryThumbNail > .item:nth-child(1)').addClass('active');
            });
        }
    }
});

/*app.directive('datasheettabsdir', function() {
    return {
        restrict: 'A',
        scope : {
            directiveData : '=directivedata'
        },
        controller : function ($scope, $element, $timeout) {

            $timeout(function() {
                $element.bind('click',function() {
                    $scope.directiveData = 3;
                    alert($scope.directiveData);
                });
            });

            setTimeout(function() {
                alert($scope.directiveData);
            },10000);


            /*$timeout(function(){

                $scope.test = function(tabs) {
                    tabs +=1;
                    alert(tabs);
                    return tabs;
                }
            });
        }
    }
});*/


app.controller('myCtrl', function($scope, $http) {
    //this can be pulled and put into a angular service


    $http.get('products.json').then(function(res) {
        $scope.data = res.data;
    });
    $http.get('ready-config.json').then(function(res) {
           $scope.config = res.data;
           $scope.ready_config_High = $scope.config.High;
           $scope.ready_config_Entry = $scope.config.Entry;
       });
    $scope.cart = {
        count: 0,
        cost: 0,
        thirdprtycost: 0,
        vtcost: 0
    }; //this is the magic model,  as the data changes angular.js auto updated the HTML so you don't have to
    $scope.initGallery=function(galid){//inits the gallary
      //console.log("startging" +galid);
      setTimeout(function(){
       $($("#"+galid).find(".item")[0]).addClass("active");
     	 $("#"+galid).carousel();
      },1000);
    }

    $scope.makeJSON = function() {
        var something = window.open("data:text/json," + encodeURIComponent(JSON.stringify($scope.cart)),
            "_blank");
        something.focus();
    }

    $scope.readyConfig = function($event) {

           if ($($event.currentTarget).attr('for') == "Entry") {
                var runitem = $scope.ready_config_Entry;
            } else if ($($event.currentTarget).attr('for') == "High") {
                var runitem = $scope.ready_config_High;
            }
            angular.forEach(runitem, function(value, index) {
                // so this is your fix.  Because angular.js uses bound models to know when to update.  Your mixing in jquery which is looking for a .click event.  So I added a line to trigger a onclick event on each radio that is updated!
              setTimeout(function() {
              $(value).find('input[type=radio]').prop('checked', 'true').trigger('click');
                }, 0, false);
            });
        }

    $scope.initIndex = function(chapterIndex, SectionIndex, values) {
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
        $scope.cart[chapterIndex][SectionIndex]["data"][values] = false;


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
    $scope.radioClick = function(button, price, img, link, chapter, section, Item) {
        //console.log(arguments);
        cart = $scope.cart,
        chap = $scope.cart[chapter],
        sec = $scope.cart[chapter][section];

        if (sec["lastclicked"] != Item) { //if different item clicked
            if (sec["lastclicked"] != null && sec["lastclicked"] != "None") { //if not first selection

                cart.count--; //remove old count
                chap.count--; //remove old chapter count

                cart.cost -= sec.cost; //remove old cost
                chap.cost -= sec.cost; //remove old chapter cost
            }

            if (Item != "None") { //if not None

                price = $scope.priceToNum(price);


                cart.count++; //add back count
                chap.count++; //add back count

                cart.cost += price; //add new cost
                chap.cost += price; //remove old chapter cost
            }
            //update the model
            sec.lastclicked = Item;
            sec.lastclickedImg = img;
            sec.lastclickedLink = link;
            sec.cost = price;

        }



        //recalulate 3rd party cost, this can be refactored by adding a type to each radio button village vs 3rd party.
        cart.vtcost = cart["2. ViCase"].cost + cart["3. ViDock"].cost;

        //this should be done in a loop
        cart.thirdprtycost = cart["5. OS"].cost + cart["4. PC Parts"].cost;

        //console.log(cart);
    }
 });



 