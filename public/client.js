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
}

//Handle header logo clicks
$('#header-logo').click(event => {
    event.preventDefault();
    showAllPlantsPage();
});

//----------Water Plant Page----------
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
}

//Handle save new watering button
$('#new-water-save').click(event => {
    event.preventDefault();

    const plant_id = $('#selected-plant').val();
    const waterDate = $('#input-water-date').val();

    if(waterDate == "") {
        alert('Please enter a date');
    }
    else {
        let newWaterDateData = {
            plant_id,
            waterDate
        }

        return fetch(`/users/plants/history`, {
            method: 'POST',
            body: JSON.stringify(newWaterDateData),
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
        .then(responseJson => showIndividualPlantPage())
        .catch(err => {
            console.log(err.message);
        });
    }
});

//----------Edit Plant Page----------

//Populate edit plant page
function populateEditIndividualPlantPage(plantData) {
    $('#edit-individual-plant-type').attr('value', `${plantData.plantType}`);
    $('#edit-individual-plant-nickname').attr('value', `${plantData.nickname}`);
    $('#edit-water-number').attr('value', `${plantData.waterNumber}`);
    $('#edit-watering-frequency').attr('value', `${plantData.waterFrequency}`);
    $('#edit-plant-notes').text(`${plantData.notes}`);
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

    const username = $('#logged-in-username').val();
    const selectedPlant = $('#selected-plant').val();

    fetch(`/edit-individual-plant/${username}/${selectedPlant}`)
    .then(response => response.json())
    .then(data => {
        populateEditIndividualPlantPage(data);
    })
    .catch(error => console.error(error))
}

//Handle delete plant button
$('#delete-plant').click(event => {
    event.preventDefault();

    const username = $('#logged-in-username').val();
    const selectedPlant = $('#selected-plant').val();
        if (confirm('Are you sure you want to delete this plant?') === true){    
            $.ajax({
                method: 'DELETE',
                dataType: 'json',
                contentType: 'application/json',
                url: `/delete-plant/${username}/${selectedPlant}`
            })
            .done(function(result) {
                console.log(`Plant deleted succesfully`);
                $('#selected-plant').val('');
                showAllPlantsPage(username);
            })
            .fail(function (jqXHR, error, errorThrown){
                console.log(jqXHR);
                console.log(error);
                console.log(errorThrown);
            });
     }
});

//Handle save edits button
$('#edit-plant-save').click(event => {
    event.preventDefault();
    const username = $('#logged-in-username').val();
    const editedIcon = $('input[name=plant-icon]:checked').attr('class');
    const selectedPlant = $('#selected-plant').val(); 
    let editedPlantType = $('#edit-individual-plant-type').val();
    let editedNickname = $('#edit-individual-plant-nickname').val();
    let editedWaterNumber = $('#edit-water-number').val();
    let editedWaterFrequency = $('#edit-watering-frequency').val();
    let editedWaterDate = $('#edit-last-water-date').val();
    let editedNotes = $('#edit-plant-notes').val();

    if(editedPlantType == "") {
        alert('Sorry, you have to enter a plant type')
    } else if (editedNickname == "") {
        alert('Sorry, you have to enter a nickname')
    }
    else {
        const editedPlantData = {
            username,
            editedIcon,
            selectedPlant,
            editedPlantType,
            editedNickname,
            editedWaterNumber,
            editedWaterFrequency,
            editedWaterDate,
            editedNotes
        }

        return fetch(`/save-edit-individual-plant/${username}/${selectedPlant}`, {
            method: 'PUT',
            body: JSON.stringify(editedPlantData),
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
          .then(responseJson => showIndividualPlantPage(responseJson))
          .catch(err => {
            console.log(err.message);
          });
    }
});

//Back to individual plant page
$('.back-indivPlant').click(event => {
    event.preventDefault();
    showIndividualPlantPage();
});

//----------Individual Plant Page----------

//Populate individual plant page
function populateIndividualPlantPage(plantData) {
    $('#individual-plant-icon').attr('src', plantData.icon);
    $('#individual-plant-nickname').html(plantData.nickname);
    $('#individual-plant-type').html(plantData.plantType);
    $('#watering-frequency').html(`  Water every ${plantData.waterNumber} ${plantData.waterFrequency}`);
    $('#plant-notes').html(plantData.notes);
    $('.water-history ul').addClass(plantData._id);
}

//Show water history for individual plant 
function showWaterHistory(plant_id) {
    $('.water-history ul').empty();
    fetch(`/waterHistory/${plant_id}`)
    .then(response => response.json())
    .then(data => {
        let htmlOutput = '';
        if (data.length > 0) {
            for(let i=0; i<data.length; i++) {
                let eachDate = moment.parseZone(data[i].waterDate).format('MMMM Do YYYY');
                htmlOutput += `<li class="wateringDate">${eachDate}</li>`;
            }
            $('.' + plant_id).html(htmlOutput);
        } else {
            $('#no-dates-alert').show();
        }
    })
    .catch(error => console.error(error))
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
    $('#no-dates-alert').hide();

    const username = $('#logged-in-username').val();
    const selectedPlant = $('#selected-plant').val();

    fetch(`/individual-plant/${username}/${selectedPlant}`)
    .then(response => response.json())
    .then(data => {
        populateIndividualPlantPage(data);
        showWaterHistory(selectedPlant);
    })
    .catch(error => console.error(error))

}

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

//Verify no plant exists with nickname
function verifyNickname(inputNickname) {
    let username = $('#logged-in-username').val();
    fetch(`/verifyNickname/${username}/${inputNickname}`)
    .then(response => response.json())
    .then(data => {
        if (data.result.length > 0) {
            alert('Sorry, that nickname is already being used. Please try a new one!');
            $('#newPlantNickname').val('');
        }
    })
    .catch(error => console.error(error))
}

$(document).on('blur', '#newPlantNickname', event => {
    event.preventDefault();
    let inputNickname = $('#newPlantNickname').val();
    verifyNickname(inputNickname);
})

//Save new plant --> all plants page
$('#new-plant-save').click(event => {
    event.preventDefault();
    const username = $('#logged-in-username').val();
    const icon = $('input[name=plant-icon]:checked').attr('id');
    const plantType = $('#newPlantType').val();
    const nickname = $('#newPlantNickname').val();
    const waterNumber = $('#newPlantWaterNumber').val();
    const waterFrequency = $('#newPlantWaterFrequency').val();
    const notes = $('#newPlantNotes').val();

    if(plantType == "") {
        alert('Sorry, you have to enter a plant type')
    } else if (nickname == "") {
        alert('Sorry, you have to enter a nickname')
    }
    else {
        const newPlantData = {
            username,
            icon,
            plantType,
            nickname,
            waterNumber,
            waterFrequency,
            notes
        }

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
            console.log(err.message);
          })
        .then($('#new-plant-form').trigger('reset'));
    }
});

//Handle back button
$('.back-allPlants').click(event => {
    event.preventDefault();
    showAllPlantsPage();
});

//----------All Plants Page----------
//Populate all plants page
function populateAllPlantsPage(plantList) {
    let htmlContent = '';
    $.each(plantList, (i, item) => {
        htmlContent += '<li class="all-plants-li">';
        htmlContent += `<form class="individualPlantForm" id="${item._id}">`;
        htmlContent += '<button type="submit" class="plantButton">';
        htmlContent += `<img class="plantButtonIcon" src="${item.icon}">`;
        htmlContent += `<p class="plantButtonNickname">${item.nickname}</p>`;
        htmlContent += `<p class="plantButtonType">${item.plantType}</p>`;
        htmlContent += '</button>';
        htmlContent += '</form>';
        htmlContent += '</li>';
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
    $('#no-plants-alert').hide();

    const username = $('#logged-in-username').val();
    fetch(`/all-plants/${username}`)
    .then(response => response.json())
    .then(data => {
        if(data.length > 0) {
            populateAllPlantsPage(data);
        } else {
            $('#plant-instructions').hide();
            $('#no-plants-alert').show();
            $('#display-all-plants').empty();
        }
    })
    .catch(error => console.error(error))
}

//Handle individual plant clicks
$(document).on('click', '.individualPlantForm', event => {
    event.preventDefault();
    let selectedPlant = event.target.parentElement.parentElement.id;
    $('#selected-plant').val(selectedPlant);
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
            console.log(err.message);
        });
    }
});

//Ensure unique signup info
function verifySignupInfo(username) {
    fetch(`/users/verifySignup/${username}`)
    .then(response => response.json())
    .then(data => {
        if(data.result.length > 0) {
            alert('Sorry, that username is already being used. Please try a new one!');
            $('#signupUsernameInput').val('');
        }
    })
    .catch(error => console.error(error))
}

$(document).on('blur', '#signupUsernameInput', event => {
    event.preventDefault();
    let inputUsername = $('#signupUsernameInput').val();
    verifySignupInfo(inputUsername);
})

//Handle login 
$('#login-save').click(event => {
    event.preventDefault();

    const username = $('#loginUsernameInput').val();
    const password = $('#loginUserPwInput').val();

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
            alert('Sorry, there was an error logging in. Please try again with a valid username and password.');
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