function Background_ui(arg_file, arg_file_up){
  this.file = arg_file;
  this.up = arg_file_up;
  this.upload_div = $('#s-upload-container');
  this.upload_div_s = 's-upload-container';

  this.upload_cancle_span = $("<span class=\"text-warning\"><strong>上传已经取消</strong></span>");
  this.upload_model = $("#upload-model");
  this.uplaod_model_s = 'upload-model';
  this.upload_cancle_a_id = '-upload-cancle';
  if (this.file.id){
    this.upload_cancle_a_id = this.file.id + '-upload-cancle';
  }
}

// 显示隐藏上传进度条的div
Background_ui.prototype.show_upload_div = function(arg_tf){
  if(arg_tf){
    this.upload_div.css('display', '');
  }else{
    this.upload_div.css('display', 'none');
  }
}

// 显示隐藏上传弹窗
Background_ui.prototype.show_upload_model = function(arg_tf){
  if(arg_tf){
    this.upload_model.modal('show');
  }else{
    this.upload_model.modal('hide');
  }
}

// 初始化上传进度条
Background_ui.prototype.make_progress = function(){
  this.upload_cancle_a_id = this.file.id + '-upload-cancle';
  tmpl =
   "<tr>" +
    "<td style=\"width:33%\">"+ this.file.rename+"</td>" +
    "<td>"+(this.file.size / 1000 / 1000).toFixed(2)+"mb</td>" +
    "<td>" +
      "<div class=\"audio-add-process-div\">" +
        "<div class=\"progress\">" +
          "<div class=\"progress-bar\" role=\"progressbar\" id=\""+ this.file.id + "\" aria-valuemin=\"0\" aria-valuemax=\"100\" style=\"" + "min-width: 2em;\">" +
             "0%" +
          "</div>" +
        "</div>" +
      "</div>" +
      "<div style=\"float: right\">" +
        "<a id= \"" + this.file.id + "-upload-cancle\" class=\"upload-cancle\" href=\"#\">取消</a>" +
      "</div>" +
     "</td>" +
  "</tr>"
  $('#'+ this.upload_div_s + ' table tbody').append(tmpl)
  // this.upload_div.children('tbody')[0].append(tmpl);
}

Background_ui.prototype.remove_cancle = function(){
  console.log(this.upload_cancle_a_id);
  $('#'+this.upload_cancle_a_id).parent().remove();
}
// 设置进度条
Background_ui.prototype.set_progress = function(){
  // console.log(this.upload_div.find("#"+this.file.id)[);
  this.upload_div.find("#"+this.file.id).css('width', this.file.percent + '%')
  this.upload_div.find("#"+this.file.id).html(this.file.percent + '%')
}

Background_ui.prototype.remove_file = function(evt, html){
  if(this.up){
    this.up.removeFile(this.file);
  }
  this.html(evt, this.upload_cancle_span);
}

Background_ui.prototype.xhr_abort = function(xhr, evt){
  xhr.abort();
  this.html(evt, this.upload_cancle_span);
}

Background_ui.prototype.html = function(evt, html){
  evt.html(html);
}

Background_ui.prototype.append = function(evt, p, html){
  if(p == 'pre'){
    evt.prepend(html);
  }else{
    evt.append(html);
  }
}
