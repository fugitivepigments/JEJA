$("#login-form").on('submit', function(event) {
	event.preventDefault();

	console.log($(this).closest('.modal'));

	var userCreds = {
		email: $("#login-email").val().trim(),
		password: $("#login-password").val().trim()
	}

	$.post('/login', userCreds, function(data, textStatus, xhr) {
		console.log('Welcome ' + data.name);
	});
	
});