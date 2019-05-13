/* eslint-disable */

/**
  * @desc hides login form, get username's value and show HTML <body> content.
  * @param string wrapper - element that contains displayed message
  * @return 
*/

(function () {
    var userName = $('#username');
    userName.val('');

    var userHTML = document.createElement('p');
    userHTML.className = 'username';

    var iSmile = document.createElement('i');
    iSmile.className = 'fa fa-smile-o modal-smile';


    $(document).on("click", "#login-button", function () {
        $('#loginModal').modal('hide');
        $('.container').show();

        // Getting username value
        userName = userName.val();
        // Adding username value and appending information to '#username'
        var wrapper = document.getElementById("greeetings-content");
        wrapper.getElementsByClassName("modal-content-heading")[0].innerHTML = "Welcome to Cross-it-out, " + userName + " !"
        wrapper.getElementsByClassName("modal-content-body")[0].innerText = "We're glad that you're with us, let's start ";
        wrapper.getElementsByClassName("modal-content-body")[0].appendChild(iSmile);

        $('#greetings-modal').modal('show');

        userHTML.innerHTML = userName;
        document.getElementById('user').appendChild(userHTML);
    });

    $(document).on('click', '#close-button-login', function() {
        if (userName.val() === '') {
            userName = 'unknown';
            userHTML.innerHTML = userName;
            document.getElementById('user').appendChild(userHTML);
        }

        $('#loginModal').modal('hide');
        $('.container').show();
    });

    // By confirmation hides modal form
    $(document).on("click", "#btn_ok", function () {
        $('#greetings-modal').modal('hide');
    });

})();