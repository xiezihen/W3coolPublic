//helper function reference
//var front = require('./scriptsHF'); node.js methods only visible in back end ._.

// if already logged in, redirect back to homepage
ajaxCall('GET', '/session', '', authorize);
function authorize(response) {
    if (response.session != "visitor") {
        window.location = '/';
    }
}

$(document).ready(function() {

    $('#formR').on('submit', function(e) {
        e.preventDefault();
        let button = $(this);
        let type = button.attr("method");
        let data = formatRequest(button);

        if (data['courses'] != '') {
            let temp = data['courses'];
            data['courses'] = temp.split(/\s*,\s*/);
        }

        ajaxCall(type, '/register', JSON.stringify(data), formRsubmit);

        return false;


    });


    $('#formL').on('submit', function(e) {
        e.preventDefault();
        let button = $(this);
        let type = button.attr("method");
        let data = formatRequest(button);
        console.log(data);

        ajaxCall(type, '/login', JSON.stringify(data), formLsubmit);

    });

});

function formRsubmit(response) {
    $(".errors").empty();
    $("#dbregister").empty();

    if (response.errors) {
        var valErrors = response.errors;

        if(valErrors.error_username){
            $("#error_username").append(valErrors.error_username);
        }
        if(valErrors.error_password){
            $("#error_password").append(valErrors.error_password);
        }
        if(valErrors.error_confirm){
            $("#error_confirm").append(valErrors.error_confirm);
        }
        if(valErrors.error_firstname){
            $("#error_firstname").append(valErrors.error_firstname);
        }
        if(valErrors.error_lastname){
            $("#error_lastname").append(valErrors.error_lastname);
        }
        if(valErrors.error_year){
            $("#error_year").append(valErrors.error_year);
        }
        if(valErrors.error_courses){
            $("#error_courses").append(valErrors.error_courses);
        }
        if(valErrors.error_email){
            $("#error_email").append(valErrors.error_email);
        }
        if(valErrors.error_phonenum){
            $("#error_phonenum").append(valErrors.error_phonenum);
        }
    } else if (response.error){
        $("#dbregister").append(response.msg);
    } else {
        $("#dbregister").append(response.msg);
    }
}

function formLsubmit(response) {
    $(".loginErrors").empty();
    $("#dblogin").empty();

    var valErrors = response.errors;

    if (response.errors){
        var valErrors = response.errors;

        if(valErrors.error_username){
            $("#invaliduser").append(valErrors.error_username);
        }
        if(valErrors.error_password){
            $("#invalidpass").append(valErrors.error_password);
        }
    } else if (response.error) {
        $("#dblogin").append(response.msg);
    } else {
        window.location = response.redirect;
    }
}

function formatRequest(form) {
    let data = {};
    form.find(".formdata").each(function (index, value) {
        var input = $(this);
        var name = input.attr("name");
        var value = input.val();

        data[name] = value;
    });
    console.log(data);
    return data;
}

function ajaxCall(type, url, data, success) {
    $.ajax({
        type: type,
        url: url,
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        data: data,
        success: function(response) {
            success(response);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $("#data").append(textStatus + ": Error occured when trying to load from " + url);
        }
    });
};

function dummyFunction(response) {
    return;
}
