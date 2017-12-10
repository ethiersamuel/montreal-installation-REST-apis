$(document).ready(function () {

    //This event populates the list of the dropdown button on index.pug
    $.getJSON("/installations", function (data, status) {
        if (status == "success") {
            var installations = data;
            var name_Installation;
            var content;
            //Generate the list of installation to put in the dropdown button
            for (var installation in installations) {
                name_Installation = installations[installation].name;
                content += "<option>" + name_Installation + "</option>";
            }
            $("select").append(content);
        } else {
            $("body").empty();
            $("body").append("<h1>Une erreur est survenu, nos développeurs tente présentement de régler le problème. Veuillez patienter.");
        }
    });



    //This event show will provide you a table of the information of the installation that you have click on
    $('#name').change(function () {
        var name = this.value;

        //request.open("GET", "/installations", true);
        $.getJSON("/installations", function (data, status) {
            //A table will be create in html and append in the index.pug to the tbody
            if (status == "success") {
                //To clean the table before refill it
                $("tbody").empty();
                installation_Properties_Html(name, data);
            } else {
                $("body").empty();
                $("body").append("<h1>Une erreur est survenu, nos développeurs tente présentement de régler le problème. Veuillez patienter.");
            }
        });
    });
});

function installation_Properties_Html(name, data) {
    var content = "<tr><th>ID</th><th>Type</th><th>Nom</th><th>Arrondissement</th><th>Condition</th></tr>";
    var installations = data;
    for (var installation in installations) {
        if ((installations[installation].name) == name) {
            var area_Installation = installations[installation].area;
            var name_Installation = installations[installation].name;
            var id_Installation = installations[installation]._id;
            var type_Installation = installations[installation].type;
            var condition_Installation = installations[installation].condition;
            content += "<tr><td>" + id_Installation + "</td><td>" + type_Installation + "</td><td>" +
                name_Installation + "</td><td>" + area_Installation + "</td><td>" + condition_Installation + "</td></tr>";
            break;
        }
    }
    $("tbody").append(content);
}