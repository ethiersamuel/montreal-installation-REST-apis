//$(document).ready(function () {

    //This event will execute a research in the database about the area that you have enter so you'll see every installations in the 
    //the area that you have entered
    $("#btn_Search").click(function () {
        var request = new XMLHttpRequest();
        var area = document.getElementById('search').value;
        //To clear the table to be ready for another search
        $("tbody").empty();
        request.open("GET", "/installations?arrondissement=" + area, true);
        $.getJSON("/installations?arrondissement=" + area, function (data, status) {
            //A table will be create in html and append in the index.pug to the tbody
            if (status == "success") {
                var content = "<tr><th>ID</th><th>Type</th><th>Nom</th><th>Arrondissement</th><th>Condition</th></tr>";
                var installations = data;
                var area_Installation;
                var name_Installation;
                var id_Installation;
                var type_Installation;
                var condition_Installation;
                for (var installation in installations) {
                    area_Installation = installations[installation].area;
                    name_Installation = installations[installation].name;
                    id_Installation = installations[installation]._id;
                    type_Installation = installations[installation].type;
                    condition_Installation = installations[installation].condition;
                    content += "<tr><td>" + id_Installation + "</td><td>" + type_Installation + "</td><td>"
                     + name_Installation + "</td><td>" + area_Installation + "</td><td>" + condition_Installation + "</td></tr>";
                }
                $("tbody").append(content);
            }else{
                $("body").empty();
                $("#table").append("<h1>Une erreur est survenu, nos développeurs tente présentement de régler le problème. Veuillez patienter.");
            }
        });
        request.send();
    });
//});