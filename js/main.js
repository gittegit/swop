DB.connect("restless-bolt-1", function() {
    showMessages();
});

function leaveMessage(name, message) {
    //Create new message object
    var msg = new DB.Message();
    //Set the properties
    msg.name = name;
    msg.message = message;
    msg.date = new Date();
    //Insert it to the database
    msg.insert().then(showMessages);
}

function showMessages() {
    DB.Message.find()
        .descending("date")
        .limit(30)
        .resultList()
        .then(function(result) {
            var html = "";
            result.forEach(function(msg) {
                html += '<div class="col-md-4"><h2>';
                html += msg.name + '</h2><p>' + msg.message + '</p></div>';
            });
            document.getElementById("messages").innerHTML = html;
        });
}