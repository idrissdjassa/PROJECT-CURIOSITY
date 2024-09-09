
var app = {
    db: null,
    createDatabase: function(){
        this.db = window.openDatabase(
            "addressbuchs.db",
            "1.0",
            "addressbuch database",
            100000);
        this.db.transaction(
            function(tx){
                //Run sql here using tx
                tx.executeSql(
                    "create table if not exists addressbuch(_id integer primary key, firmaname text, name text, vorname text, postleihzahl text, stadt text, land text, addresszusatz text, strasse text, nummer text, email text, telephon text, anzst text, gewicht text)",
                    [],
                    function(tx, results){},
                    function(tx, error){
                        console.log("Error while creating the table: " + error.message);
                    }
                );
            },
            function(error){
                console.log("Transaction error: " + error.message);
            },
            function(){
                console.log("Create DB transaction completed successfully");
            }
        );
    
    },
    addressid: null,

    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
     //   $("#adrsp").click(this.saveadress.bind(this));
      //  $("#adrbu").click(this.loadAddress(this.displayAddress).bind(this));
      $("#dhldr").click(this.dhllabel.bind(this));
      $("#zuruck").click(this.zuruck.bind(this));

      

    },
    onDeviceReady: function(){
        this.createDatabase();
    },

    dhllabel: function(){
        var firmaname = $("#firmaname").val();  
        var name = $("#name").val();
        var vorname = $("#vorname").val();
        var plz = $("#plz").val();
        var stadt=$("#std").val();
        var land=$("#land").val();
        var addrz=$("#azs").val();
        var strasse=$("#str").val();
        var strassenummer=$("#strnr").val();
        var email=$("#email").val();
        var telephon=$("#phonenr").val(); 
        var anzahl_der_stuecke=$("#anz").val();
        var gewicht=$("#gew").val();

        if (!name || !plz || !stadt || !land || !strasse || !strassenummer){
            alert("Die Adresse ist unvollständig");

        }else{
            window.location.href="dhllabel.html";
            document.getElementById("dhl1").innerText =firmaname;


            
        }
        

    },
    zuruck: function(){
        window.location.href="index.html";
    },

    displayAddress: function(results){
        var length = results.rows.length;
        $("#addres-list").empty();

        for(var i=0; i<length; i++){
            var item = results.rows.item(i);
            $("#addres-list").append(app.createAdress(item._id, item.name));

        }

        $(".addElement").click(function(event){
            app.addressid = event.target.id;
        });

        window.location.href="loadadr.html";

    },

    createAdress: function(id, name){
        var element = document.createElement("button");
        element.innerHTML = name;
        element.id = id;
        element.className = "addElement btn btn-primary btn-lg";
        element.type = "button";
        return element;
    },
    
    saveadress: function(){
        var firmaname = $("#firmaname").val();  
        var name = $("#name").val();
        var vorname = $("#vorname").val();
        var plz = $("#plz").val();
        var stadt=$("#std").val();
        var land=$("#land").val();
        var addrz=$("#azs").val();
        var strasse=$("#str").val();
        var strassenummer=$("#strnr").val();
        var email=$("#email").val();
        var telephon=$("#phonenr").val(); 
        var anzahl_der_stuecke=$("#anz").val();
        var gewicht=$("#gew").val();

        if (!name || !plz || !stadt || !land || !strasse || !strassenummer){
            alert("Die Adresse ist unvollständig");

        }else{
            this.addAdress(firmaname, name, vorname, plz, stadt, land, addrz, strasse, strassenummer, email, telephon, anzahl_der_stuecke, gewicht);
        }
        
      
    },

    addAdress: function(firmaname, name, vorname, postleihzahl, stadt, land, addresszusatz, strasse, nummer, email, telephon, anzst, gewicht){
        app.db.readTransaction(
            function(tx){
                tx.executeSql(
                    "insert into addressbuch(firmaname, name, vorname, postleihzahl, stadt, land, addresszusatz, strasse, nummer, email, telephon, anzst, gewicht) values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                    [firmaname, name, vorname, postleihzahl, stadt, land, addresszusatz, strasse, nummer, email, telephon, anzst, gewicht],
                    function(tx, results){},
                    function(tx, error){
                        console.log("add address error: "+error.message);
                    }

                );
            },
            function(error){},
            function(){}
        );
    },
    loadAddress: function(displayAddress){
        app.db.readTransaction(
            function(tx){
                tx.executeSql(
                    "select * from addressbuch",
                    [],
                    function(tx, results){
                        //Do the display
                        displayAddress(results);
                    },
                    function(tx, error){//TODO: Alert the message to user
                        console.log("Error while selecting the Adress" + error.message);
                    }
                );
            }
        );
    },
    deleteAddress:function(_id){
        this.db.transaction(
            function(tx){
                tx.executeSql(
                    "delete from addressbuch where _id = ?",
                    [_id],
                    function(tx, results){},
                    function(tx, error){//TODO: Could make an alert for this one.
                        console.log("Error happen when deleting: " + error.message);
                    }
                );
            }
        );
    },
    updateProduct: function(_id, firmaname, name, vorname, postleihzahl, stadt, land, addresszusatz, strasse, nummer, email, telephon, anzst, gewicht){
        this.db.transaction(
            function(tx){
                tx.executeSql(
                    "update product set firmaname=?, name=?, vorname=?, postleihzahl=?, stadt=?, land=?, addresszusatz=?, strasse=?, nummer=?, email=?, telephon=?, anzst=?, gewicht=? where _id = ?",
                    [firmaname, name, vorname, postleihzahl, stadt, land, addresszusatz, strasse, nummer, email, telephon, anzst, gewicht, _id],
                    function(tx, result){},
                    function(tx, error){//TODO: alert/display this message to user
                        console.log("Error updating address" + error.message);
                    }
                );
            }
        );
    }


};

app.initialize();

