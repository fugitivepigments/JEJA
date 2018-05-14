var userData;

// Check to see if the user is already logged in
if(localStorage.getItem('userData') || sessionStorage.getItem('userData')){

	// Attempt to pull userData from localStorage first
	// If no userData in localStorage, check sessionStorage
	userData = localStorage.getItem('userData') || sessionStorage.getItem('userData');
	userData = JSON.parse(userData);

	console.log(userData.username + ' is currently logged in');
	toggleLoginLogOut();
	$("#signup").toggle();
}

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

		$("#signup").toggle();

		// package user's name & ID
		var user = {
			userId: data.id,
			username: data.name
		}
		console.log('Remember me: ' + $("#login-persist").is(":checked"));

		// if Remember me is checked, use localStorage, otherwise use sessionStorage
		// Store user's name & ID
		if($("#login-persist").is(":checked")){
			localStorage.setItem('userData',JSON.stringify(user));
		}
		sessionStorage.setItem('userData',JSON.stringify(user));

		// Hide the login modal
		$("#login-form").closest('.modal').modal('hide');

		// Clear login form
		$("#login-email, #login-password").val('');

		// Toggle the log in/out buttons
		toggleLoginLogOut();
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
	$("#login-email, #login-password").val('');
});

$("#btn-logout").on('click', function(event) {
	event.preventDefault();
	
	// clear session data
	localStorage.removeItem('userData');
	sessionStorage.removeItem('userData');

	toggleLoginLogOut();

	$("#signup").toggle();
});

function toggleLoginLogOut(){
	// Toggle the log in/out buttons
	$("#btn-login").toggle();
	$("#btn-logout").toggle();
}