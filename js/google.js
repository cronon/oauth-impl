function onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();
    var data = {
        name: profile.getName(),
        image: profile.getImageUrl(),
        email: profile.getEmail()
    }
    updateView({google: data})
}
