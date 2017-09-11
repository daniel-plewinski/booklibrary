// add author
$('#authorAdd').on('submit',function(e){
    e.preventDefault();

    var name = $('#name').val();
    var surname = $('#surname').val();
    if(name.length==0 && surname.length==0){
        return;
    }
    $.ajax({
        url:`${API_HOST}/author`,
        data:{
            name: name,
            surname: surname
        },
        method:"POST",
        dataType:"json"
    }).done(function(result){
        addAuthor(result.success[0]);
        showModal('Autor został dodany');
    }).fail(function(xhr,cod){
        console.log(xhr,cod);
        showModal('Wystąpił błąd podczas dodawania autora');
    })
});

//adding an author
function addAuthor(author){
    var element = `<li class="list-group-item">
                        <div class="panel panel-default">
                            <div class="panel-heading">
                                <span class="authorTitle">${author.name} ${author.surname}</span>
                                <button data-id="${author.id}" class="btn btn-danger pull-right btn-xs btn-book-remove"><i class="fa fa-trash"></i>
                                </button>
                                 <button data-id="${author.id}" class="btn btn-primary pull-right btn-xs btn-author-books"><i class="fa fa-book"></i></button>
                            </div>
                             <ul class="authorBooksList"></ul>
                        </div>
                    </li>`;
    //adding to the DOM tree
    $('#authorsList').append(element);
    var select = `<option value="${author.id}"> -- ${author.name} ${author.surname} --</option>`;
    $('#authorEditSelect').append(select);
}

// Author booklist
$(document).on('click','.btn-author-books',function(){

    var authorID = $(this).data('id');
    var parent = $(this).parent().parent();

    // because of toggle element must be emptied before next toggle to avoid showing many times
    parent.find('.authorBooksList').empty();

    $.ajax({
        url:`${API_HOST}/author/`+authorID,
        method:'GET',
        dataType:'json'
    }).done(function(result){
        parent.find('.authorBooksList').toggle();
        for (var i=0; i<result.success[0].books.length; i++) {
            parent.find('.authorBooksList').append('<li>' + `${result.success[0].books[i].title}`+'</li>');
        }
    });

});


// editing an author
$('#authorEditSelect').on('change', function(e) {
    var authorID = $(this).val();
    $('#authorEdit').show();
    $.ajax({
        url:`${API_HOST}/author/${authorID}`,
        method:'GET',
        dataType:'json'
    }).done(function(result) {
        var name = $('#authorEdit').find("#name");
        var surname =  $('#authorEdit').find("#surname");
        name.val(result.success[0].name);
        surname.val(result.success[0].surname);
        authorEdit(`${authorID}`);
        showModal('Autor został zmieniony');
    });
});

function authorEdit(authorID) {
    $('#authorEdit').on('submit', function (e) {
        e.preventDefault();
        var name = $('#authorEdit').find("#name").val();
        var surname = $('#authorEdit').find("#surname").val();
        if (name.length == 0 && surname.length == 0) {
            return;
        }
        $.ajax({
            url:`${API_HOST}/author/`+ authorID,
            data:{
                id: authorID,
                name: name,
                surname: surname
            },
            method:"PATCH",
            dataType:"json"
        }).done(function (result) {
            // remove from list
            $('#authorEdit').hide();
        }).fail(function (xhr, cod) {
            console.log(xhr, cod);
        })
    });
}

// downloading authors
$.ajax({
    url:`${API_HOST}/author`,
    method:'GET',
    dataType:'json'
}).done(function(result){
    result.success.forEach((e)=>addAuthor(e));
});


// removing author
$(document).on('click','.btn-book-remove',function(){

    var authorID = $(this).data('id');
    var row = $(this);
    $.ajax({
        url:`${API_HOST}/author/${authorID}`,
        method:'DELETE',
        dataType:'json'
    }).done(function(result) {
        // remove from the DOM tree
        row.parent().parent().parent().remove();
        showModal('Autor został usunięty');
    });
});
