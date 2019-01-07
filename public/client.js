'use strict';

//Show login page
function showLoginPage() {
    $('#welcome-container').hide();
    $('#login-form-container').show();
    $('#signup-form-container').hide();
    $('#all-plants-page').hide();
    $('#new-plant-page').hide();
    $('#individual-plant-page').hide();
    $('#edit-plant-page').hide();
    $('#water-plant-page').hide();
    console.log('showLoginPage ran');
}

//Show sign-up page
function showSignupPage() {
    $('#welcome-container').hide();
    $('#signup-form-container').show();
    $('#login-form-container').hide();
    $('#all-plants-page').hide();
    $('#new-plant-page').hide();
    $('#individual-plant-page').hide();
    $('#edit-plant-page').hide();
    $('#water-plant-page').hide();
    console.log('showSignupPage ran');
}

//Show all plants page
function showAllPlantsPage() {
    $('#welcome-container').hide();
    $('#signup-form-container').hide();
    $('#login-form-container').hide();
    $('#all-plants-page').show();
    $('#new-plant-page').hide();
    $('#individual-plant-page').hide();
    $('#edit-plant-page').hide();
    $('#water-plant-page').hide();
    console.log('showAllPlantsPage ran');
}

//Show new plant page
function showNewPlantPage() {
    $('#welcome-container').hide();
    $('#signup-form-container').hide();
    $('#login-form-container').hide();
    $('#all-plants-page').hide();
    $('#new-plant-page').show();
    $('#individual-plant-page').hide();
    $('#edit-plant-page').hide();
    $('#water-plant-page').hide();
    console.log('showNewPlantPage ran');
}

//Show individual plant page
function showIndividualPlantPage() {
    $('#welcome-container').hide();
    $('#signup-form-container').hide();
    $('#login-form-container').hide();
    $('#all-plants-page').hide();
    $('#new-plant-page').hide();
    $('#individual-plant-page').show();
    $('#edit-plant-page').hide();
    $('#water-plant-page').hide();
    console.log('showIndividualPlantPage ran');
}

//Show edit plant page
function showEditPlantPage() {
    $('#welcome-container').hide();
    $('#signup-form-container').hide();
    $('#login-form-container').hide();
    $('#all-plants-page').hide();
    $('#new-plant-page').hide();
    $('#individual-plant-page').hide();
    $('#edit-plant-page').show();
    $('#water-plant-page').hide();
    console.log('showEditPlantPage ran');
}

//Show water plant page
function showWaterPlantPage() {
    $('#welcome-container').hide();
    $('#signup-form-container').hide();
    $('#login-form-container').hide();
    $('#all-plants-page').hide();
    $('#new-plant-page').hide();
    $('#individual-plant-page').hide();
    $('#edit-plant-page').hide();
    $('#water-plant-page').show();
    console.log('showWaterPlantPage ran');
}

//Handle save new watering button
$('#new-water-save').click(event => {
    event.preventDefault();
    showIndividualPlantPage();
});

//Handle delete plant button
$('#delete-plant').click(event => {
    event.preventDefault();
    showAllPlantsPage();
});

//Handle save edits button
$('#edit-plant-save').click(event => {
    event.preventDefault();
    showIndividualPlantPage();
});

//Handle add watering date button
$('#add-water-button').click(event => {
    event.preventDefault();
    showWaterPlantPage();
})

//Handle edit plant button
$('#individual-plant-edit').click(event => {
    event.preventDefault();
    showEditPlantPage();
});

//Handle individual plant clicks
$('ul').on('click', 'li', event => {
    event.preventDefault();
    showIndividualPlantPage();
});

//Save new plant --> all plants page
$('#new-plant-save').click(event => {
    event.preventDefault();
    showAllPlantsPage();
});

//Handle add new plant button
$('#add-plant-button').click(event => {
    event.preventDefault();
    showNewPlantPage();
});

//Handle signup -- all plants page
$('#signup-save').click(event => {
    event.preventDefault();
    showAllPlantsPage();
});

//Handle login --> all plants page
$('#login-save').click(event => {
    event.preventDefault();
    showAllPlantsPage();
});

//Handle Log In click 
$('#login-button').click(event => {
    event.preventDefault();
    showLoginPage();
});

//Handle Sign Up click
$('#signup-button').click(event => {
    event.preventDefault();
    showSignupPage();
});


//Document ready function
$(document).ready(function() {
    $('#all-plants-page').hide();
    $('#new-plant-page').hide();
    $('#individual-plant-page').hide();
    $('#edit-plant-page').hide();
    $('#water-plant-page').hide();
});