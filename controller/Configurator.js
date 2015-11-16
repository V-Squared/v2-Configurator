var app = angular.module('configApp', ['ngSanitize','ngAnimate']);

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

app.directive('datasheet',function() {
  return {
    restrict: "A",
    link : function(scope) {
      scope.tabs = 0;
      scope.addTabs = function(index) {
        scope.tabs = index;
        //alert($scope.tabs);
      }
    }
  }
});

app.directive('uibCollapse',function($animate) {
  return {
    restrict:'A',
    link: function(scope,element,attrs) {

      var duration = (attrs.duration || '0.2s');

      var padding = attrs.padding;

      function expand () {
        //I use dom to insert class instead of ng-class
        //is because ng-animate will also add the animate pre-fix to the class
        //if I use ng-class
        element
          .css({paddingBottom:padding,paddingTop:padding})
          .addClass('collapsing')
          .removeClass('collapse')

        $animate.addClass(element,'in',{
          to:{height: element[0].scrollHeight + 'px'},
          duration:duration
        }).then(expandDone);
      }

      function expandDone () {
        element
          .addClass('collapse')
          .removeClass('collapsing')
          .css({height:'auto'});
      }

      function collapse () {
        if (!element.hasClass('collapse') && !element.hasClass('in')) {
          return collapseDone();
        }

        //CAUTION : Must define css before adding class or weird things
        //will happen

        element
          .css({height: element[0].scrollHeight + 'px',paddingBottom: '0',paddingTop: '0'})
          .addClass('collapsing')
          .removeClass('collapse');


        $animate.removeClass(element,'in', {
          to:{height: '0'},
          duration:duration
        }).then(collapseDone);
      }

      function collapseDone () {
        element
          .addClass('collapse')
          .removeClass('collapsing')
          .css('height','0');

      }

      scope.$watch(attrs.uibCollapse,function(newCollapse) {
        if(newCollapse) {
          collapse();
        } else {
          expand();
        }
      })
    }
  }
});


