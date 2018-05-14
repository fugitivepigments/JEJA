$(".meme").on('click', function(event) {
	event.preventDefault();
	var artworkId = $(this).data('artworkid');

	window.location.href = "/meme-editor/" + artworkId;
});

$("#signup").on('click', function(event) {
	event.preventDefault();
	$("#login-form").slideToggle();
});

$("#login-form").on('submit', function(event) {
	event.preventDefault();

	$("#login-form").slideUp();

	var newUser = {
		name: $("#name").val().trim(),
		email: $("#email").val().trim(),
		password: $("#password").val().trim()
	};

	clearform();

	$.post('/api/new-user', newUser, function(data, textStatus, xhr) {
		/*optional stuff to do after success */
		console.log('data: ', data);
		console.log('textStatus: ', textStatus);
		console.log('xhr: ', xhr);
		console.log('We have a new user!');
	});
});

function clearform(){
	$("#name").val('');
	$("#email").val('');
	$("#password").val('');
}