var app = angular.module('configApp', []);

app.directive('navbar',function() {
    return {
        restrict: "E",
        templateUrl:"templates/navbar.html"
    }
});

app.directive('jumbotron',function() {
    return {
        restrict: "E",
        templateUrl:"templates/jumbotron.html"
    }
});


app.directive('buttondir',function() {
    return {
        restrict: 'A',
        controller : function ($scope, $element, $timeout) {
            var price = $scope.choice.value;
            $timeout(function() {
                $($element).next().prepend("$" + price + " US - ");
            });
        }
    }
});

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

    $scope.initIndex = function(chapterIndex, SectionIndex, values) { //this function builds object that stores selections. We can save/load this from json later
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
        cart.thirdprtycost = cart["5. OS & Apps"].cost + cart["4. PC Parts"].cost;

        //console.log(cart);
    }




    //kickoff jquery stuff basically just the accordion
    //   setTimeout(function() {
    //     runjquery($scope);

    //  }, 1500);




});






/*

               .               ,.
                  T."-._..---.._,-"/|
                  l|"-.  _.v._   (" |
                  [l /.'_ \; _~"-.`-t
                  Y " _(o} _{o)._ ^.|
                  j  T  ,-<v>-.  T  ]
                  \  l ( /-^-\ ) !  !
                   \. \.  "~"  ./  /c-..,__
                     ^r- .._ .- .-"  `- .  ~"--.
                      > \.                      \
                      ]   ^.                     \
                      3  .  ">            .       Y  -Sorry for commenting out the the jquery :(  - Andrew
         ,.__.--._   _j   \ ~   .         ;       |
        (    ~"-._~"^._\   ^.    ^._      I     . l
         "-._ ___ ~"-,_7    .Z-._   7"   Y      ;  \        _
            /"   "~-(r r  _/_--._~-/    /      /,.--^-._   / Y
            "-._    '"~~~>-._~]>--^---./____,.^~        ^.^  !
                ~--._    '   Y---.                        \./
                     ~~--._  l_   )                        \
                           ~-._~~~---._,____..---           \
                               ~----"~       \
                                              \

var wasAPresetSelected = function(element) {
    var runitem;
    if ($(element).attr('for') == "Entry") {
        runitem = ready_config_Entry;
    } else if ($(element).attr('for') == "High") {
        runitem = ready_config_High;
    }
    console.log(runitem);
    angular.forEach(runitem, function(value, index) {
        // so this is your fix.  Because angular.js uses bound models to know when to update.  Your mixing in jquery which is looking for a .click event.  So I added a line to trigger a onclick event on each radio that is updated!
        $(value).find('input[type=radio]').prop('checked', 'true').trigger('click');
    });
    if (runitem.length > 0) {
        return true;
    }
    return false;
};

var updateClickedElementImage = function(element) {
    //get the clicked radio button
    var findImg = $(element).closest('.col-sm-8').prev('.col-sm-2');
    imageUrl = $(element).attr('imgAttr');

    // this block seems unecassary.  why not just put the <img> tag in the template with a ng-if to hide it if image = null.
    if (!$(element).hasClass('None')) {
        if (findImg.hasClass('noImg')) {
            findImg.removeClass('noImg');
            findImg.append('<img>');
            findImg.find('img').attr('src', imageUrl);
        } else {
            findImg.find('img').attr('src', imageUrl);
        }
    } else {
        findImg.find('img').remove();
        findImg.addClass('noImg');
    }
};

function SetPricing(element) {
    var priceString = "";
    if (!$(element).hasClass('None')) {
        priceString = $(element).val();
        $(element).next('span').prepend("$" + priceString + " US - ");
    }
}
/*
//This function disable buttons the radio buttons according to the radio button selected previosly
function disableButtons(element, selectedText, Section_Name) {

    //this get the array atribute from the current selected radio button.
    //it is a array because It is possible sometimes I want to disable 2 radio buttons.
    var disableButtons = $(element).data('child');


    //this loop through the array.
    angular.forEach(disableButtons, function(value, index) {
        //find the radio button and disable it
        $(value).find('input[type=radio]').prop("disabled", true);
        //find the radio button and add class ghost to et the text also gray out
        $(value).find('span').addClass('ghost');
        //I add the tooltip so the customor will know what
        var Choice_Tooltip = "To enable this item, please select a choice other than " + selectedText + " in " + Section_Name;
        // This add the tooltip to the radio button that is disabled
        $(value).find('span').attr('title', Choice_Tooltip);
        //this checked the condistion if the radio button i want to disabled is checked
        if ($(value).find('input').is(':checked')) {
            //if it's checked, add the Phoenix-Sign image
            $(value).closest('.col-sm-8').prev().find('img').attr('src', 'images/expansion/Attention-Phoenix-Sign-tbg-h80px.png').addClass('alert-image');
            // I also add a tooltip for that image
            $(value).closest('.col-sm-8').prev().find('img.alert-image').attr('title', 'You changed your choice in another related part which was not compatible with your choice in this part. Please make new choice. Not available choices are ghosted. The tooltip of the ghosted choice will tell you why')
                //this checked none in that section
            $(value).closest('.readmore_area').find('.None').prop('checked', true);
        }
    });
}

function enableButtons(element) {
    //Loop through all the radio buttons (including the radio button that is not selected).
    $('input[type=radio]').each(function() {
        //Find the radio button that is not checked
        if (!$(this).is(':checked')) {
            var disableButtons = $(this).data('child');
            angular.forEach(disableButtons, function(value, index) {
                $(value).find('input[type=radio]').prop("disabled", false);
                $(value).find('span').removeClass('ghost');
            });
        }
    });
}

function CaculateCost(element, chapters) {
    var total = 0;
    $(chapters + ' input[type=radio]:checked, select option:selected').each(function() {
        total += parseInt($(this).val());
    });
    var totalString = '$' + total;
    return totalString;

}

function superSummary(chapter, variable) {
    $(chapter + ' input[type=radio]:checked').each(function() {
        var selectedText = $(this).next('span').text();

        if (!$(this).hasClass('None')) {
            variable += selectedText + "<br/>";
        }
    });
    return variable;
}

var seletedCheckoutLink = "";

function Checkout(element, selectedText, checkoutResultString) {
    if (!$(element).hasClass('None')) {
        seletedCheckoutLink = $(element).attr('checkout');
        checkoutResultString += '<a href="' + seletedCheckoutLink + '">' + selectedText + '</a>' + '<br/>';
    }
    return checkoutResultString;
}

function UpdateTotals(result) {
    //find all selected


    //check the length if it is not zero
    if (result.length > 0) {
        //this is the variable in that hold the value of how many items in card
        var radioCheckedNumber = result.length + " items in cart<br>";
        // This is the summary string in the checkout
        var checkoutResultString = "";
        //this is the total price
        //I will explain this later
        var noneNumber = 0;
        //this is the total price in the village part of the configurator
        var villageSum = 0;
        //this is the total price in the thrid party part of the configurator
        var thirdSum = 0;
        //This is the url of the image currently selected
        var imageUrl = "";
        //This is the string for the check links.
        var checkoutResultString = "";
        //this is the variable I created for convenience for finding the image
        var findImg = $(this).closest('.col-sm-8').prev('.col-sm-2');
        //this is the variable that store the value of which button will be disabled after the current button is selected


        updateClickedElementImage(this);

        enableButtons(this);


        //New Feature Child Button Deselect Logic
        //On change choice of Button in Parent
        //Deselect choice of button in child
        //Change Section Icon of Child to: "Attention-Phoenix-Sign". → Attention-Phoenix-Sign




        //split these out into a calculateCost,  update Icon,   refresh buttons functions please!

        result.each(function() {
            // This function loops through all checked radio buttons. This function does a lot:
            //    1. Calculate the cost summery
            //    2. Update the Section Icon
            //    3. Update enabling / disabling of child radio buttons

            //This is the raido button name
            var selectedText = $(this).next('span').text();

            //this is the section the raido button belongs to
            var Section_Name = $(this).closest('.col-sm-8').find('h3').find('span').text();



            checkoutResultString = Checkout(this, selectedText, checkoutResultString);
            disableButtons(this, selectedText, Section_Name);


            if ($(this).hasClass('None')) {
                noneNumber += 1;
                radioCheckedNumber = result.length - noneNumber + " items in cart";
            }

            imageUrl = "";


        });




        //-----------------------------------------------------
        //What does this do?
        //-----------------------------------------------------


        var resultString1 = "";
        var resultString2 = "";
        var resultString3 = "";
        var resultString4 = "";


        //this is where the class come in.
        //there are the class that seperate the thrid party and village.
        //And this 2 functions is caculate the total cost of village and thrid party

        $('#villageSum').text(CaculateCost(this, '.village'));
        $('#thirdSum').text(CaculateCost(this, '.third'));
        $('#total').html(CaculateCost(this, ''));
        document.querySelector('#ViCase-resultstring').innerHTML = superSummary('#chapter-1', resultString1);
        document.querySelector('#ViDock-resultstring').innerHTML = superSummary('#chapter-2', resultString2);
        document.querySelector('#PcPart-resultstring').innerHTML = superSummary('#chapter-3', resultString3);
        document.querySelector('#OS-resultstring').innerHTML = superSummary('#chapter-3', resultString4);

        $('#checkout-list').html(checkoutResultString);

        alert(radioCheckedNumber);
        $('#radiocheckednumber').html(radioCheckedNumber);
    } else {
        $('#divResult').html("No radio button is checked");
    }
}
*/

