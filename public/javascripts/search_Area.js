$(document).ready(function () {
    $("#btn_Search").click(function () {
        var request = new XMLHttpRequest();
        var area = document.getElementById('search').value;
        var content = "<tr><th>ID</th><th>Type</th><th>Nom</th><th>Arrondissement</th></tr>";

        $("tbody").empty();

        request.open("GET", "http://localhost:3000/installations?arrondissement=" + area, true);
        $.getJSON("http://localhost:3000/installations?arrondissement=" + area, function (data, status) {
            if (status == "success") {
                var installations = data;
                var area_Installation;
                var name_Installation;
                var id_Installation;
                var type_Installation;

                for (var installation in installations) {
                    area_Installation = installations[installation].area;
                    name_Installation = installations[installation].name;
                    id_Installation = installations[installation]._id;
                    type_Installation = installations[installation].type;

                    content += "<tr><td>" + id_Installation + "</td><td>" + type_Installation + "</td><td>" + name_Installation + "</td><td>" + area_Installation + "</td></tr>";
                }
                $("tbody").append(content);
                content = null;
            }else{
                $("body").empty();
                $("#table").append("<h1>Une erreur est survenu, nos développeurs tente présentement de régler le problème. Veuillez patienter.");
            }
        });
        request.send();
    });
});