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


    $http.get('init.json').then(function(res) {
        $scope.data = res.data;
    });
    $http.get('ready-config.json').then(function(res) {
           $scope.config = res.data;
           console.log(res.data.A1)
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
        /*var something = window.open("data:text/json," + encodeURIComponent(JSON.stringify($scope.cart)),
            "_blank");
        something.focus();*/

        var config = [];

        $('#configurator input[type=radio]:checked').each(function(i) {
            if(!$(this).hasClass('None') && $(this).attr('id') != undefined) {
                var stuff = $(this).attr('id');
                var id = '#' + stuff;
                config.push(id);
                console.log(config);
            }
        });
        //config.splice(0,1);
        var something = window.open("data:text/json," + encodeURIComponent(JSON.stringify(config)),
            "_blank");
        something.focus();
    }

    $scope.useCase = function(choice) {
        $scope.disableButton(choice);
        $scope.enableButton();
    }

    $scope.readyConfig = function($event) {

            var runitem;

           if ($($event.currentTarget).attr('for') == "Entry") {
                runitem = $scope.config.A1;
                //alert('tets');
           } else if ($($event.currentTarget).attr('for') == "High") {
                runitem = $scope.config.A2;
            }

            //alert(runitem);

            angular.forEach(runitem, function(value, index) {
                //alert(value);
                console.log($(value))
                //$('#A2').prop('checked');
                setTimeout(function() {
                    $(value).trigger( "click" );
                },0,false);
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

            $scope.disableButton(button);
        }

        //recalulate 3rd party cost, this can be refactored by adding a type to each radio button village vs 3rd party.
        cart.vtcost = cart["2. ViCase"].cost + cart["3. ViDock"].cost;

        $scope.enableButton();
        //this should be done in a loop
        cart.thirdprtycost = cart["5. Accessories"].cost + cart["4. PC Parts"].cost;

        cart.vtcount = cart["2. ViCase"].count + cart ["3. ViDock"].count;
        cart.thirdprtycount = cart["4. PC Parts"].count + cart["5. Accessories"].count;
        console.log(cart.vtcount);
    }


    $scope.disableButton = function(button) {
        angular.forEach(button.Child_Name, function(value) {
            $(value).prop('disabled',true);
            alert(value);
        });
    }

    $scope.enableButton = function() {
         $('.well').each(function() {
          //Find the radio button that is not checked
          if (!$(this).is(':checked')) {
              alert('test2');
              var disableButtons = $(this).data('child');
              console.log(disableButtons);
              angular.forEach(disableButtons, function(value, index) {
                  //alert('test');
                  $(value).prop("disabled", false);
                  //$(value).find('span').removeClass('ghost');
              });
          }
        });
    }
 });