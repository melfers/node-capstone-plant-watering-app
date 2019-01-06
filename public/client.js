'use strict';

//Show login screen
function showLoginScreen() {
    $('#welcome-container').addClass('hidden');
    $('#login-form-container').removeClass('hidden');
}

//Show sign-up screen
function showSignupScreen() {
    $('#welcome-container').addClass('hidden');
    $('#signup-form-container').removeClass('hidden');
}

//Back to landing page (login)
function backToLandingPageLogin() {
    $('#login-back-to-landing').click(event => {
        event.preventDefault();
        $('#login-form-container').addClass('hidden');
        $('#welcome-container').removeClass('hidden');
    });
}

//Back to landing page (signup)
function backToLandingPageSignup() {
    $('#signup-back-to-landing').click(event => {
        event.preventDefault();
        $('#signup-form-container').addClass('hidden');
        $('#welcome-container').removeClass('hidden');
    });
}





//Handle Log In click 
$('#login-button').click(event => {
    event.preventDefault();
    showLoginScreen();
    backToLandingPageLogin();
});

//Handle Sign Up click
$('#signup-button').click(event => {
    event.preventDefault();
    showSignupScreen();
    backToLandingPageSignup();
});


//Document ready function
$(document).ready(function() {
});