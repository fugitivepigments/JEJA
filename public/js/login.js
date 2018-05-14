$("#login-form").on('submit', function(event) {
	event.preventDefault();

	// package the user's credientials
	var userCreds = {
		email: $("#login-email").val().trim(),
		password: $("#login-password").val().trim()
	}

	// Login the user
	$.post('/login', userCreds, function(data, textStatus, xhr) {
		console.log('Welcome ' + data.name);

		// package user's name & ID
		var user = {
			userId: data.id,
			username: data.name
		}

		localStorage.setItem('userData',JSON.stringify(user));

		// Hide the login modal
		$("#login-form").closest('.modal').modal('hide');

		// Clear login form
		$("#login-email, #login-password").val('');

		// Toggle the log in/out buttons
		$("#btn-login").toggle();
		$("#btn-logout").toggle();
	})
	.fail((ErrXhr, ErrType, StatusText) => {
		// Display red error text under username and password
		$("#invalidCreds").show();
		$(".modal-title").hide();
	});
});

$("#btn-login").on('click', function(event) {
	$("#invalidCreds").hide();
	$(".modal-title").show();
});

$("#btn-logout").on('click', function(event) {
	event.preventDefault();
	
	// clear session data
	localStorage.removeItem('userData');
	$("#btn-login").toggle();
	$("#btn-logout").toggle();
});