'use strict';

//----------Navigational Hide/Show functions----------
//Show landing page
function showLandingPage() {
    $('#welcome-container').show();
    $('#login-form-container').hide();
    $('#signup-form-container').hide();
    $('#all-plants-page').hide();
    $('#new-plant-page').hide();
    $('#individual-plant-page').hide();
    $('#edit-plant-page').hide();
    $('#water-plant-page').hide();
    console.log('showLandingPage ran');
}

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

//Populate all plants page
function populateAllPlantsPage(plantList) {
    let htmlContent = '';
    $.each(plantList, (i, item) => {
        htmlContent += `<li><img src="icons/aloe-icon.png" class="all-plants-icon">${item.nickname}</li>`;
    });
    $('#display-all-plants').html(htmlContent);
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

    const username = $('#logged-in-username').val();
    console.log(username);
    fetch(`/all-plants/${username}`)
    .then(response => response.json())
    .then(data => {
        populateAllPlantsPage(data);
    })
    .catch(error => console.error(error))

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




//Handle header logo clicks
$('#header-logo').click(event => {
    event.preventDefault();
    showAllPlantsPage();
});

//----------Water Plant Page----------

//Handle save new watering button
$('#new-water-save').click(event => {
    event.preventDefault();
    showIndividualPlantPage();
});

//----------Edit Plant Page----------

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

//Back to individual plant page
$('.back-indivPlant').click(event => {
    event.preventDefault();
    showIndividualPlantPage();
});

//----------Individual Plant Page----------

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

//----------New Plant Page----------

//Save new plant --> all plants page
$('#new-plant-save').click(event => {
    event.preventDefault();
    const username = $('#logged-in-username').val();
    const plantType = $('#newPlantType').val();
    const nickname = $('#newPlantNickname').val();
    const waterNumber = $('#newPlantWaterNumber').val();
    const waterFrequency = $('#newPlantWaterFrequency').val();
    const waterHistory = $('#newPlantWaterHistory').val();
    const notes = $('#newPlantNotes').val();
    console.log(plantType, nickname, waterNumber, waterFrequency, waterHistory, notes);

    if(plantType == "") {
        alert('Sorry, you have to enter a plant type')
    }
    else {
        const newPlantData = {
            username,
            plantType,
            nickname,
            waterNumber,
            waterFrequency,
            waterHistory,
            notes
        }
        console.log(newPlantData);

        return fetch('/users/plants/create', {
            method: 'POST',
            body: JSON.stringify(newPlantData),
            headers: new Headers({
                'Content-Type': 'application/json'
              })
        })
        .then(response => {
            if (response.ok) {
              return response.json();
            }
            throw new Error(response.statusText);
          })
          .then(responseJson => showAllPlantsPage(responseJson))
          .catch(err => {
          /*$('#js-error-message').text(`Something went wrong: ${err.message}`);*/
            console.log(err.message);
          });
    }
});

//Handle back button
$('.back-allPlants').click(event => {
    event.preventDefault();
    showAllPlantsPage();
});

//----------All Plants Page----------

//Handle individual plant clicks
$('ul').on('click', 'li', event => {
    event.preventDefault();
    showIndividualPlantPage();
});

//Handle add new plant button
$('#add-plant-button').click(event => {
    event.preventDefault();
    showNewPlantPage();
});

//----------Landing Page----------

//Handle back button
$('.landing-back').click(event => {
    event.preventDefault();
    showLandingPage();
});

//Handle signup 
$('#signup-save').click(event => {
    event.preventDefault();

    const firstName = $('#signupFirstNameInput').val();
    const username = $('#signupUsernameInput').val();
    const password = $('#signupPasswordInput').val();
    const verifyPassword = $('#signupVerifyPasswordInput').val();
    
    console.log(firstName, username, password, verifyPassword);

    if (username == "") {
        alert('Please enter your user name');
    } else if (password =="") {
        alert('Please enter your password');
    } else if (password != verifyPassword) {
        alert('Passwords do not match');
    } else if (firstName == "") {
        alert('Please enter your first name');
    }
    else {
        const signupData = {
            firstName,
            username,
            password
        }
        
        console.log(signupData);

        return fetch('/users/signup', {
            method: 'POST',
            body: JSON.stringify(signupData),
            headers: new Headers({
                'Content-Type': 'application/json'
              })
        })
        .then(response => {
            if (response.ok) {
              return response.json();
            }
            throw new Error(response.statusText);
          })
        .then(responseJson => {
            $('#logged-in-username').val(username);
            showAllPlantsPage(responseJson);
        })
        .catch(err => {
          /*$('#js-error-message').text(`Something went wrong: ${err.message}`);*/
            console.log(err.message);
        });
    }
});


//Handle login 
$('#login-save').click(event => {
    event.preventDefault();

    const username = $('#loginUsernameInput').val();
    console.log(username);
    const password = $('#loginUserPwInput').val();
    console.log(password);

    if (username == "") {
        alert('Please enter your user name');
    } else if (password =="") {
        alert('Please enter your password');
    }
    else {
        const loginData = {
            username: username,
            password: password
        }
    
        return fetch('/users/login', {
            method: 'POST',
            body: JSON.stringify(loginData),
            headers: new Headers({
                'Content-Type': 'application/json'
              })
        })
        .then(response => {
            if (response.ok) {
              return response.json();
            }
            throw new Error(response.statusText);
          })
        .then(responseJson => {
            $('#logged-in-username').val(username);
            console.log($('#logged-in-username').val(username));
            showAllPlantsPage(responseJson);
          })
          .catch(err => {
          /*$('#js-error-message').text(`Something went wrong: ${err.message}`);*/
            console.log(err.message);
          });
    }
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

//--------Doc Ready-------

//Document ready function
$(document).ready(function() {
    $('#all-plants-page').hide();
    $('#new-plant-page').hide();
    $('#individual-plant-page').hide();
    $('#edit-plant-page').hide();
    $('#water-plant-page').hide();
});