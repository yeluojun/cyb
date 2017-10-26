
$(function(){
  var option = jupload_option;
  option.uptoken_url = "/api/v1/q_pic_t";
  var upload_func = jupload_func;

  upload_func.FileUploaded = function(up, file, info){
    var background_ui = new Background_ui(file, up);
    background_ui.remove_cancle();
    var td = background_ui.upload_div.find('#'+file.id).parent().parent();

    // var td = $("#audio-upload-container #" + file.id).parent().parent().parent();
    // 上传到自己的服务器
    var data = {
      name: file.rename,
      size: file.size,
      url: up.getOption('domain') + "/" + (JSON.parse(info)).key,
      data_type: file.data_type
    }

    $.ajax({
      type: 'POST',
      url: '/manager/backgrounds',
      data: data,
      success: function(data){
        // Common.jlert('success');
        if (data.Code == 200){
          background_ui.html(td, '<span class=\"text-success\">上传已经完成</span>');
          if(file.data_type == '0'){
            background_ui.append($('#s-move'), 'pre', Item_html.background(data.Data));
          }else {
            background_ui.append($('#s-move'), 'pre', Item_html.lightmap(data.Data));
          }
          $('#s-move').find('input[class="icheck"]').iCheck({
            checkboxClass: 'icheckbox_square-blue',
            radioClass: 'iradio_square-blue',
            increaseArea: '20%' // optional
          });
        }else if (data.Code == 403){
          window.location = "/manager/login";
        }else{
          background_ui.html(td,'<span class=\"text-danger\">上传失败：' + data.Msg + '</span>' );
        }
      },
      error: function(){
        background_ui.html(td, '<span class=\"text-danger\">上传失败：网络或服务器异常</span>');
      }
    })
  }
  option.init = upload_func;
  var uploader = Qiniu.uploader(option);
})
