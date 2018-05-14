$("#login-form").on('submit', function(event) {
	event.preventDefault();

	// Hide the login modal
	$(this).closest('.modal').modal('hide');

	// package the user's credientials
	var userCreds = {
		email: $("#login-email").val().trim(),
		password: $("#login-password").val().trim()
	}

	// Clear login form
	$("#login-email, #login-password").val('');

	// Login the user
	$.post('/login', userCreds, function(data, textStatus, xhr) {
		console.log('Welcome ' + data.name);

		// package user's name & ID
		var user = {
			userId: data.id,
			username: data.name
		}

		localStorage.setItem('userData',JSON.stringify(user));
		$("#btn-login").toggle();
		$("#btn-signout").toggle();
	})
	.fail(err => {
		console.log('Invalid Login: ',err);
	});
});

$("#btn-signout").on('click', function(event) {
	event.preventDefault();
	
	// clear session data
	localStorage.removeItem('userData');
	$("#btn-login").toggle();
	$("#btn-signout").toggle();
});