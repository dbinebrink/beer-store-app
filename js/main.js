// app start
$(document).ready(function(){

	// get all the beer data JSON, build a big html code block, and place it in the page
	$.ajax({
		// pulling the json from the punk api
		url: "https://api.punkapi.com/v2/beers",
		type: "get",
		dataType: "json",

		success: function(result) {
			var currBeerRow = "";
			var currFoodsInfo = "";

			for(var i = 0; i < result.length; i++) {
				// get the curr pairable foods for this beer
				function getCurrFoods() {
					currFoodsInfo = "";
					for(var j = 0; j < result[i].food_pairing.length; j++) {
						currFoodsInfo += '<li>' + result[i].food_pairing[j] + '</li>';
					}
					return currFoodsInfo;
				}

				// build the beer info rows, create another separate div and paginate those, add pagination code here, the newlines are for viewable code
				currBeerRow = '\n\n<div class="row beer-row"><div class="col-sm-3"><img src="' + result[i].image_url 
					+ '" class="beer-image mx-auto d-block"></div>' + '\n<div class="col-sm-8"><div class="row"><h2>' + result[i].name 
					+ '</h2></div>\n<div class="row"><p class="special fancy">' + result[i].tagline 
					+ '</p></div>\n<div class="row"><p><b>IBU:</b> ' + result[i].ibu + ' | <b>ABV:</b> ' + result[i].abv + '   ' 
					+ '</p></div>\n<div class="row"><p>' + result[i].description 
					+ '</p></div>\n<div class="row"><div class="col-sm-1"><img src="images/icon_food_pairing.svg" class="food">' 
					+ '</div><div class="col-sm-8"><ul>' + getCurrFoods() + '</ul></div></div></div>\n\n\n'

				// ADD ALL BEER ROWS ONTO THE PAGE
				$("#beer-area").append(currBeerRow);
			}
		},

		error: function() {
			$("#beer-area").append('<b class="beer-error">Sorry it did not work, try again later.</b>');
		},

		complete: function() {
			$('#beer-area').easyPaginate({
			    paginateElement: 'div.row.beer-row',
			    elementsPerPage: 5,
			    effect: 'fade',
			    firstButton: false,
			    lastButton: false,
			    prevButton: false,
			    nextButton: false
			});
		}
	});
	// ajax end, do other functions below

	// determine to show the no-results or not
	function showNoResults() {
		var beersPerPage = 5;  

		$('.no-results').hide();
		
		if ($('#beer-area div.beer-row:hidden').length == beersPerPage) {  // if all 5 beer rows are hidden
			$('.no-results').show();  
		}	
	}

	// FILTER existing beer rows: based on search input
	$("#search-field").on('keyup', function() {		
		var value = $(this).val().toLowerCase();  // get the value of the search field which is a string, convert to lowercase

		$("#beer-area div.beer-row").each(function() {
			var myString = $(this).text().toLowerCase();
			$(this).toggle(myString.indexOf(value) > -1);  // show THIS row if the statement is true
		});

		// hide the paginate buttons since we're getting specific
		$('.easyPaginateNav').hide();

		showNoResults();
	});

	// FILTER existing beer rows: based on checkboxes
	$("input[type='checkbox']").on("click", function() {
		var filterTermArray = [];

		// hide all beer rows on click
		$('#beer-area div.beer-row').each(function(){
			$(this).hide();
		});

		// build the array of terms selected
		$('input[type="checkbox"]:checked').each(function(){
			filterTermArray.push($(this).val());  // push adds the value to the end
		});

		// filter function: hide all beer rows on click, then show the relevant ones, based on string
		$('#beer-area div.beer-row').each(function(){
			var myString = $(this).text().toLowerCase();

			var allPresent = filterTermArray.every(function(item){
				return myString.includes(item);  // returns true or false
			});

			if(allPresent == true) {
				$(this).show();
			}
			showNoResults();
		});

		// hide the pagination stuff since we're getting specific
		$('.easyPaginateNav').hide();
	});

	// on submit, hide the paginate buttons since we're getting specific
	$("#search-field").submit(function() {		
		$('.easyPaginateNav').hide();
	});

	// IBU SLIDER
	$("#ibu-range-slider").ionRangeSlider({
		type: "double",
		grid: false,
		min: 0,
		max: 120,
		from: 20,
		to: 100,
		prefix: "",
		// do not use onChange function, as there is a rate limit on the API, onChange will do too many requests
		onFinish: function(data) {
			$('#beer-area div.beer-row').hide();
			$('#beer-area div.beer-row').each(function(){
				var beerRow = $(this).text().toLowerCase();
				var currBeerIbu = beerRow.slice((beerRow.indexOf('ibu: ') + 5), beerRow.indexOf(' | abv:'));  // slice out the ibu
				if((currBeerIbu >= data.from) && (currBeerIbu < data.to)) {
					$(this).show();
				}
			});
			showNoResults();
		}
	});

	// ABV SLIDER
	$("#abv-range-slider").ionRangeSlider({
		type: "double", 
		grid: false,
		min: 3,
		max: 13,
		from: 5,
		to: 11,
		postfix: "%",
		onFinish: function(data) {
			$('#beer-area div.beer-row').hide();
			$('#beer-area div.beer-row').each(function(){
				var myString = $(this).text().toLowerCase();
				var currBeerAbv = myString.slice((myString.indexOf('abv: ') + 5), myString.indexOf('   '));  // slice out the abv
				if((currBeerAbv >= data.from) && (currBeerAbv < data.to)) {
					$(this).show();
				}
			});
			showNoResults();
		}
	});

	// keep the dropdown menu active after clicking things inside the filter dropdown itself
	$('.dropdown-menu').click(function(e) {
		e.stopPropagation();
	});

	// back to top function
	$(window).scroll(function() {
		if ($(this).scrollTop() > 50) {
			$('#back-to-top').fadeIn();
		} else {
			$('#back-to-top').fadeOut();
		}
	});
	$('#back-to-top').click(function () {
		$('body,html').animate({ scrollTop: 0 }, 800);
		return false;
	});
	// nav function for beers
	$('.nav-item a.beers').click(function () {
		$('body,html').animate({ scrollTop: 400 }, 500);
		return false;
	});
});
// app end