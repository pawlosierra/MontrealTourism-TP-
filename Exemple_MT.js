
var http = require('http');
var formidable = require('formidable');
var fs = require('fs');
var mysql = require('mysql');
var page;
var page2;

//var hotel = [{ id: "s_1", desc: "1 star" },
//             { id: "s_2", desc: "2 stars" },
//             { id: "s_3", desc: "3 stars" },
//             { id: "s_4", desc: "4 stars" },
//             { id: "s_5", desc: "5 stars" }
//            ];

//var room = [ {id: "single-room" , desc : "Single room"},
//             {id: "semi-suite" , desc : "Semi-suite"},
//             {id: "suite" , desc : "Suite"},
//             {id: "double-suite" , desc : "Double suite"}
//            ]

//var acty = [{ id: "bus_tour", desc: "City-bus-tours", price: "20" },
//            { id: "spa", desc: "Spa-Manage", price: "100" },
//            { id: "sport", desc: "Sport Event", price: "150" },
//            { id: "bike", desc: "Bike", price: "50" }
//          ]

http.createServer(function (req, res) {
  var form = new formidable.IncomingForm();
  
  if ((req.url == '/mtData') && (page != undefined)) {
      form.parse(req, function (err, fields, files) {
      //var w = 'family_name: ' + fields.user_sname + '\r\n' +
      //  'given_name: ' + fields.user_gname + '\r\n' +
      //  'sex: ' + fields.user_sex + '\r\n' +
      //  'num_visitors: ' + fields.s_box_number + '\r\n' +
      //  'duration: ' + fields.s_box_duration + '\r\n' +
      //  'hotel_stars: ' + fields.s_box_hotel + '\r\n' +
      //  'room_type: ' + fields.s_box_rtype + '\r\n' +
      //        'activities: ';
      var con = mysql.createConnection({
         host: "localhost",
         user: "root",
         password: "",
         database: "mtdb1",
         multipleStatements: true    // to allow multiple statements in a query
      });

      //acty.forEach(ligne => { w = w + (fields["c_" + ligne.id] ? ligne.id + ' ' : ''); });
      //w = w + '\r\n------------\r\n';
      //fs.appendFile('mt.txt', w,
      //  function (err) {
      //    if (err) throw err;
      //    console.log(fields);
      //    console.log(fields.user_gname + ' ' + fields.user_sname + ' data saved in mt.txt');
      //    res.writeHead(200, { 'Content-Type': 'text/html' });
      //    res.write(page);
      //    res.write(page2);
      //    res.write('<script> document.getElementById("rp").innerHTML = "Data successfully saved  at <br> "+Date(); </script>');
      //    res.end();
      //  });

          con.connect(function (err) {
              if (err) throw err;
              console.log("Connected");

              var sql = "SET AUTOCOMMIT = OFF ;";
              // sql+= "INSERT INTO students (fam_name, giv_name) VALUES ('" + fields.user_sname + "', '" + fields.user_gname + "') ;";
              sql += "INSERT INTO visitors (fam_name, giv_name, sex, num_perso, num_days, hotel_type, room_type) VALUES (?, ?, ?, ?, ?, ?, ?) ;";
              acty.forEach(ligne => {
                  if (fields[ligne.id_act]) {
                      sql += "INSERT INTO enrollments(id_v, id_act) VALUES (LAST_INSERT_ID(), '" + ligne.id_act + "') ;"
                  }
              });
              sql += "COMMIT ;"
              console.log(sql);

              // con.query(sql, function (err, result) {
              con.query(sql, [fields.user_sname, fields.user_gname, fields.user_sex, fields.s_box_number, fields.s_box_duration,
              fields.s_box_hotel, fields.s_box_rtype], function (err, result) {
                  if (err) throw err;
                  con.end(function (err) {
                      if (err) {
                          return console.log('error:' + err.message);
                      }
                      console.log('Database connection closed.');
                      console.log(fields.user_gname + ' ' + fields.user_sname + ' data saved');
                      res.writeHead(200, { 'Content-Type': 'text/html' });
                      res.write(page);
                      res.write(page2);
                      res.write('<script> document.getElementById("rp").innerHTML = "Data successfully saved  at <br> "+Date(); </script>');
                      res.end();
                  });
              });
          });
    });
  }

  if ((req.url == '/') || (page == undefined)) {
    fs.readFile("MontrealTourism.html", function (err, data) {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        return res.end("404 Not Found");
      }
      page = data;
      page2 = '<script> ';
      //hotel.forEach(ligne=> {page2+=' add_Hotel_type("'+ligne.id+'", "'+ligne.desc+'"); ' });       
      //room.forEach(ligne => {page2+= ' add_Room_type("'+ ligne.id+'", "'+ligne.desc+'"); '});   
      //acty.forEach(ligne => { page2 += ' add_Activity("' + ligne.id + '", "' + ligne.desc + '", "' + ligne.price + '"); ' });
      //page2 += ' </script>';
      //res.writeHead(200, { 'Content-Type': 'text/html' });
      //res.write(data);
      //res.write(page2);
      //return res.end();
        var con = mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "",
            database: "mtdb1"
        });
        con.connect(function (err) {
            if (err) throw err;
            console.log("Connected");

            var sql = "SELECT * FROM hotel";
            con.query(sql, function (err, result, fields) {
                if (err) throw err;
                console.log(result);
                hotelList = result;     
            });    //

            var sql1 = "SELECT * FROM room";
            con.query(sql1, function (err, result1, fields) {
                if (err) throw err;
                console.log(result1);
                room = result1;
            });    // end 

            var sql2 = "SELECT * FROM activites";
            con.query(sql2, function (err, result2, fields) {
                if (err) throw err;
                console.log(result2);
                acty = result2;
            });    // end 

            con.end(function (err) {
                if (err) {
                    return console.log('error:' + err.message);
                }
                console.log('Database connection closed.');
                hotelList.forEach(ligne => { page2 += ' add_Hotel_type("' + ligne.id_ht + '", "' + ligne.desc_ht + '"); ' });
                room.forEach(ligne => { page2 += ' add_Room_type("' + ligne.id_rt + '", "' + ligne.desc_rt + '"); ' });
                acty.forEach(ligne => { page2 += ' add_Activity("' + ligne.id_act + '", "' + ligne.desc_act + '", "' + ligne.price + '"); ' });
                page2 += ' </script>';
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.write(page);
                res.write(page2);
                return res.end();
            });  // end con.end

        });  // end con1.connect 

    });
  }

  if (req.url == '/css/reset.css') {
    fs.readFile("css/reset.css", function (err, data) {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/css' });
        return res.end("404 Not Found");
      }
      res.writeHead(200, { 'Content-Type': 'text/css' });
      res.write(data);
      return res.end();
    });
  }

  if (req.url == '/css/mt.css') {
    fs.readFile("css/mt.css", function (err, data) {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/css' });
        return res.end("404 Not Found");
      }
      res.writeHead(200, { 'Content-Type': 'text/css' });
      res.write(data);
      return res.end();
    });
  }

}).listen(8080); 