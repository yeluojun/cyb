
$(function(){
  var option = jupload_option;
  option.uptoken_url = "/api/v1/q_audio_t";
  option.filters.mime_types = [{ title : "Audio files", extensions : "mp3,wma,wav,aac,ogg,ape" }];
  var upload_func = jupload_func;

  upload_func.FileUploaded = function(up, file, info){
    var background_ui = new Background_ui(file, up);
    background_ui.remove_cancle();
    var td = background_ui.upload_div.find('#'+file.id).parent().parent();
    // var td = $("#audio-upload-container #" + file.id).parent().parent().parent();
    // 上传到自己的服务器
    var audio = {
      name: file.rename,
      size: file.size,
      url: up.getOption('domain') + "/" + (JSON.parse(info)).key
    }
    $.ajax({
      type: 'POST',
      url: '/manager/audios',
      data: audio,
      success: function(data){
        // Common.jlert('success');
        if (data.Code == 200){
          background_ui.html(td, '<span class=\"text-success\">上传已经完成</span>');
          background_ui.append($('#s-move'), 'pre', Item_html.audio(data.Data));
          // $('#s-move').prepend(item_html.audio(data.Data));
          $('#s-move').find('input[class="icheck"]').iCheck({
            checkboxClass: 'icheckbox_square-blue',
            radioClass: 'iradio_square-blue',
            increaseArea: '20%' // optional
          })
        }else if (data.Code == 403){
          window.location = "/manager/login";
        }else{
          background_ui.html(td,'<span class=\"text-danger\">上传失败：' + data.Msg + '</span>' );
        }
      },
      error: function(){
        background_ui.html('td', '<span class=\"text-danger\">上传失败：网络或服务器异常</span>');
      }
    })
  }

  option.init = upload_func;
  Qiniu.uploader(option);
})
