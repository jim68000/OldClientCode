function loaded(e) {

    var data = [];
    var catobj = [];
    var tmpob;
    var rex;
    var x = new DOMParser().parseFromString(e, 'text/xml');
    var cats = x.getElementsByTagName('category');


    for (var j = 0; j < cats.length; j++) {
        //console.log(cats.length);
        var tcat = {};

        try {
            tcat.id = cats[j].getElementsByTagName('category-id')[0].textContent;
            tcat.title = cats[j].getElementsByTagName('title')[0].textContent;
            catobj.push(tcat);
        } catch(e) {
            console.log(e.message);
        }

        rex = cats[j].getElementsByTagName('recommendation');

        for (var i = 0; i < rex.length; i++) {
            try {
                tmpob = {};
                tmpob.category = cats[j].getElementsByTagName('category-id')[0].textContent || '@EMPTY@';
                tmpob.id = rex[i].getElementsByTagName('id')[0].textContent || '@EMPTY@';
                tmpob.packageName = rex[i].getElementsByTagName('package-name')[0].textContent || '@EMPTY@';

                tmpob.name = rex[i].getElementsByTagName('name')[0].textContent || '@EMPTY@';
                tmpob.icon = rex[i].getElementsByTagName('icon')[0].textContent || '@EMPTY@';
                tmpob.shortDescription = rex[i].getElementsByTagName('short-description')[0].textContent || '@EMPTY@';
                tmpob.longDescription = rex[i].getElementsByTagName('long-description')[0].textContent || '@EMPTY@';
                tmpob.cost = rex[i].getElementsByTagName('cost')[0].textContent || '@EMPTY@';


                tmpob.position = rex[i].getElementsByTagName('position')[0].textContent || '@EMPTY@';
                tmpob.type = rex[i].getElementsByTagName('type')[0].textContent || '@EMPTY@';
                tmpob.publishedDate = rex[i].getElementsByTagName('published-date')[0].textContent || '@EMPTY@';
                tmpob.releaseDate = rex[i].getElementsByTagName('release-date')[0].textContent || '@EMPTY@';
                tmpob.catalogueDate = rex[i].getElementsByTagName('catalogue-date')[0].textContent || '@EMPTY@';
                tmpob.promotion = rex[i].getElementsByTagName('promotion')[0].textContent || '@EMPTY@';
                data.push(tmpob);
            } catch(e) {
                console.log(e);
            }

        }
        rex = [];



    }





    var db = openDatabase('topapps', '', 'Top Apps', 1048576);


    db.transaction(function(tx) {
        tx.executeSql('CREATE TABLE IF NOT EXISTS categories(title TEXT, id TEXT)')
    });


    db.transaction(function(tx) {
        for (var i = 0; i < catobj.length; i++) {
            tx.executeSql('INSERT INTO categories VALUES(?, ?)', [catobj[i].title, catobj[i].id])
        }
    });

    db.transaction(function(tx) {
        tx.executeSql('CREATE TABLE IF NOT EXISTS recommends(category TEXT, id TEXT, packageName TEXT, name TEXT, icon TEXT, shortDescription TEXT, longDescription TEXT, cost TEXT, position TEXT, type TEXT, publishedDate DATE, releaseDate DATE, catalogueDate DATE, promotion BOOLEAN)')
    });


    db.transaction(function(tx) {
        for (var i = 0; i < data.length; i++) {
            // gnarly
			tx.executeSql('INSERT INTO recommends VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [data[i].category, data[i].id,
            data[i].packageName, data[i].name, data[i].icon, data[i].shortDescription, data[i].longDescription, data[i].cost, data[i].position, data[i].type, (new Date(data[i].publishedDate.split(" ")[0].split("/")[2], data[i].publishedDate.split(" ")[0].split("/")[1], data[i].publishedDate.split(" ")[0].split("/")[0], data[i].publishedDate.split(" ")[1].split(":")[0], data[i].publishedDate.split(" ")[1].split(":")[1], data[i].publishedDate.split(" ")[1].split(":")[2], 0)).getTime(), (new Date(data[i].releaseDate.split(" ")[0].split("/")[2], data[i].releaseDate.split(" ")[0].split("/")[1], data[i].releaseDate.split(" ")[0].split("/")[0], data[i].releaseDate.split(" ")[1].split(":")[0], data[i].releaseDate.split(" ")[1].split(":")[1], data[i].releaseDate.split(" ")[1].split(":")[2], 0)).getTime(), (new Date(data[i].catalogueDate.split(" ")[0].split("/")[2], data[i].catalogueDate.split(" ")[0].split("/")[1], data[i].catalogueDate.split(" ")[0].split("/")[0], data[i].catalogueDate.split(" ")[1].split(":")[0], data[i].catalogueDate.split(" ")[1].split(":")[1], data[i].catalogueDate.split(" ")[1].split(":")[2], 0)).getTime(), data[i].promotion])

;

        }
    });

}

function notloaded(e) {
    console.log('notloaded');
}




xhr.do('example-de-catalogue.xml', loaded, notloaded);