//var runjquery = function($scope) {

/*
//This add the the class village and third
  //The function for this class is explained in line 300
  $('#chapter-1, #chapter-2').addClass('village');
  $('#chapter-3, #chapter-4').addClass('third');


  //a temp function to add price? to things.
  //this should be removed by a tweak to the template.


  $('input[type="radio"]').each(function() {
      SetPricing(this);
  });

  //when a radio is clicked
  $('input[type="radio"], select option').click(function($scope) {
      $scope.cartCount = 10;
      /* alert(cartItems);
       if(wasAPresetSelected(this)){  //If it was a preset
         UpdateTotals($('input[type=radio]:checked, select option:selected')); //run a full update
       }else if($(this).is(':checked')) { //else
         UpdateTotals(this);//just run a single update for a button
       }
       */
/*   });
 */

//-------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------
//I DID NOT REFACTOR THE CODE BELOW THIS, BECAUSE I DON'T NEED YOU TO DEBUG ANYTHING BELOW THIS.
//---------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------
/*
    var wWidth = $(window).width();

    var dWidth = wWidth * 0.5;

    dWidth = dWidth - 52;

    $('.dialog').dialog({
        modal: true,
        autoOpen: false,
        show: 'slideDown',
        hide: 'explode',
        width: dWidth,
        height: dWidth,
        buttons: {
            "Cancel": function() {
                $(this).dialog('close');
            }
        }
    });

    $('.checkout').click(function() {
        $('.dialog').dialog('open');
    });


    //-----------------------------------------------------
    //Read More
    //-----------------------------------------------------

    $('.readmore_area').hide();
    $('.readmore_area.show-first').show();
    $('.sub-sectionToggle').next().hide();

    $('.readmore_button').click(function() { //when I click a toggle button
        var parent = $(this).parent(".readmore_group");
        var buttons = $(parent).children('.readmore_button');
        var areas = $(parent).children('.readmore_area');
        var idx = $(buttons).index(this);

        if ($(this).hasClass("open")) {
            $(this).removeClass("open").addClass("closed");
            $(areas[idx]).removeClass("open").addClass("closed");
            $(this).find('i').removeClass('fa-rotate-90');
        } else {
            $(this).find('i').addClass('fa-rotate-90');
            $(this).addClass("open").removeClass("closed");
            $(areas[idx]).addClass("open").removeClass("closed");
        }
        $(parent).children('.readmore_area.closed').hide();
        $(parent).children('.readmore_area.open').slideDown();

    });

    $('.radio-tables').find('.tableSection.closed').hide();

    $('.table-tab li a').click(function() {
        var parent = $(this).closest('.radio-tables');
        var buttons = $(parent).children('.table-tab').find('a');
        var areas = $(parent).children('.tableSection');
        var idx = $(buttons).index(this);

        if (!$(this).hasClass("active")) {
            $(buttons).parent().removeClass("active");
            $(this).parent().addClass('active');
            $(areas).removeClass("open").addClass("closed");
            $(areas[idx]).addClass("open").removeClass("closed");
        }
        $(parent).children('.tableSection.closed').hide();
        $(parent).children('.tableSection.open').show();
    });

    $('.sub-sectionToggle').click(toggle);

    $('.collapse-summary').click(toggle);

    function toggle() {
        $(this).next().slideToggle();
        if (!$(this).find('i').hasClass('fa-rotate-90')) {
            $(this).find('i').addClass('fa-rotate-90');
        } else {
            $(this).find('i').removeClass('fa-rotate-90');
        }
    }


*/

