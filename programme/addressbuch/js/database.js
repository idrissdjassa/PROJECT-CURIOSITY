var databaseHandler = {
    db: null,
    createDatabase: function(){
        this.db = window.openDatabase(
            "addressbuch.db",
            "1.0",
            "addressbuch database",
            1000000);
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
    
    }
};

var addressbasehandler={
    addAdress: function(firmaname, name, vorname, postleihzahl, stadt, land, addresszusatz, strasse, nummer, email, telephon, anzst, gewicht){
        databaseHandler.db.readTransaction(
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
        databaseHandler.db.readTransaction(
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
        databaseHandler.db.transaction(
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
        databaseHandler.db.transaction(
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