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
        htmlContent += '<li>';
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
    console.log(username);
    fetch(`/all-plants/${username}`)
    .then(response => response.json())
    .then(data => {
        console.log(data.length);
        if(data.length > 0) {
            populateAllPlantsPage(data);
        } else {
            $('#plant-instructions').hide();
            $('#no-plants-alert').show();
        }
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

//Populate individual plant page
function populateIndividualPlantPage(plantData) {
    $('#individual-plant-icon').attr('src', plantData.icon);
    $('#individual-plant-nickname').html(plantData.nickname);
    $('#individual-plant-type').html(plantData.plantType);
    $('#last-water-date').html(plantData.waterHistory);
    $('#watering-frequency').html(`  Water every ${plantData.waterNumber} ${plantData.waterFrequency}`);
    $('#plant-notes').html(plantData.notes);
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

    const username = $('#logged-in-username').val();
    const selectedPlant = $('#selected-plant').val();

    fetch(`/individual-plant/${username}/${selectedPlant}`)
    .then(response => response.json())
    .then(data => {
        console.log(data);
        populateIndividualPlantPage(data);
    })
    .catch(error => console.error(error))

    console.log('showIndividualPlantPage ran');
}

//Populate edit plant page
function populateEditIndividualPlantPage(plantData) {
    console.log(`${plantData.icon}`);
    $('#edit-individual-plant-type').attr('value', `${plantData.plantType}`);
    $('#edit-individual-plant-nickname').attr('value', `${plantData.nickname}`);
    $('#edit-water-number').attr('value', `${plantData.waterNumber}`);
    $('#edit-watering-frequency').attr('value', `${plantData.waterFrequency}`);
    $('#edit-last-water-date').attr('value', `${plantData.waterHistory}`);
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

    const username = $('#logged-in-username').val();
    const selectedPlant = $('#selected-plant').val();
    const newWaterDate = $('#input-water-date').val();
    console.log(newWaterDate, selectedPlant);

    if(newWaterDate == "") {
        alert('Please enter a date');
    }
    else {
        let newWaterDateData = {
            username,
            selectedPlant,
            newWaterDate
        }
        console.log(newWaterDateData);

        return fetch(`/add-water-date/${username}/${selectedPlant}`, {
            method: 'PUT',
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
        .then(responseJson => showIndividualPlantPage(responseJson))
        .catch(err => {
            console.log(err.message);
        });
    }
});

//----------Edit Plant Page----------

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
                showAllPlantsPage(username);
                $('#selected-plant').val('');
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
    console.log(username, selectedPlant, editedPlantType, editedNickname, editedWaterNumber, editedWaterFrequency, editedWaterDate, editedNotes);

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
        console.log(editedPlantData);

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
        console.log(data);
        if (data.result.length > 0) {
            alert('Sorry, that nickname is already being used. Please try a new one!');
            $('#newPlantNickname').val('');
        }
    })
    .catch(error => console.error(error))
    console.log('verifyNickname ran');
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
    const waterHistory = $('#newPlantWaterHistory').val();
    const notes = $('#newPlantNotes').val();
    console.log(icon, plantType, nickname, waterNumber, waterFrequency, waterHistory, notes);

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
$(document).on('click', '.individualPlantForm', event => {
    event.preventDefault();
    let selectedPlant = event.target.parentElement.parentElement.id;
    console.log(selectedPlant);
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