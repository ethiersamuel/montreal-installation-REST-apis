$(document).ready(function () {
    //This event populates the list of the dropdown button on index.pug
    /*$("#btn_Search_Name").click(function () {
       
        //To clear the table to be ready for another search
        $("tbody").empty();
        request.open("GET", "/installations", true);
        $.getJSON("/installations", function (data, status) {
            if (status == "success") {
                var installations = data;
                var name_Installation;
                var content = null;
                //Generate the list of installation to put in the dropdown button
                for (var installation in installations) {
                    name_Installation = installations[installation].name;
                    content += "<li><a href=\"#\">" + name_Installation + "</a></li>";
                }
                $("ul").append(content);
            }else{
                $("body").empty();
                $("body").append("<h1>Une erreur est survenu, nos développeurs tente présentement de régler le problème. Veuillez patienter.");
            }
        });
        request.send();
    });*/
    var request = new XMLHttpRequest();
    request.open("GET", "/installations", true);
    //console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
    $.getJSON("/installations", function (data, status) {
        console.log("dans");
        if (status == "success") {
            var installations = data;
            var name_Installation;
            var content = "<select class=\"form-control\" id=\"name\">";
            //Generate the list of installation to put in the dropdown button
            for (var installation in installations) {
                name_Installation = installations[installation].name;
                content += "<option class=\"opt\">" + name_Installation + "</option>";
            }
            content += "</select>";
            $("label").append(content);
        } else {
        console.log("error");        
            $("body").empty();
            $("body").append("<h1>Une erreur est survenu, nos développeurs tente présentement de régler le problème. Veuillez patienter.</h1>");
        }
    });
    console.log("apres");
    
    request.send();

    //This event show will provide you a table of the information of the installation that you have click on
    $(".opt").click(function (event) {
        console.log("ok");
        //var target = getEventTarget(event);
        //var installation_Name = $(this).find(target).text();
        var request = new XMLHttpRequest();
        //To renew the table

        $("tbody").empty();
        request.open("GET", "/installations", true);
        $.getJSON("/installations", function (data, status) {
            //A table will be create in html and append in the index.pug to the tbody
            if (status == "success") {
                var content = "<tr><th>ID</th><th>Type</th><th>Nom</th><th>Arrondissement</th></tr>";
                var name_Installation;
                var installations = data;
                for (var installation in installations) {
                    if ((installations[installation].name)[0] === installation_Name) {
                        area_Installation = installations[installation].area;
                        name_Installation = installations[installation].name;
                        id_Installation = installations[installation]._id;
                        type_Installation = installations[installation].type;
                        content += "<tr><td>" + id_Installation + "</td><td>" + type_Installation + "</td><td>" + name_Installation + "</td><td>" + area_Installation + "</td></tr>";
                        break;
                    }
                }
                $("tbody").append(content);
            } else {
                $("body").empty();
                $("body").append("<h1>Une erreur est survenu, nos développeurs tente présentement de régler le problème. Veuillez patienter.");
            }
        });
        request.send();
    });

});
//Which element in the list of the dropdown has been click
function getEventTarget(event) {
    event = event || window.event;
    return event.target || event.srcElement;
}