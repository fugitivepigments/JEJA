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

		console.log(user);

		$.ajax({
			url: '/api/update-user/' + userData.userId,
			type: 'PUT',
			data: user,
		}).then(() => {
			console.log('Successfully updated user info');
			prevUserDetails = user;
			location.reload();
			// refreshUserInfo();
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

function refreshUserInfo(){
	$.get('/user/' + userData.userId, function(data) {

	});
}

$(".edit").on('click', function(event) {
	event.preventDefault();
	if($(this).text() === "Edit"){
		$(this).text('Save');
	} else {
		$(this).text('Edit');
	}
});