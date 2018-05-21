if(!localStorage.getItem('userData') && !sessionStorage.getItem('userData')){
	window.location.href = "/";
}

var prevUserDetails = {
	name: $("#name").val().trim(),
	email: $("#email").val().trim()
}

$(".edit-details").on('click', function(event) {
	event.preventDefault();
	$(".edit-on").toggle();
	$(".edit-off").toggle();

	if($(this).text() === "Save" && infoChanged()){
		// Send post request and update user's info
		
		var user = {
			name: $("#name").val().trim(),
			email: $("#email").val().trim()
		}

		$.ajax({
			url: '/users/update-account', 
			type: 'PUT',
			data: user,
		}).then((updatedUser) => {
	
			// Display the updated name
			$("#name").text(updatedUser.name);
			$(".disp-name").text("Name: " + updatedUser.name);
			$(".user-name").text(updatedUser.name + "'s Details");
			$("#curr-user").text("Welcome, " + updatedUser.name);
			document.title = "Dry Memes - " + updatedUser.name + "'s Account";

			// Display the updated email
			$("#email").text(updatedUser.email);
			$(".disp-email").text("Email: " + updatedUser.email);

			prevUserDetails = user;
		});
	}
});

function infoChanged(){
	if(prevUserDetails.name !== $("#name").val().trim()){
		return true;
	}
	if(prevUserDetails.email !== $("#email").val().trim()){
		return true;
	}
	return false;
}

$(".edit").on('click', function(event) {
	event.preventDefault();
	if($(this).text() === "Edit"){
		$(this).text('Save');
	} else {
		$(this).text('Edit');
	}
});

$("#save-portfolio").on('click', function(event) {
	event.preventDefault();

	// Obtain the provided portfolio name
	const portfolioName = $("#portfolio-name").val().trim();

	// Validation to check that a portfolio name has been provided
	if(portfolioName.length > 0){
		// Validation to check if the user is logged in
		if(localStorage.getItem('userData') || sessionStorage.getItem('userData')){

			// package portfolio details
			const newPortfolio = {
				portfolio_name: portfolioName || "Untitled",
				cover_img: "/images/Placeholder.jpg"
			}

			// Clear out the input form
			$("#portfolio-name").val('');

			// Close the portfolio modal
			$("#portfolioModal").modal();

			// ajax call to create a new port
			$.post('/api/'+ userData.userId +'/new-portfolio', newPortfolio, function(data) {
	
				// Reload/redraw portfolios section
				console.log(data);

				window.location.href = "/users/" + userData.userId

			});
		} else {
			console.log('Please log in');
		}
	}
});

// User clicks on a portfolio card
$(".portfolio-card").on('click', function(event) {
	event.preventDefault();

	if(localStorage.getItem('userData') || sessionStorage.getItem('userData')){
		const portfolioID = $(this).data("portfolio-id");
		window.location.href = '/user/'+ userData.userId +'/portfolio/' + portfolioID;
	} else {
		console.log('Please log in');
	}
});

// User clicks on the plus sign within a portfolio card to add memes
$(".add-meme").on('click', function(event) {
	event.preventDefault();

	const portfolioID = $(this).prev().data('portfolio-id');

	var portfolioCover = $(this).prev().find('.img-holder img');

	if(localStorage.getItem('userData') || sessionStorage.getItem('userData')){
		$.get('/api/'+ userData.userId +'/collection', function(data) {
			// Display list of memes in a popup container next to the portfolio
			$("#meme-picker").animate({width: 'toggle'});
			$('.scroll-window').empty();

			for (var i = 0; i < data.length; i++) {
				const meme = $("<div class='meme-card' style='opacity: 0;'>");
				const meme_img = $("<img>").attr({
					src: data[i].new_img,
					alt: data[i].meme_name,
					title: data[i].meme_name
				});
				const checkmark = $('<i class="fas fa-check-square checkmark">')
				meme.append(meme_img, checkmark);
				meme.attr({
					'data-meme-id': data[i].id,
					'data-new-img': data[i].new_img
				});

				// Click handler for selectable memes
				meme.on('click', function(event) {
					event.preventDefault();
					// Add selected meme to the portfolioID
					const memeID = $(this).data('meme-id');
					const coverImg = $(this).data('new-img');

					$(this).children('.checkmark').css('opacity', 1);

					portfolioCover.attr('src', coverImg);

					// Package the meme details
					var memeDetails = {
						memeID: memeID,
						portfolioID: portfolioID,
						userID: userData.userId,
						cover_img: coverImg
					}

					$.ajax({
						url: '/api/add-meme-to-portfolio',
						type: 'PUT',
						data: memeDetails,
					}).then(data => {
						portfolioCover.attr('src', coverImg);

					}).catch(function(err) {
						console.log("error");
					});
					
				});
				$(".scroll-window").append(meme);
			}
			$(".scroll-window .meme-card").animate({opacity: 1}, 2300);
		});
	}
});	



$(".remove-portfolio").on('click', function(event) {
	event.preventDefault();
	var portfolioID = $(this).prev().prev().data('portfolio-id');

	if(localStorage.getItem('userData') || sessionStorage.getItem('userData')){
		$.ajax({
			url: '/portfolios/delete-portfolio',
			type: 'DELETE',
			data: {portfolioID: parseInt(portfolioID)}
		})
		.then(function(data) {
			if(data){

				console.log("delete successful");
				// $(this).parent().remove();
				window.location.href = "/users/" + userData.userId;
			} else {
				console.log("delete unsuccessful");
			}
		})
		.catch(function(err) {
			console.log("error");
		});
	}
	
});	


function loadPortfolioCovers(){
	var portfolios = $(".portfolio-card");
	$(".portfolio-card").each(function(index){
		var coverImgURL = $(this).data('cover');
		if(coverImgURL !== "/images/Placeholder.jpg"){
			// display image
			var coverImg = $("<img>").attr('src', coverImgURL);
			$(this).children('.img-holder').empty().append(coverImg);
		}
	});
}

// function displayPortfolios(arr){
// 	$("#portfolio-list").empty();
// 	arr.forEach((element, index) => {
// 		const header = $("<h3 class='meme-title text-center'>").text(element.portfolio_name);
// 		const cover = $("<div class='img-holder'>");
// 		const add_button = $("<button class='add-meme'>")
// 			.append($("<i class='fa fa-plus fa-5x'>"));
// 		const close_button = $("<button class='btn btn-danger remove-portfolio'>")
// 			.text("X");

// 		const card = $("<div class='card portfolio m-2'>").append(header,cover);
// 		card.attr({
// 			'data-portfolio-id': element.id,
// 			'data-cover': element.cover_img
// 		});
// 		const portfolio = $("<div class='portfolio'>")
// 			.append(card, add_button, close_button);
// 		$("#portfolio-list").append(portfolio);
// 	});
// 	loadPortfolioCovers();
// }

loadPortfolioCovers();

//close meme popout
$(".close-popout").on("click", function() {
	$("#meme-picker").animate({width: 'toggle'});
})