app.controller('myCtrl', function($scope, $http) {
    $('[data-toggle="tooltip"]').tooltip();

    $scope.ChapterCollapse = true;
    $scope.SectionCollapse = true;
    $scope.ChoiceCollapse = false;

    //this can be pulled and put into a angular service

    $http.get('init.json').then(function(res) {
        $scope.data = res.data;
    });
    $http.get('ready-config.json').then(function(res) {
           $scope.config = res.data;
           //console.log(res.data.A1)
       });

    $scope.loadConfigField = "";

    $scope.cart = {
        count: 0,
        cost: 0,
        thirdprtycost: 0,
        vtcost: 0,
        vtcount: 0,
        thirdprtycount: 0
    }; //this is the magic model,  as the data changes angular.js auto updated the HTML so you don't have to
    $scope.initGallery=function(galid){//inits the gallary
      ////console.log("startging" +galid);
      setTimeout(function(){
       $($("#"+galid).find(".item")[0]).addClass("active");

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

        $('.Normal input[type=radio]:checked').each(function(i) {
            if(!$(this).hasClass('None') && $(this).attr('id') != undefined) {
                var stuff = $(this).attr('id');
                var id = '#' + stuff;
                config.push(id);
                //console.log(config);
            }
        });
        //config.splice(0,1);
        $scope.saveConfigField = config;
    }
   $scope.readyConfig = function($event,state) {

      if(state == true){

       var runitem = $scope.config.Performance[$($event.target).attr('for')];

       //alert(runitem);

       $scope.counter = $(".panel:not(:first)").find(".None").length;
       setTimeout(function() {
          $(".panel:not(:first)").find(".None").each(function() {//Reset App
               $(this).trigger("click");
               //console.log($scope.counter);
               if ($scope.counter <= 1) {//once everything is set to none then start ready now
                   //console.log("run now!");
                   angular.forEach(runitem, function(value, index) {
                           $(value).trigger("click");
                   });
               }
               --$scope.counter;
           });
       }, 0, false);

     } else {
      var runitem = $scope.config.Form_Factor[$($event.target).attr('for')];

      angular.forEach(runitem, function(value, index) {
          setTimeout(function() {
            $(value).trigger("click");
          },0,false);
      });
     }



   }

   $scope.loadConfig = function(test) {

      var runitem = test.replace(/[\[\]"]+/g,'')

      console.log(runitem);

      runitem = runitem.split(',');

      console.log(runitem);
      //alert(runitem);

        $scope.counter = $(".panel:not(:first)").find(".None").length;
        setTimeout(function() {
           $(".panel:not(:first)").find(".None").each(function() {//Reset App
                $(this).trigger("click");
                //alert($scope.counter);
                //console.log($scope.counter);
                if ($scope.counter <= 1) {//once everything is set to none then start ready now
                    //console.log("run now!");
                    angular.forEach(runitem, function(value, index) {
                            $(value).trigger("click");
                            //alert('test');
                    });
                }
                --$scope.counter;
            });
        }, 0, false);
     }

   $scope.Preview = function() {
    var caseSize = $scope.cart["ID-2"]["SID-13"].lastclicked;
    var FormFactor = $scope.cart["ID-1"]["SID-10"].lastclicked;
    $scope.Display_Number = $scope.cart["ID-1"]["SID-11"].lastclicked;
    $scope.img1 = caseSize + "-" + FormFactor + "-" + $scope.Display_Number + "-Front.jpg";
    $scope.img2 = caseSize + "-" + FormFactor + "-" + $scope.Display_Number + "-Rear.jpg";

    //console.log($scope.Display_Number);
   }

    $scope.initIndex = function(chapterIndex,chapterName, SectionIndex,SectionName, item, group) {
        ////console.log(arguments);

        //chapterIndex = chapter
        //SectionIndex = Section
        //values = radio button

        //alert(group);

        if (typeof $scope.cart[chapterIndex] === 'undefined') {
            $scope.cart[chapterIndex] = {};
            $scope.cart[chapterIndex].cost = 0; //chapter cost
            $scope.cart[chapterIndex].count = 0; //chapter cost
            $scope.cart[chapterIndex].name = chapterName;
        }
        if (typeof $scope.cart[chapterIndex][SectionIndex] === 'undefined') {
            $scope.cart[chapterIndex][SectionIndex] = {};
            $scope.cart[chapterIndex][SectionIndex]["lastclicked"] = null;
            $scope.cart[chapterIndex][SectionIndex]["lastclickedChildren"] = null;
            $scope.cart[chapterIndex][SectionIndex]["cost"] = 0;
            $scope.cart[chapterIndex][SectionIndex]["group"] = group;
            $scope.cart[chapterIndex][SectionIndex].name = SectionName;
        }
        if (typeof $scope.cart[chapterIndex][SectionIndex]["data"] === 'undefined') {
            $scope.cart[chapterIndex][SectionIndex]["data"] = {}; //this is what the checkboxes bind to
        }
        $scope.cart[chapterIndex][SectionIndex]["data"][item.name] = item.value;

        ////console.log($scope.cart);


        //console.log($scope.cart);
    }


    $scope.toggle = function($event,state) { //accordions
        var panel = $($event.currentTarget).next(".collapsable");
        var endstate = $(panel).slideToggle("fast", function() {
            if ($(panel).is(':visible')) {
                if(state) {
                  $($event.currentTarget).find('span').show();
                }
                $($event.currentTarget).find("i").addClass("fa-rotate-90");
              } else {
                if(state) {
                  $($event.currentTarget).find('span').hide();
                }
                $($event.currentTarget).find("i").removeClass("fa-rotate-90");
            }

        });
    }

    $scope.ViCaseProducts = [];
    $scope.ViCaseMain = [];
    $scope.ViCaseProductsTotal = 0;
    $scope.ViDockMain = [];
    $scope.ViDockProducts = [];
    $scope.ViDockProductsTotal = 0;


    function getProductArray (button,group,chapterPosition,sectionPosition) {

      var productArray = [];
      var mainArray = [];
      var total = 0;

      chapterPosition = parseInt(chapterPosition);

      if(chapterPosition > 0 && chapterPosition < 4 ) {
        productArray = $scope.ViCaseProducts;
        mainArray = $scope.ViCaseMain;
        total = $scope.ViCaseProductsTotal;
      }

      if(chapterPosition == 4){
        productArray = $scope.ViDockProducts;
        mainArray = $scope.ViDockMain;
        total = $scope.ViDockProductsTotal;
      }

      //button stuff
      var id = button.id,
          name = button.name,
          price = button.value;


      //add new group button
      var addProductKind = true;

      //delete last button in group variable
      var cutProductNumber = 0;
      var cutProductNumberState = false;

      //position
      var chapterPosition  = chapterPosition.toString(),
      sectionPosition = sectionPosition.toString();

      var position = chapterPosition + sectionPosition;

      position = parseInt(position);

      if(button.Main) {

        for(var i = 0; i < mainArray.length; i++) {

          var arrayItem = mainArray[i];

          if(mainArray[i].group == group) {
            mainArray.splice(i,3);
          }

        }

        for (var i = 0; i < button.Extra.length; i++) {
          if(addProductKind) {
            mainArray.push({
              id:id,
              name:name,
              price:button.Extra[i].price,
              group:group,
              position:position,
              PerkName:button.Extra[i].name,
              PerkLink:button.Extra[i].link,
              Discount:button.Extra[i].Discount
            });
          }
        };

        console.debug(mainArray);

        return;
      }

      total+=price;


      for(var i = 0; i < productArray.length; i++) {

        //I must declare this variable because I can't access
        //the item in if statement
        var thisArrayItem = productArray[i];

        //if the same button

        console.log(thisArrayItem);
        //if same group
        if(group == thisArrayItem.group) {
          productArray.splice(i,1);
          total-=thisArrayItem.price;
        }

      }

      //delete the prevois button in the same group

      //add new button for section
      if(addProductKind) {
        productArray.push({id:id,name:name,price:price,group:group,position:position});
      }


      if(chapterPosition > 0 && chapterPosition < 4) {
        $scope.ViCaseProductsTotal = total;
        $scope.ViCaseProducts = productArray;

      }

      if(chapterPosition == 4){
        $scope.ViDockProductsTotal = total;
      }

      console.debug($scope.ViCaseProducts);
    }

    $scope.priceToNum = function(value) {
        return Number(value.toString().replace(/[^0-9\.]+/g, ""));
    }
    $scope.radioClick = function(button,chapter, section,Child_Name,state,group,chapterPosition,sectionPosition) {
      ////console.log(Child_Name);
        //console.log(arguments);
        cart = $scope.cart,
        chap = $scope.cart[chapter],
        sec = $scope.cart[chapter][section];
        //alert(position);

        if (sec["lastclicked"] != button.name) { //if different item clicked
            if (sec["lastclicked"] != null && sec["lastclicked"] != "None") { //if not first selection

                if(state == 'disable button') {
                  $scope.enableButton(sec.lastclickedChildren,false);
                } else if(state == 'hide button') {
                  $scope.enableButton(sec.lastclickedChildren,true);
                }
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
            sec.lastclickedChildren=Child_Name;
            sec.lastclicked = button.name;
            sec.lastclickedImg = button.img;
            sec.lastclickedLink = button.link;
            sec.cost = button.value;

            if(state != 'hide section') {
            getProductArray(button,group,chapterPosition,sectionPosition);
          }

            //console.log($scope.cart);

            if (state == 'disable button') {
              $scope.disableButton(Child_Name,'disable button');
            } else if (state == 'hide button') {
              alert('test success');
              $scope.disableButton(Child_Name,'hide button');
            } else {
              $scope.disableButton(Child_Name,'hide section');
            }

        }

        //recalulate 3rd party cost, this can be refactored by adding a type to each radio button village vs 3rd party.
        cart.vtcost = cart["ID-2"].cost + cart["ID-3"].cost + cart["ID-4"].cost + cart["ID-5"].cost;

        //alert(cart.vtcost);

        $('.chicken').remove();
        //this should be done in a loop
        cart.thirdprtycost = cart["ID-6"].cost + cart["ID-7"].cost;

        cart.vtcount = cart["ID-2"].count + cart["ID-3"].count + cart["ID-4"].count + cart["ID-5"].count;
        cart.thirdprtycount = cart["ID-6"].count + cart["ID-7"].count;
        //console.log(cart.vtcount);
    }
    $scope.disabledButtons=[];//this is a counter to handle cases where a button is disabled by multiple options

    $scope.disableButton = function(button,state) {
     if(state == 'hide button'){
      $('.readyConfig').show();
     } else if (state == 'hide section') {
      $('.configirator-section').show();
     }

        angular.forEach(button, function(value) {
          //alert('test');

          if(state == 'hide button'){
            $(value).closest('div').hide();
            return;
          }

          if(state == 'hide section') {
            $(value).hide();
            return;
          }


           if($(value).is(':checked')) {
                //alert("uncheck "+value);
               setTimeout(function() {
                   $(value).closest(".readmore_area").children().last().find("input").trigger( "click" );//find None option in that section and click it
                   $(value).closest(".configirator-section").find('.col-sm-2').append('<img title="Top of the morning to y ladies" class="chicken" src="images/expansion/Attention-Phoenix-Sign-tbg-h80px.png">');
              },0,false);

           }

           $(value).prop('disabled',true);


            //alert("disable "+value);

          if(typeof $scope.disabledButtons[value] == 'undefined' ){//as buttons get disabled count how many options are disabling them
            $scope.disabledButtons[value]=1
          }else{
          	$scope.disabledButtons[value]+=1;
          }
        });
    }

    $scope.enableButton = function(button,state) {
         //$scope.cart[chapterIndex][SectionIndex]["lastclicked"]

         angular.forEach(button, function(value, index) {
                 if($scope.disabledButtons[value]>1){
                   //alert(value+ " Remains disabled for now");
                   $scope.disabledButtons[value]-=1;
                 }else{
                  $scope.disabledButtons[value]=0;
                 // alert("enable "+value);

                 if(state == false) {
                  $(value).prop("disabled", false);
                  //alert("enable "+value);
                 } else {
                  $(value).closest('div').show();
                 }

                  //alert(value);//$(value).find('span').removeClass('ghost');
                 }



         });

      /*
         $('.well').each(function() {
          //Find the radio button that is not checked
          if (!$(this).is(':checked')) {
              alert('test2');
              var disableButtons = $(this).data('child');
              //console.log(disableButtons);
              angular.forEach(disableButtons, function(value, index) {
                  //alert('test');
                  $(value).prop("disabled", false);
                  //$(value).find('span').removeClass('ghost');
              });
          }
        });*/
    }
 });
