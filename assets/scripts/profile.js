// fetches session status
ajaxCall('GET', '/session', '', authorize);

function authorize(response) {
    if (response.session == 'visitor') {
        // need an account to access profile page
        window.location = '/login';

    } else if (response.session == 'admin') {
        // add dynamic html tailored for the admin view
        // delete listings
        // delete users
        // edit information?? seems shady
    }
    $('#aLogin').html("Log out").attr('href', '/logout');
}
// delete a book from the database -- WIP
function deleteBook(r){
	var i = r.parentNode.rowIndex;
    document.getElementById("myTable").deleteRow(i);

}

//get the book by the corresponding profile
function getBooks(response){
 	//var parent = $('#myTable');
    var url = '/listings/?seller=' + response.username;

    ajaxCall('GET', url, '', displayBooks);
}

// helper function to display the listings received through getBook();
function displayBooks(response){
	let listing;
	let name;
	let author;
	let isbn;
	let course;
	let price;
	let notes;

	let table = document.getElementById("myTable")

    //empty the table first
    table.innerHTML = "<tr><th>NAME</th><th>AUTHOR</th><th>ISBN</th><th>COURSE</th><th>PRICE</th><th>NOTES</th><th><i class='fa fa-trash-o fa-fw w3-large w3-text-white'></i></th></tr>";

    if (response.sData) {
        for (let i = 0; i < response.sData.length; i++){
            // create a new row
            del = response.sData[i].listing._id;
            listing = response.sData[i].listing;
            newRow = table.insertRow();
            name = newRow.insertCell();
            author = newRow.insertCell();
            isbn = newRow.insertCell();
            course = newRow.insertCell();
            price = newRow.insertCell();
            notes = newRow.insertCell();
            delButton = newRow.insertCell();

            // fill in the rows
            name.innerHTML = listing.textbook;
            author.innerHTML = listing.author;
            isbn.innerHTML = listing.isbn;
            course.innerHTML = listing.courses;
            price.innerHTML = listing.price;
            notes.innerHTML = listing.notes;
            delButton.innerHTML = "<td><a id='"+del+"' class='delLink'><i class='fa fa-trash fa-fw w3-margin-right w3-large w3-text-brown'></i></a></td>";
        }
    
        $(".delLink").on("click", function(e){
            e.preventDefault();

            let data = {_id: $(this).attr("id")}
            ajaxCall('DELETE', '/listings', JSON.stringify(data), updateBooks);
        });
    }
    
}


$(document).ready(function(){
    //getUser();
    //alert('sucess');

	$(".editlink").on("click", function(e){
	  e.preventDefault();
		var dataset = $(this).prevAll(".datainfo");

		var savebtn = $(this).next(".savebtn");
		var theid   = dataset.attr("id");

		var newid   = theid+"-form";
		var currval = dataset.text();



		dataset.empty();

		$('<input type="text" name="'+newid+'" id="'+newid+'" value="'+currval+'" class="hlite">').appendTo(dataset);

		$(this).css("display", "none");
		savebtn.css("display", "block");
	});
	$(".savebtn").on("click", function(e){
		e.preventDefault();
		var elink   = $(this).prevAll(".editlink");
		var dataset = elink.prevAll(".datainfo");
		var newid   = dataset.attr("id");

		var cinput  = "#"+newid+"-form";
		var einput  = $(cinput);
		var newval  = einput.attr("value");
		//alert(newval);
		//alert(newid);
		if (newid == 'firstname'){
			//send data to the database,replace the original one
			$.get('user', function(data){
				ajaxCall_1('put', '/updateUserInfo/' + data.username,'firstName', newval);
				data.firstName = newval;
			})
		}else if (newid == 'lastname'){
			$.get('user', function(data){
				ajaxCall_1('put', '/updateUserInfo/' + data.username,'lastname', newval);
			})

		}else if (newid == 'campus'){
			$.get('user', function(data){
				ajaxCall_1('put', '/updateUserInfo/' + data.username,'campus', newval);
			})

		}else if (newid == 'year'){
			$.get('user', function(data){
				ajaxCall_1('put', '/updateUserInfo/' + data.username,'yearOfStudy', newval);
			})

		}else if (newid == 'email'){
			$.get('user', function(data){
				ajaxCall_1('put', '/updateUserInfo/' + data.username,'email', newval);
			})

		}else if (newid == 'phone'){
			$.get('user', function(data){
				ajaxCall_1('put', '/updateUserInfo/' + data.username,'phone', newval);
			})

		}

		$(this).css("display", "none");
		einput.remove();
		dataset.html(newval);

		elink.css("display", "block"); //save button shows up
	});

    // adding a book to the database
    $('#bookinfo').on('submit', function(e) {
        e.preventDefault();
        formatRequestUser($(this));
    });

	ajaxCall('GET', '/sessionAccount', '', getBooks);

});

//error checking
function listingSubmit(response){
    $(".errors").empty();
    $("#dblistings").empty();

    if (response.errors) {
        var valErrors = response.errors;

        if(valErrors.error_textbook){
            $("#error_textbook").append(valErrors.error_textbook);
        }
        if(valErrors.error_author){
            $("#error_author").append(valErrors.error_author);
        }
        if(valErrors.error_isbn){
            $("#error_isbn").append(valErrors.error_isbn);
        }
        if(valErrors.error_courses){
            $("#error_courses").append(valErrors.error_courses);
        }
        if(valErrors.error_price){
            $("#error_price").append(valErrors.error_price);
        }
        if(valErrors.error_notes){
            $("#error_notes").append(valErrors.error_notes);
        }
    } else {
        $("#dblistings").append(response.msg);
    }
}

//modified version for the user.
function formatRequestUser(form) {
    let data = {};

    form.find(".formdata").each(function (index, value) {
        var input = $(this);
        var name = input.attr("name");
        var value = input.val();

        data[name] = value;
    });

    console.log(data);

    // ge the username of the current session user.
    $.ajax({
        type: "GET",
        url: "/sessionAccount",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function(response) {
            let seller = "seller";
            data[seller] = response.username;
            sendData = JSON.stringify(data);
            ajaxCall("POST", '/listings', sendData, listingSubmit);
            // update the tables
            ajaxCall('GET', '/sessionAccount', '', getBooks);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $("#data").append(textStatus + ": Error occured when trying to load from " + url);
        }
    });

}

function updateBooks() {
    ajaxCall('GET', '/sessionAccount', '', getBooks);
}

// my ajaxCall, you guys can choose to use it
// type = GET/POST/ETC
// data = json data you want sent to 'url'
// 'success' is a function of your choice that will run upon success
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


function ajaxCall_1(type, url,value, data) {
    $.ajax({
        type: type,
        url: url,

        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({'value':value, 'data': data}),
        success: function(response) {

        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert('error');
        }
    });
};
