$(".meme").on('click', function(event) {
	event.preventDefault();
	var artworkId = $(this).data('artworkid');

	window.location.href = "/meme-editor/" + artworkId;
});

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

	$.post('/api/new-user', newUser, function(data, textStatus, xhr) {

		// package user's name & ID
		var user = {
			userId: data.id,
			username: data.name
		}

		// Store user's name & ID
		if($("#signin-persist").is(":checked")){
			localStorage.setItem('userData',JSON.stringify(user));
		}
		sessionStorage.setItem("userData",JSON.stringify(user));

		// Toggle the login/logout buttons
		$("#btn-login").toggle();
		$("#btn-logout").toggle();

		console.log('We have a new user! Welcome ' + data.name);
	});
});

function clearform(){
	$("#name").val('');
	$("#email").val('');
	$("#password").val('');
}