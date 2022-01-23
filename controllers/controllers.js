module.exports = {
    // Page Controllers
    goto_homePage: require("./pages/homePage"),
    goto_signupPage: require("./pages/signupPage"),
    goto_signinPage: require("./pages/signinPage"),
    goto_communityPage: require("./pages/communityPage"),
    goto_createMemePage: require("./pages/createMemePage"),
    goto_createRandomMemePage: require("./pages/createRandomMemePage"),
    goto_editMemePage: require("./pages/editMemePage"),
    goto_displayMemePage: require("./pages/displayMemePage"),
    goto_collectionPage: require("./pages/collectionPage"),
    goto_searchResults: require("./pages/searchResultsPage"),
    goto_privatePortfolio: require("./pages/privatePortfolioPage"),
    goto_publicPortfolio: require("./pages/publicPortfolioPage"),
    
    // User Controllers
    action_createUser: require("./actions/createUser"),
    action_signinUser: require("./actions/signinUser"),
    action_logoutUser: require("./actions/logoutUser"),
    action_restrictUserToOwnProfile: require("./actions/restrictUserToOwnProfile"),
    action_updateUser: require("./actions/updateUser"),
    action_deleteUser: require("./actions/deleteUser"),
    action_getUsersMemeCollection: require("./actions/getUsersMemeCollection"),
    
    // Meme Controllers
    action_deleteMeme: require("./actions/deleteMeme"),
    action_updateMeme: require("./actions/updateMeme"),
    action_saveMeme: require("./actions/saveMeme"),
    
    // Portfolio Controllers
    action_deletePortfolio: require("./actions/deletePortfolio"),
    action_savePortfolio: require("./actions/savePortfolio"),
    action_addMemeToPortfolio: require("./actions/addMemeToPortfolio"),
    action_updatePortfolio: require("./actions/updatePortfolio")
}