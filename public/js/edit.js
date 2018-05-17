$(document).ready(function(){
    // var textSizeSelector = $(".mg-textbox-size")
    // var textSizeCap = $("div");
    // textSizeCap.attr("class", "lead");
    // textSizeCap.text("Edit text at the top of the meme here:");
    // textSizeSelector.prependChild(textSizeCap);

    $("#meme").memeGenerator({
        useBootstrap: true,
            previewMode: "css",
            defaultTextStyle: {
                font: "'Comic Sans', Helvetica",
            },
            // captions: [
            //     "type top",
            //     "type bottom"
            // ]
    });

    // If the user is logged in, show the save button, 
    // otherwise hide the save button
    if(userData){
        $("#save-form").show();
    } else {
        $("#save-form").hide();
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
        var delimiter = "|";
        var textboxes = $("input[type=text].mg-textbox-text");
        for (var i = 0; i < textboxes.length; i++) {
            if(i === 0) {
                memeText += textboxes[i].value + delimiter;
            } else {
                memeText += textboxes[i].value;
            }
        }

        // Package the meme data
        var meme = {
            meme_name: $("#meme-name").val().trim() || "Untitled",
            meme_text: memeText.trim(),
            og_img: $("#meme").attr('src'),
            new_img: imageDataUrl,
            tags: "",
            UserId: user
        }

        var memeId = $("#meme").data("memeid");

        // send update request to database
        $.ajax({
            url: '/api/'+ user +'/update-meme/' + memeId,
            type: 'PUT',
            data: meme
        })
        .done(function(response) {
            console.log("success");
        })
        .fail(function(err) {
            console.error(err.message);
        });
    });

    $("#download").click(function(e){
        e.preventDefault();
        
        $("#meme").memeGenerator("download");
    });

});

