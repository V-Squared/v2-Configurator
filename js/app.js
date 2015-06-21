var app = angular.module('configApp', []).controller('myCtrl', function($scope, $http) {
    //this can be pulled and put into a angular service
    $http.get('data.json')
       .then(function(res){
         $scope.data = res.data;
        });
       
      $scope.domloaded=function(){
        runjquery();
      };  
});
var runjquery=function(){
    console.log('jQuery!');
    var prizeString = "";
    $('input[type="radio"]').each(function() {

        prizeString = "";

        if ($(this).val() != 0) {
            prizeString = $(this).val();

            $(this).next('span').prepend("$" + prizeString + " US - ");
        }

    });

    $('input[type="radio"], select option').click(function() {
        var result = $('input[type=radio]:checked, select option:selected');
        if (result.length > 0) {
            var radioCheckedNumber = result.length + " items in cart<br>";
            var resultString = "";
            var total = 0;
            var noneNumber = 0;
            var villageSum = 0;
            var thirdSum = 0;
            var imageUrl = "";
            var findImg = $(this).closest('.col-sm-10').prev('.col-sm-2').find('img');

            result.each(function() {
                imageUrl = "";
                //alert($(this).val());
                total += parseInt($(this).val());
                imageUrl = $(this).attr('imgAttr');
                findImg.attr('src', imageUrl);
                var selectedText = $(this).next('span').text();
                var Case = "";


                /*$('input[class=case]:checked').each(function() {
                    Case = $(this).attr('case');
                    //alert(Case);

                    $('input[class=cover]:checked').each(function() {

                        if (Case == "2L") {
                            var aimageUrl = $(this).attr('aimgAttr');
                            //alert(aimageUrl);
                            findImg.attr('src', aimageUrl);
                        } else if (Case == "4L") {
                            var bimageUrl = $(this).attr('bimgAttr');
                            //alert(bimageUrl);
                            findImg.attr('src', bimageUrl);
                        } else if (Case == "6L") {
                            var cimageUrl = $(this).attr('cimgAttr');
                            //alert(cimageUrl);
                            findImg.attr('src', cimageUrl);
                        }

                    });
                });*/

                if ($(this).val() != 0) {
                    resultString += selectedText + "<br/>";
                    findImg.removeClass('shade');
                } else if ($(this).val() == 0 && $(this).hasClass('cover')) {
                    noneNumber += 0;
                    findImg.removeClass('shade');
                } else if($(this).val() == 0 && $(this).hasClass('None')){
                    noneNumber += 0;
                } else {
                    noneNumber += 1;
                    radioCheckedNumber = result.length - noneNumber + " items in cart";
                    findImg.addClass('shade');
                    //$('#state').text(noneNumber);
                }

            });

            $('.village input[type=radio]:checked').each(function() {
                villageSum += parseInt($(this).val());
                $('#villageSum').text('$' + villageSum + ' US');
            });

            $('#third input[type=radio]:checked').each(function() {
                thirdSum += parseInt($(this).val());
                $('#thirdSum').text('$' + thirdSum + ' US');

            });

            if (resultString.length > 0) {
                resultString += "<hr>";
            }

            $('#resultstring').html(resultString);
            $('#radiocheckednumber').html(radioCheckedNumber);
            $('#total').html('$' + total);
        } else {
            $('#divResult').html("No radio button is checked");
        }
    });


    //-----------------------------------------------------
    //Read More
    //-----------------------------------------------------

    /*$('.read-more-target1').hide();
	$('.read-more-target2').hide();
	var readMoreState1 = false;
	var readMoreState2 = false;

	$('.read-more1').click(function(){
		$(this).next().next().slideToggle(0);
		readMoreState1 = !readMoreState1;

		if(readMoreState1 == true) {
			$(this).find('i').addClass('fa-rotate-90');
		} else {
			$(this).find('i').removeClass('fa-rotate-90');
		}
	});


	$('.read-more2').click(function(){
		$(this).next().next().slideToggle();
		readMoreState2 = !readMoreState2;

		if(readMoreState2 == true) {
			$(this).find('i').addClass('fa-rotate-90');
		} else {
			$(this).find('i').removeClass('fa-rotate-90');
		}
	});*/

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

    $('.sub-sectionToggle').click(function() {
        $(this).next().slideToggle();
        if (!$(this).find('i').hasClass('fa-rotate-90')) {
            $(this).find('i').addClass('fa-rotate-90');
        } else {
            $(this).find('i').removeClass('fa-rotate-90');
        }
    });




    //------------------------------------------------------
    //Acodrian
    //------------------------------------------------------


    $('.con-fig-header').next('.panel-body').hide();


    $('.con-fig-header').click(function() {
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

     var children = $('.GalleryThumbNail > .thumb');
     for(var i = 0, l = children.length; i < l; i += 4) {
         children.slice(i, i+4).wrapAll('<div class="item"></div>');
     }

     $('.GallerySlideshow > .item:nth-child(1)').addClass('active');
     $('.GalleryThumbNail > .item:nth-child(1)').addClass('active');

     //$('.hide-section').closest('.panel-default').hide();
};