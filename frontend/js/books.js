$(document).ready(function(){

    //Book description
    $(document).on('click','.btn-book-show-description',function(){
        var bookID = $(this).data('id');
        var parent = $(this).parent().parent();
        $.ajax({
            url:`${API_HOST}/book/${bookID}`,
            method:'GET',
            dataType:'json'
        }).done(function(result){
            parent.find('.book-description').html(result.success[0].description).toggle();
        });
    });

    // removing book
    $(document).on('click','.btn-book-remove',function(){

        var bookID = $(this).data('id');
        var row = $(this);
        $.ajax({
            url:`${API_HOST}/book/${bookID}`,
            method:'DELETE',
            dataType:'json'
        }).done(function(result) {
            // remove from the DOM tree
            row.parent().parent().parent().remove();
        });
    });


    // editing a book
    $('#bookEditSelect').on('change', function(e) {
        var bookID = $(this).val();
        $('#bookEdit').show();
        $.ajax({
            url:`${API_HOST}/book/${bookID}`,
            method:'GET',
            dataType:'json'
        }).done(function(result) {
            var title = $('#bookEdit').find("#title");
            var description =  $('#bookEdit').find("#description");
            title.val(result.success[0].title);
            description.val(result.success[0].description);
            bookEdit(`${bookID}`);
        });

    });


    function bookEdit(bookID) {
        $('#bookEdit').on('submit', function (e) {
            e.preventDefault();
            var title = $('#bookEdit').find("#title").val();
            var description = $('#bookEdit').find("#description").val();
            if (title.length == 0 && description.length == 0) {
                return;
            }
            $.ajax({
                url:`${API_HOST}/book/`+bookID,
                data:{
                    id: bookID,
                    title: title,
                    description: description
                },
                method:"PATCH",
                dataType:"json"
            }).done(function (result) {
                 // remove from list
                $('#bookEdit').hide();
            }).fail(function (xhr, cod) {
                console.log(xhr, cod);
            })
        });
    }


    // dokończyć !!!
    // function bookRefresh(bookID) {
    //         $.ajax({
    //             url:`${API_HOST}/book/`+bookID,
    //             data:{
    //                 id: bookID,
    //                 title: title,
    //                 description: description
    //             },
    //             method:"GET",
    //             dataType:"json"
    //         }).done(function (result) {
    //             // remove from list
    //             $('#bookEdit').hide();
    //
    //
    //
    //
    //         }).fail(function (xhr, cod) {
    //             console.log(xhr, cod);
    //         })
    //     });
    // }


   // Submit
    $('#bookAdd').on('submit',function(e){
        e.preventDefault();

        var title = $('#title').val();
        var description = $('#description').val();
        if(title.length==0 && description.length==0){
            return;
        }
        $.ajax({
            url:`${API_HOST}/book`,
            data:{
                title: title,
                description: description
            },
            method:"POST",
            dataType:"json"
        }).done(function(result){
            addBook(result.success[0]);
        }).fail(function(xhr,cod){
            console.log(xhr,cod);
        })
    });


    //adding a book
    function addBook(book){
        var element = `<li class="list-group-item">
                        <div class="panel panel-default">
                            <div class="panel-heading">
                                <span class="bookTitle">${book.title}</span>
                                <button data-id="${book.id}" class="btn btn-danger pull-right btn-xs btn-book-remove"><i class="fa fa-trash"></i>
                                </button>
                                <button data-id="${book.id}" class="btn btn-primary pull-right btn-xs btn-book-show-description"><i class="fa fa-info-circle"></i>
                                </button>
                            </div>
                            <div class="panel-body book-description">${book.description}</div>
                        </div>
                    </li>`;
        // adding to the DOM tree
        $('#booksList').append(element);
        var select = `<option value="${book.id}"> -- ${book.title} --</option>`;
        $('#bookEditSelect').append(select);
    }


    // downloading books
    $.ajax({
        url:`${API_HOST}/book`,
        method:'GET',
        dataType:'json'
    }).done(function(result){
        result.success.forEach((e)=>addBook(e));
    });
});