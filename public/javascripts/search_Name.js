$(document).ready(function () {
    $("#btn_Search_Name").click(function () {
        var request = new XMLHttpRequest();
        $("tbody").empty();
        request.open("GET", "http://localhost:3000/installations", true);
        $.getJSON("http://localhost:3000/installations", function (data, status) {
            if (status == "success") {
                var installations = data;
                var name_Installation;
                var content = null;
                for (var installation in installations) {
                    name_Installation = installations[installation].name;
                    content += "<li><a href=\"#\">" + name_Installation + "</a></li>";
                }
                $("ul").append(content);
                content = null;
            }else{
                $("body").empty();
                $("body").append("<h1>Une erreur est survenu, nos développeurs tente présentement de régler le problème. Veuillez patienter.");
            }
        });
        request.send();
    });

    $("ul").click(function (event) {
        var target = getEventTarget(event);
        var installation_Name = $(this).find(target).text();
        var request = new XMLHttpRequest();
        $("tbody").empty();
        request.open("GET", "http://localhost:3000/installations", true);
        $.getJSON("http://localhost:3000/installations", function (data, status) {
            if (status == "success") {
                var content = "<tr><th>ID</th><th>Type</th><th>Nom</th><th>Arrondissement</th></tr>";
                var name_Installation;
                var installations = data;
                for (var installation in installations) {
                    if((installations[installation].name)[0] === installation_Name){
                        area_Installation = installations[installation].area;
                        name_Installation = installations[installation].name;
                        id_Installation = installations[installation]._id;
                        type_Installation = installations[installation].type;
                        content += "<tr><td>" + id_Installation + "</td><td>" + type_Installation + "</td><td>" + name_Installation + "</td><td>" + area_Installation + "</td></tr>";
                        break;
                    }
                }
                $("tbody").append(content);
                content = null;
            }else{
                $("body").empty();
                $("body").append("<h1>Une erreur est survenu, nos développeurs tente présentement de régler le problème. Veuillez patienter.");
            }
        });
        request.send();
    });
});

function getEventTarget(event) {
    event = event || window.event;
    return event.target || event.srcElement; 
}