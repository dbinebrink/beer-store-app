// app start
$(document).ready(function(){

	// get all the beer data JSON, build a big html code block, and place it in the page
	$.ajax({
		// pulling the json from the punk api
		url: "https://api.punkapi.com/v2/beers",
		type: "get",
		dataType: "json",

		success: function(result) {
			var currentBeerRow = "";
			var currentFoodsInfo = "";

			for(var i = 0; i < result.length; i++) {
				// get the current pairable foods for this beer
				function getCurrentFoods() {
					currentFoodsInfo = "";
					for(var j = 0; j < result[i].food_pairing.length; j++) {
						currentFoodsInfo += '<li>' + result[i].food_pairing[j] + '</li>';
					}
					return currentFoodsInfo;
				}

				// build the beer info rows, create another separate div and paginate those, add pagination code here, the newlines are for viewable code
				currentBeerRow = '\n\n<div class="row beer-row"><div class="col-sm-3"><img src="' + result[i].image_url 
					+ '" class="beer-image mx-auto d-block"></div>' + '\n<div class="col-sm-8"><div class="row"><h2>' + result[i].name 
					+ '</h2></div>\n<div class="row"><p class="special fancy">' + result[i].tagline 
					+ '</p></div>\n<div class="row"><p><b>IBU:</b> ' + result[i].ibu + ' | <b>ABV:</b> ' + result[i].abv + '   ' 
					+ '</p></div>\n<div class="row"><p>' + result[i].description 
					+ '</p></div>\n<div class="row"><div class="col-sm-1"><img src="images/icon_food_pairing.svg" alt="Food Icon"></div><div class="col-sm-8"><ul>' 
					+ getCurrentFoods() + '</ul></div></div></div>\n\n\n'

				// ADD ALL BEER ROWS ONTO THE PAGE
				$("#beer-area").append(currentBeerRow);
			}
		},

		error: function() {
			$("#beer-area").append('<b class="beer-error">Sorry it did not work, try again later.</b>');
			console.log("Error with API request.");
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
	// ajax end

	// FILTER existing beer rows: based on search input
	$("#search-field").on('keyup', function() {		
		$('.no-results').hide();

		var value = $(this).val().toLowerCase();  // get the value of the search field which is a string, convert to lowercase

		$("#beer-area div.beer-row").each(function() {
			var myString = $(this).text().toLowerCase();
			$(this).toggle(myString.indexOf(value) > -1);  // show THIS row if the statement is true
		});

		if ($('#beer-area div.beer-row:hidden').length == 5) {  // if all 5 beer rows are hidden
			$('.no-results').show();  // this works
		}	

		// hide the paginate buttons since we're getting specific
		$('.easyPaginateNav').hide();
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
		console.log(filterTermArray);

		// filter function: hide all beer rows on click, then show the relevant ones, based on string
		$('#beer-area div.beer-row').each(function(){
			$('.no-results').hide();
			var myString = $(this).text().toLowerCase();

			var allPresent = filterTermArray.every(function(item){  
				return myString.includes(item);  // returns true or false
			});

			if(allPresent == true) {
				$(this).show();
			}
			
			// if all 5 beer rows are hidden
			if ($('#beer-area div.beer-row:hidden').length == 5) {  
				$('.no-results').show();  
			}	

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
		// do NOT use onChange function, as there is a rate limit on the API, onChange will do too many requests
		onFinish: function(data) {
			var currentSliderValueFrom = data.from;  // this is the data.from the ionRangeSlider data object
			var currentSliderValueTo = data.to;  // this is the data.to the ionRangeSlider data object

			$('#beer-area div.beer-row').hide();

			$('#beer-area div.beer-row').each(function(){
				var myString = $(this).text().toLowerCase();
				var indexIbuStart = myString.indexOf('ibu: ') + 5;  // start by getting the ibu number
				var indexIbuEnd = myString.indexOf(' | abv:');  // end by getting the ibu number index
				var currentBeerIbu = myString.slice(indexIbuStart, indexIbuEnd);  // slice out the ibu number
			
				if((currentBeerIbu >= currentSliderValueFrom) && (currentBeerIbu < currentSliderValueTo)) {
					$(this).show();
				}
			});

			$('.no-results').hide();

			// if all 5 beer rows are hidden
			if ($('#beer-area div.beer-row:hidden').length == 5) {  
				$('.no-results').show();  
			}	
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
			var currentSliderValueFrom = data.from;  // this is the data.from the ionRangeSlider data object
			var currentSliderValueTo = data.to;  // this is the data.to the ionRangeSlider data object

			$('#beer-area div.beer-row').hide();

			$('#beer-area div.beer-row').each(function(){
				var myString = $(this).text().toLowerCase();
				var indexAbvStart = myString.indexOf('abv: ') + 5;  // start by getting the abv number
				var indexAbvEnd = myString.indexOf('   ');  // end by getting the spaces after
				var currentBeerAbv = myString.slice(indexAbvStart, indexAbvEnd);  // slice out the ibu number

				if((currentBeerAbv >= currentSliderValueFrom) && (currentBeerAbv < currentSliderValueTo)) {
					$(this).show();
				}
			});
			
			$('.no-results').hide();

			// if all 5 beer rows are hidden
			if ($('#beer-area div.beer-row:hidden').length == 5) {  
				$('.no-results').show();  
			}	
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
	$('.nav-item a.beers').click(function () {
		$('body,html').animate({ scrollTop: 400 }, 500);
		return false;
	});


});
// app end
