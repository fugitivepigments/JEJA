$(document).ready(function(){
    $("#meme").memeGenerator({
        useBootstrap: true
    });
});

$("#save").click(function(e){
    e.preventDefault();
    // Get the user's ID from LocalStorage
    var user;
    if(userData){
    	user = userData.userId;
    } else {
    	console.log('Please login');
    	return;
    }
    
    var imageDataUrl = $("#meme").memeGenerator("save");
    localStorage.setItem("savedMeme",imageDataUrl);

    var memeText = "";
    var textboxes = $("input[type=text].mg-textbox-text");
    for (var i = 0; i < textboxes.length; i++) {
    	memeText += textboxes[i].value + " ";
    }

    var meme = {
    	meme_name: "Untitled",
		meme_text: memeText.trim(),
		og_img: $("#meme").data('og-img'),
		new_img: imageDataUrl,  //imageDataUrl -- requires Sequelize.TEXT
		tags: "",
		UserId: user
    }

    // TODO: use Node fs writeFile to save image on server under images dir

    $.post('/api/'+ user +'/new-meme', meme , function(data, textStatus, xhr) {
    	console.log('data: ',data);
    	console.log('textStatus: ',textStatus);
    	console.log('xhr: ',xhr);
    });
   
});

$("#download").click(function(e){
    e.preventDefault();
    
    $("#meme").memeGenerator("download");
});