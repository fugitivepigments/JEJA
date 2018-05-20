// Signup Form
// ================================================

$("#signup").on('click', function(event) {
	event.preventDefault();  
	$("#signup-form").slideToggle();
});

$("#signup-form").on('submit', function(event) {
	event.preventDefault();

	$("#signup-form").slideUp();

	var newUser = {
		name: $("#name").val().trim(),
		email: $("#email").val().trim(),
		password: $("#password").val().trim()
	};

	clearform();

	$.post('/signup', newUser, function(data, textStatus, xhr) {

		// package user's name & ID
		var user = {
			userId: data.id,
			username: data.name,
			session: data.session
		}

		// Store user's name & ID
		if($("#signin-persist").is(":checked")){
			localStorage.setItem('userData',JSON.stringify(user));
		}
		sessionStorage.setItem("userData",JSON.stringify(user));
		
		$("#curr-user").text('Welcome, '+ data.name);

		// Hide the Home page's Sign Up button
		$("#signup").toggle();

		// Toggle the login/logout buttons
		$("#btn-login").toggle();
		$("#btn-logout").toggle();

		window.location.href = "/";

		console.log('We have a new user! Welcome ' + data.name);
	});
});

function clearform(){
	$("#name").val('');
	$("#email").val('');
	$("#password").val('');
}

// Site Search
// ================================================

$(".search-btn").on('click', function(event) {
	event.preventDefault();
    $(".search-toggle").animate({width: 'toggle'});

    if($(".search-input").hasClass('shown')){
    	if($(".search-input").val().trim().length > 0){
    		startSearch();
    	}
    } else {
    	$('.search-input').addClass('shown');
    }
});


$(".search-input").on('submit', function(event) {
	// event.preventDefault();
	if($(".search-input").val().trim().length > 0){
    		startSearch();
    }
});

function startSearch(){
	console.log('Search executed');

	var query = $(".search-input").val().trim();

	$.get('/search?q=' + query, function(data) {
		console.log("successful search");
		window.location.href = '/search?q=' + query;
	});
}


$("#curr-user").on('click', function(event) {
	event.preventDefault();

	if(localStorage.getItem('userData') || sessionStorage.getItem('userData')){

		// Attempt to pull userData from localStorage first
		// If no userData in localStorage, check sessionStorage
		userData = localStorage.getItem('userData') || sessionStorage.getItem('userData');
		userData = JSON.parse(userData);
		if(userData){
			window.location.href = "/users/" + userData.userId;
		}
	}
});