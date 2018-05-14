$(".meme").hover(function() {
	// Display the new image on hover
	var img = $(this).children('img')[0];
	console.log(img.dataset.newImg);
	img.src = img.dataset.newImg;
}, function() {
	// Display the original image on mouse leave
	var img = $(this).children('img')[0];
	img.src = img.dataset.ogImg;
});