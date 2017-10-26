
 var Common = {
   jlert: function(text){ alert(text) },
   TimeFormatYMhms: function (time){
     var year = time.getFullYear();
     var month = time.getMonth();
     var day = time.getDate();
     var hours = time.getHours();
     var min = time.getMinutes();
     var sec = time.getSeconds();

     if (parseInt(month)< 10){
       month = '0' + month;
     }

     if (parseInt(day)< 10){
       day = '0' + day;
     }

     if (parseInt(hours)< 10){
       hours = '0' + hours;
     }

     if (parseInt(min)< 10){
       min = '0' + min;
     }

     if (parseInt(sec)< 10){
       sec = '0' + sec;
     }
     return year + "-" + month + "-" + day + " " + hours + ":" + min + ":" + sec
   }
 }
