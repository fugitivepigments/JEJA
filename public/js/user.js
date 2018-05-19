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
			url: '/api/update-user/' + userData.userId,
			type: 'PUT',
			data: user,
		}).then((updatedUser) => {
			// console.log('Successfully updated user info');
			// Display the updated name
			$("#name").text(updatedUser.name);
			$(".disp-name").text("Name: " + updatedUser.name);
			$(".user-name").text(updatedUser.name + "'s Details")
			document.title = "Dry Memes - " + updatedUser.name + "'s Account"

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

// function refreshUserInfo(){
// 	$.get('/user/' + userData.userId, function(data) {

// 	});
// }

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
				/*optional stuff to do after success */
				// Reload/redraw portfolios section
				console.log(data);
				$("#portfolio-list").empty();

				data.forEach((element, index) => {
					const header = $("<h3 class='meme-title text-center'>").text(element.portfolio_name);
					const cover = $("<img>").attr({
						src: element.cover_img,
						alt: element.portfolio_name
					});
					const card = $("<div class='card portfolio m-2'>").append(header,cover);
					$("#portfolio-list").append(card);
				});

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
				meme.append(meme_img);
				meme.attr('data-meme-id', data[i].id);
				meme.on('click', function(event) {
					event.preventDefault();
					// Add selected meme to the portfolioID
					const memeID = $(this).data('meme-id');

					var memeDetails = {
						memeID: memeID,
						portfolioID: portfolioID,
						userID: userData.userId,
						cover_img: data[i].new_img
					}

					$.ajax({
						url: '/api/add-meme-to-portfolio',
						type: 'PUT',
						data: memeDetails,
					}).then(success => {
						console.log('Meme added successfully');
						// refresh the 
					});
					
				});
				$(".scroll-window").append(meme);
			}

			// Add click listeners

			$(".scroll-window .meme-card").animate({opacity: 1}, 2300);
		});
	}
});