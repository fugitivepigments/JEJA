$(document).ready(function(){
    $("#meme").memeGenerator({
        useBootstrap: true
    });

    // TODO: check for userData after the page has loaded
    if(userData){
        $("#save").show();
    } else {
        $("#save").hide();
    }

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
        
        // Retrieve and store the image data
        var imageDataUrl = $("#meme").memeGenerator("save");
        localStorage.setItem("lastSavedMeme",imageDataUrl);

        var memeText = "";
        var textboxes = $("input[type=text].mg-textbox-text");
        for (var i = 0; i < textboxes.length; i++) {
            memeText += textboxes[i].value + " ";
        }

        // Package the meme data
        var meme = {
            meme_name: "Untitled",
            meme_text: memeText.trim(),
            og_img: $("#meme").data('og-img'),
            new_img: imageDataUrl,
            tags: "",
            UserId: user
        }

        // add meme to database
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

});

