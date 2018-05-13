$(document).ready(function(){
    $("#meme").memeGenerator({
        useBootstrap: true
    });
});

$("#save").click(function(e){
    e.preventDefault();
    
    var imageDataUrl = $("#meme").memeGenerator("save");

    // console.log(imageDataUrl);

    localStorage.setItem("savedMeme",imageDataUrl);
    var memeText = "";
    var textboxes = $("input[type=text].mg-textbox-text");
    for (var i = 0; i < textboxes.length; i++) {
    	memeText += textboxes[i].value + " ";
    }

    // Get the user's ID from LocalStorage
    var user = 1;
    localStorage.setItem("loggedInUser",user);

    var meme = {
    	meme_name: "Untitled",
		meme_text: memeText.trim(),
		og_img: "",
		new_img: "",  //imageDataUrl -- requires Sequelize.TEXT (65353)
		tags: "",
		UserId: user
    }

    $.post('/api/'+ user +'/new-meme', meme , function(data, textStatus, xhr) {
    	console.log('data: ',data);
    	console.log('textStatus: ',textStatus);
    	console.log('xhr: ',xhr);
    });
    
    // $.ajax({
    //     url: "/save-img",
    //     type: "POST",
    //     data: {image: imageDataUrl},
    //     dataType: "json",
    //     success: function(response){
    //         console.log('Success response: ',response);
    //         $("#preview").html(
    //             $("<img>").attr("src", response.filename)
    //         );
    //     },
    //     error: function(err){
    //         console.log('Error: ', err);
    //     }
    // });
});

$("#download").click(function(e){
    e.preventDefault();
    
    $("#meme").memeGenerator("download");
});