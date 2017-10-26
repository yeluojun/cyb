var Item_html = {
  background: function(data){
    var size = (parseFloat(data.Size) / 1000 / 1000).toFixed(2);
    var str =
      "<div class=\"content-item background-item col-md-4\" data-url=\""+data.Url+"\" data-sort=\""+data.SortBy+"\" data-id=\"" + data.Id + "\">" +
        "<div class=\"row\">" +
         "<div class=\"img-div background-handle\">" +
            "<img src=\""+data.Url+"?imageView2/5/h/480\">" +
          "</div>" +
          "<div class=\"img-info-div\">" +
             "<div class=\"row img-info-div-row\">" +
               "<div class=\"col-md-8 img-name\">" +
                  "<span class=\"img-size\">(" + size  + "m)</span>" +
                  "<span class=\"img-title\">"+data.Title+"</span>" +
                  "<input type=\"text\" style=\"height: 40px; display: none;\" class=\"\" value=\""+data.Title+"\">" +
               "</div>" +
               "<div class=\"col-md-4\">" +
                 "<a class=\"btn btn-info\">查看大图</a>" +
               "</div>" +
             "</div>" +
             "<div class=\"img-checkbox\" style=\"display: none\">" +
               "<label style=\"width:100%; height: 100%;\">  <input class=\"icheck\" type=\"checkbox\" > </label>"
             "</div>"
          "</div>"
        "</div>"
      "</div>"
      return str
  },
  audio: function(data){
    var size = parseFloat(data.Size);
    if(size >= 1 * 1000 * 1000){
      size = (parseFloat(data.Size) / 1000 / 1000).toFixed(2) + 'm';
    }else if (size >= 1 * 1000) {
      size = (parseFloat(data.Size) / 1000 ).toFixed(2) + 'k';
    }else{
      size += 'b';
    }
    var str =
    "<tr data-id=\"" + data.Id + "\" data-sort=\"" + data.SortBy + "\" data-url=\"" + data.Url + "\" >" +
      "<td style=\"width: 5%;\" class=\"td-move\"><span class=\"glyphicon glyphicon-list\"></span></td>" +
      "<td style=\"width: 10%\"><label class=\"ickeck-label\"><input class=\"icheck\" type=\"checkbox\"/></label></td>" +
      "<td style=\"width: 20%\">" +
        "<span class=\"audio-title\" title=\"双击修改名称\">" + data.Title + "</span>" +
        "<div class=\"input-group\" style=\"display: none\">" +
          "<input type=\"text\" class=\"form-control\">" +
          "<div class=\"input-group-addon\"><a class=\"finish\">完成</a></div>" +
        "</div>" +
      "</td>" +
      "<td style=\"width: 20%\">" + size + "</td>" +
      "<td style=\"width: 40%\"><a class=\"audio-play\">点击预览</a></td>" +
    "</tr>"
    return str
  },
  lightmap: function(data){
    var str =
    "<div class=\" content-item lightmap-item\" data-url=\"" + data.Url + "\" data-sort=\"" + data.SortBy + "\" data-id=\"" + data.Id + "\">" +
    "  <div class=\"lightmap-top img-div\">" +
        "<img src=\"" + data.Url + "?imageView2/5/w/240/h/240\">" +
      "</div>" +
      "<div class=\"lightmap-title\ lightmap-title-div\" title=\"双击修改标题\">" +
        "<span class=\"title-span\" >" + data.Title + "</span>" +
        "<input class=\"\" type=\"text\" style=\"display: none;\"/>" +
      "</div>" +
      "<div class=\"lightmap-title-div img-checkbox\" style=\"display: none\">" +
        "<label style=\"width: 240px;\">" +
          "<input class=\"icheck\" type=\"checkbox\"/>" +
        "</label>"
      "</div>"
    "</div>"
    return str
  },
  version: function(data){
    var size = parseFloat(data.Size);
    if(size >= 1 * 1000 * 1000){
      size = (parseFloat(data.Size) / 1000 / 1000).toFixed(2) + 'm';
    }else if (size >= 1 * 1000) {
      size = (parseFloat(data.Size) / 1000 ).toFixed(2) + 'k';
    }else{
      size += 'b';
    }

    var date = new Date(data.UpdateAt);
    var time = Common.TimeFormatYMhms(date);
    var str =
    "<tr data-id=\""+ data.Id + "\" >" +
    "  <td>"+data.Number+"</td>" +
    "  <td>"+size+"</td>" +
    "  <td>"+data.Desction+"</td>" +
    "  <td>"+time+"</td>" +
    "  <td> <a class=\"btn btn-success\" href=\""+ data.Url +"\">下载</a></td>" +
    "</tr>"
    return str
  },
  version_ios: function(data){
    var date = new Date(data.UpdateAt);
    var time = Common.TimeFormatYMhms(date);
    var str =
    "<tr data-id=\""+ data.Id + "\" >" +
    "  <td>"+data.Number+"</td>" +
    "  <td>"+data.Desction+"</td>" +
    "  <td>"+time+"</td>" +
    "</tr>"
    return str
  }
}
