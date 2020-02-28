
// fetch session status

function authorize(response) {
    if (response.session == 'user') {
        // add dynamic html tailored for the user view
        // this includes seller contact info
        ajaxCall('GET', '/sessionName','json', update);
        $('#aLogin').html("Log out").attr('href', '/logout');
        
    } else if (response.session == 'admin') {
        // add dynamic html tailored for the admin view
        // delete listings
		$('#name').html().append("(admin)")
		let numListings = $('#myTable tr').length-1
		for (let i=0;i<numListings;i++){
			$('#'+i).append("<td><i class='fa fa-trash fa-fw w3-margin-right w3-large w3-text-brown'>")
		} 
        ajaxCall('GET', '/sessionName','json', update);
        $('#aLogin').html("Log out").attr('href', '/logout');
    }
}

// DEFAULT HTML: tailored for the VISITOR view
// seller contact shouldn't be visible
// add message telling visitor to register
// seller profile links redirect to login

$(document).ready(function() {
	ajaxCall('GET', '/sessionName','json', update);
	ajaxCall('GET','/listings','json',formatResponse)
	$('#dropdown').toggle();
	$('#menu').click(function(){
		$('#dropdown').toggle();
	});
	$('a').click(function(){
		$('#dropdown').toggle();
	});
	
    $('#filter').on('submit', function(e) {
        e.preventDefault();
        let button = $(this);
        let data = formatRequest(button);
        var url = "/listings/";
        var isfirst = true;
        if (data.textbook) {
			if (isfirst){
            	url += '?textbook=' + data.textbook;
				isfirst = false;
			}else{
            	url += '&textbook=' + data.textbook;
			}
    
        } if (data.course) {
			if (isfirst){
				url += '?course=' + data.course;
				isfirst = false;
			}else{
				url += '&course=' + data.course;
			}
        } if (data.seller) {
			if (isfirst){
            	url += '?seller=' + data.seller;
				isfirst = false;
			}else{
            	url += '&seller=' + data.seller;
			}
        } if (data.isbn){
			if (isfirst){
				isfirst = false;
            	url += '?isbn=' + data.isbn;
			}else{
            	url += '&isbn=' + data.isbn;
			}
        
        } if (data.author){
			if (isfirst){
				isfirst = false;
            	url += '?author=' + data.author;
			}else{
            	url += '&author=' + data.author;
			}
        }
        
        ajaxCall('GET', url, '', formatResponse);
    })
    
})


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

function formatResponse(response) {
    $('#myTable').empty();
	$('#myTable').append("<tr id='head'>");
	$('#head').append("<th>TextBook");
	$('#head').append("<th>Details");
	$('#head').append("<th>NOTES");
 	$('#head').append("<th>SELLER");
	$('#head').append("<th><i class='fa fa-trash-o fa-fw w3-large w3-text-white'></i></th>");	

	for (let i=0; i<response.sData.length;i++){
		let listing = response.sData[i];
		let resCourses = "";
		for (let j=0; j<response.sData[i].listing.courses.length;j++){
			resCourses+= response.sData[i].listing.courses[j] + " "
		}
		$('#myTable').append("<tr id ='"+i+"'>");
		$('#'+i).append("<td>Name: "+response.sData[i].listing.textbook+"<br>Author: "+response.sData[i].listing.author);
		$('#'+i).append("<td>ISBN: "+response.sData[i].listing.isbn+"<br>Required For:"+ resCourses+ "<br>Price: "+response.sData[i].listing.price);
		$('#'+i).append("<td>"+response.sData[i].listing.notes);
		if (response.sData[i].seller){
			$('#'+i).append("<td>User Name: <a href= '/profile?user="+response.sData[i].seller.username+"'>" +response.sData[i].seller.username+"</a><br>Email: "+ response.sData[i].seller.email+"<br>Phone#: "+ response.sData[i].seller.phonenum);
		}else{
			$('#'+i).append("<td>Login/Register now to view contact info");
		}
			
		
		
	}
		ajaxCall('GET', '/session', '', authorize);
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
function update(response){
	if (response.name){
		$('#name').html('Hi, '+response.name);
	}else{
		$('#name').html("Hi, please <a href ='/login'>login/register</a>")
	}
}