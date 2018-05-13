$(".meme").on('click', function(event) {
	event.preventDefault();
	var artworkId = $(this).data('artworkid');

	window.location.href = "/meme-editor/" + artworkId;
});