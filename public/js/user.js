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

$(".btn-edit").on('click', function(event) {
	event.preventDefault();
	const memeId = $(this).parent().prev().data('memeid');
	window.location.href = "/edit-meme/" + memeId;
});

$(".btn-delete").on('click', function(event) {
	event.preventDefault();

	if(userData){
		const memeId = $(this).parent().prev().data('memeid');
		
		$.ajax({
			url: '/api/'+ userData.userId +'/delete-meme/' + memeId,
			type: 'DELETE'
		}).then(response => {
			if(response === 1){
				// console.log("meme #"+ memeId +" deleted successfully.");
				$(this).closest('.card').remove();
				// Update meme count
				
				// $(".meme-section-title").text("Saved Memes ("+newCount+")");
			} else {
				console.log("You cannot delete meme #" + memeId);
			}
		}).catch(err => {
			console.log("meme #"+ memeId +" was not deleted", err.message);
		});
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
				cover_img: "/images/Placeholder.jpg",
				UserId: userData.userId
			}

			// Close the portfolio modal
			$("#portfolioModal").modal();

			// ajax call to create a new port
			$.post('/api/'+ userData.userId +'/new-portfolio', newPortfolio, function(data, textStatus, xhr) {
				/*optional stuff to do after success */
				// Reload/redraw portfolios section
				
			});
		}
	}
	
});