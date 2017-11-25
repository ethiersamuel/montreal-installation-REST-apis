$(document).ready(function () {
    $("#btn_Search").click(function () {
        alert('ok');
        var request = new XMLHttpRequest();
        var area = document.getElementById('search').value;

        request.open("GET", "http://localhost:3000/installations?arrondissement=" + area, true);

        $.getJSON("http://localhost:3000/installations?arrondissement=" + area, function (data, status) {
            
            alert("Data: " + data + "\nStatus: " + status);
            var installations = request.response;
            //installations
            var area_Installation;
            console.log(data);
            for (var installation in installations) {
                area_Installation = installations[installation].arrondissement.nom_arr;

                //content = content+"<tr><th>" + ;

            }
            $("tbody").append("<tr><th>!!!!!!!!!!!!!!!!!!!</th></tr>");
            //var tbody = document.getElementsByTagName("tbody");
            //tbody.innerHTML = data;
            //document.getElementById("count").innerHTML = tbody.getElementsByTagName("tr").length;
        });
        /*var request = new XMLHttpRequest();
        var area = document.getElementById('search').value;
        request.open("GET", "http://localhost:3000/installations?arrondissement=" + area, true);
        request.onreadystatechange = function () {
            if (request.readyState === 4 && request.status === 200) {
                var installations = request.response;
                var area_Installation;
                content = "<tbody><tr>Installations de l'arrondissement " + area + "</tr><tr><th>area</th></tr>";
                console.log(installations);
                for (var installation in installations) {
                    area_Installation = installations[installation].area;

                    content += "<tr><td>" + area_Installation + "</td></tr>";
                }
                content += "</tbody>";
                document.write(content);
                alert('ok');
            var tbody = document.getElementsByTagName("tbody");
                alert(tbody);
                tbody.innerHTML = "<tr>!!!!!!!!!!!!!!!!!!!!!!!11</tr>";
                document.write("<tbody><tr>!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1</tr></tbody>");
                document.getElementById("count").innerHTML = tbody.getElementsByTagName("tr").length;
            }
};*/
        request.send();
    });
});