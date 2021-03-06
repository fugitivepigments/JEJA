$(".card").hover(function() {
	// Display the new image on hover
	var img = $(this).children('img');
	img.attr('src', img.data('new-img'));
}, function() {
	// Display the original image on mouse leave
	var img = $(this).children('img');
	img.attr('src', img.data('og-img'));
});

$(".btn-edit").on('click', function(event) {
	// event.preventDefault();
	const memeId = $(this).parent().prev().data('memeid');

	// $.get('/memes/' + memeId, function(data, textStatus, xhr) {});

	window.location.href = "/memes/" + memeId;
});

$(".btn-delete").on('click', function(event) {
	event.preventDefault();

	if(userData){
		const memeId = $(this).parent().prev().data('memeid');

		var meme = {
			memeId: memeId
		}
		
		$.ajax({
			url: '/memes/delete-meme',
			type: 'DELETE',
			data: meme
		}).then(response => {
			if(response === 1){
				console.log("meme #"+ memeId +" deleted successfully.");
				$(this).closest('.card').remove();

				var title = $("#section-title-meme").text();
				var count = parseInt(title.split('(')[1].split(')')[0]) - 1;
				$("#section-title-meme").text('Saved Memes ('+ count +')');
			} else {
				console.log("You cannot delete meme #" + memeId);
			}
		}).catch(err => {
			console.log("meme #"+ memeId +" was not deleted", err.message);
		});
	}
});