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
		/*optional stuff to do after success */

		var user = {
			userId: 10,
			username: data.name
		}

		localStorage.setItem("userData",JSON.stringify(user));
		console.log('data: ', data);
		// console.log('textStatus: ', textStatus);
		// console.log('xhr: ', xhr);
		console.log('We have a new user! Welcome ' + data.name);
	});
});

function clearform(){
	$("#name").val('');
	$("#email").val('');
	$("#password").val('');
}