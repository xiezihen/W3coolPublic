
// grabs user session
ajaxCall('GET', '/session', '', authorize);

function authorize(response) {
    if (response.session == 'visitor') {
        // need an account to access profile page
        window.location = '/login';
        
    } else if (response.session == 'admin') {
        
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

            ajaxCall('GET', '/sessionAccount', '', getBooks);

        });
    }
    
    $('#aLogin').html("Log out").attr('href', '/logout');
}

$(document).ready(function() {

    $('#dropdown').toggle();
        $('#menu').click(function(){
            $('#dropdown').toggle();
        });
        $('a').click(function(){
            $('#dropdown').toggle();
        });
    
    ajaxCall('GET', '/sessionAccount', '', getBooks);
});



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

        }
    }
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