//------------------------------------------------------
//Acodrian
//------------------------------------------------------
/*

    $('.collapsable').next('.panel-body').hide();


    $('.collapsable').click(function() {
        $(this).next(".panel-body").slideToggle();

        if (!$(this).find("i").hasClass("fa-rotate-90")) {
            $(this).find("i").addClass("fa-rotate-90");
        } else {
            $(this).find("i").removeClass("fa-rotate-90");
        }
    });

    $(".AMD-show, .intel-show").hide();

    $("#intel").click(function() {
        $(".show-text").hide();
        $(".AMD-show").hide();

        $(".intel-show").slideDown();
    });

    $("#AMD").click(function() {
        $(".show-text").hide();
        $(".AMD-show").slideDown();

        $(".intel-show").hide();
    });
/*
    var children = $('.GalleryThumbNail > .thumb');
    for (var i = 0, l = children.length; i < l; i += 4) {
        children.slice(i, i + 4).wrapAll('<div class="item"></div>');
    }

    $('.GallerySlideshow > .item:nth-child(1)').addClass('active');
    $('.GalleryThumbNail > .item:nth-child(1)').addClass('active');

    //$('.hide-section').closest('.panel-default').hide();
};
//<<<<<<< Updated upstream

/*var btn = document.querySelectorAll('.collapse-summary');


var number = 0;

for (var i = 0; i < btn.length; i++) {
  btn[i].addEventListener("click", function() {
    if(number == 0) {
        this.nextElementSibling.style.display = "none";
        this.className += " hello";
        number = 1;
    } else {
      this.nextElementSibling.style.display = "block";
      number = 0;
    }
  });
}
*/
