var userData;

// Check to see if the user is already logged in
if(localStorage.getItem('userData') || sessionStorage.getItem('userData')){

	// Attempt to pull userData from localStorage first
	// If no userData in localStorage, check sessionStorage
	userData = localStorage.getItem('userData') || sessionStorage.getItem('userData');
	userData = JSON.parse(userData);

	$("#curr-user").text('Welcome, '+userData.username);

	console.log(userData.username + ' is currently logged in');
	// isLoggedIn(true);
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
	$.post('/signin', userCreds, function(data, textStatus, xhr) {

		console.log('Welcome, ' + data.name);

		// Hide the Home page's Sign Up button
		$("#signup").toggle();

		// Show the Meme Editor Save button
		$("#save-form").toggle();

		// package user's name & ID
		var user = {
			userId: data.id,
			username: data.name,
			session: data.session
		}

		// if Remember me is checked, use localStorage, otherwise use sessionStorage
		// Store user's name & ID
		if($("#login-persist").is(":checked")){
			localStorage.setItem('userData',JSON.stringify(user));
		}
		sessionStorage.setItem('userData',JSON.stringify(user));

		$("#curr-user").text('Welcome, '+data.name);

		// Clear login form
		$("#login-email, #login-password").val('');

		// Toggle the log in/out buttons
		// isLoggedIn(true);
		toggleLoginLogOut();
		
		// Hide the login modal
		$("#loginModal").modal("hide");
		
	})
	.fail((ErrXhr, ErrType, StatusText) => {
		// Display red error text under username and password
		$("#invalidCreds").show();
		$("#loginModalLabel").hide();
	});
});

$("#signin-form-alt").on('submit', function(event) {
	event.preventDefault();

	// package the user's credientials
	var userCreds = {
		email: $("#email-alt").val().trim(),
		password: $("#password-alt").val().trim()
	}

	// Login the user
	$.post('/signin', userCreds, function(data, textStatus, xhr) {

		console.log('Welcome, ' + data.name);

		// package user's name & ID
		var user = {
			userId: data.id,
			username: data.name,
			session: data.session
		}

		// if Remember me is checked, use localStorage, otherwise use sessionStorage
		// Store user's name & ID
		if($("#login-persist").is(":checked")){
			localStorage.setItem('userData',JSON.stringify(user));
		}
		sessionStorage.setItem('userData',JSON.stringify(user));

		$("#curr-user").text('Welcome, '+data.name);

		// Toggle the log in/out buttons
		// isLoggedIn(true);
		toggleLoginLogOut();

		window.location.href = "/";
		
	})
	.fail((ErrXhr, ErrType, StatusText) => {
		// Display red error text under username and password
		$("#invalidCreds").show();
		$("#loginModalLabel").hide();
	});
});

$("#btn-login").on('click', function(event) {
	$("#invalidCreds").hide();
	$("#loginModalLabel").show();
	$("#login-email, #login-password").val('');

});


// Additional code that runs when a user clicks the logout button
// the new /logout route destroys the session and redirects the
// user to "/"
$("#btn-logout").on('click', function(event) {
	// event.preventDefault();

	var user;
	try {
		userData = JSON.parse(localStorage.userData);
		user = userData.username;
	} catch (err) {
		// console.log(err);
		userData = JSON.parse(sessionStorage.userData);
		user = userData.username;
	}

	// clear session data
	localStorage.removeItem('userData');
	sessionStorage.removeItem('userData');

	$("#curr-user").text('');

	// isLoggedIn(false);
	toggleLoginLogOut();

	// Show the Home page's Sign Up button
	$("#signup").toggle();

	// Hide the Meme Editor save-form
	$("#save-form").toggle();

	//Set user's name to logout modal
	$("#logout-user").text(user);

	//Logout modal appears
	$("#logoutModal").modal();
	console.log(user + " has been logged out");

	// Route user to the home page
	// window.location.href = "/";

});

function toggleLoginLogOut(){
	// Toggle the log in/out buttons
	$("#btn-login").toggle();
	$("#btn-logout").toggle();
	$("#collection-link").toggle();
}

function isLoggedIn(status){

	if(status){
		$("#btn-login").hide();
		$("#btn-logout").show();
		$("#collection-link").show();
	} else {
		$("#btn-login").show();
		$("#btn-logout").hide();
		$("#collection-link").hide();
	}
}