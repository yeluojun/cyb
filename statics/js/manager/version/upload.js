
$(function(){
  if(!document.getElementById('app-versions')){
    return
  }

  // 文件上传
  $('#version-put').on('click', function(){
    var fd = new FormData();
    var xhr = new XMLHttpRequest();
    var data_type = null;
    var desc = "";
    var version_number;
    var file;

    $('input[name="version_d_type"]').each(function(){
      if($(this).parent('[class*="iradio_square-blue"]').hasClass("checked")){
        data_type = $(this).val();
        return
      }

    });

    if(data_type != '0' && data_type != '1'){
      $('#data-type-tip').text('提示：请选择类型');
      return false
    }

    desc = $('#s-desc').val();
    version_number = $('#s-version').val().replace(/(^\s*)|(\s*$)/g, "");

    fd.append('desction', desc);
    fd.append('data_type', data_type);

    if(data_type == "1"){ // IOS
      if(version_number == ""){
        $('#version-tip').text('提示：版本号不能为空');
        return false
      }
      fd.append('version', version_number);
      $('#version-put').css('display', 'none');
      $('#version-put-wait').css('display', '');
      xhr.onreadystatechange = function(evt){
        if(xhr.readyState == 4){
          $('#version-put').css('display', '');
          $('#version-put-wait').css('display', 'none');
          if(xhr.status == 200) {
            var result = JSON.parse(xhr.responseText);
            Common.jlert('发布成功！');
            $('#upload-model').modal('hide');
            $('#tag-ios table tbody').prepend(Item_html.version_ios(result.Data))
            $('#show-ios').click();
          }else if (xhr.status == 403) {
            window.location = "/manager/login";
          }else{
            Common.jlert(xhr.responseText);
          }
        }
      }
    }else{ // Android

      file = document.getElementById("android-file").files[0];
      if (!file){
        $('#file-tip').text('提示：请选择文件');
        return false;
      }

      if (file.name.substring(file.name.lastIndexOf('.'),   file.name.length).toLowerCase() != '.apk'){
        $('#file-tip').text('提示：请选择文件apk文件');
        return false;
      };

      var timestamp = Date.parse(new Date());
      file.id = timestamp;
      file.rename = file.name;

      fd.append('android_file', file);
      fd.append('size', file.size);
      var background_ui = new Background_ui(file, xhr);
      background_ui.make_progress();
      background_ui.show_upload_div(true);
      var progress_td = background_ui.upload_div.find('#'+file.id).parent().parent();
      // 绑定取消爱事件
      background_ui.upload_div.on('click', '#'+background_ui.upload_cancle_a_id, function(){
        background_ui.xhr_abort(xhr, $(this).parent().parent());
      })

      xhr.upload.addEventListener("progress", uploadProgress, false);
      xhr.addEventListener("load", uploadComplete, false);
      xhr.addEventListener("error", uploadFailed, false);
      xhr.addEventListener("abort", uploadCanceled, false);
      xhr.addEventListener('readystatechange', readystatechange, false);
      background_ui.show_upload_model(false);

      // 上传完成
      function uploadComplete(evt){
      }

      // 上传失败
      function uploadFailed(evt){
        background_ui.html(progress_td, '<span class=\"text-danger\">上传失败：网络或服务器错误' + '</span>')
        background_ui.remove_cancle();
      }

      // 上传取消
      function uploadCanceled(evt){
        background_ui.html(progress_td, '<span class=\"text-warning\">上传已经取消' + '</span>')
      }

      // 上传进度条
      function uploadProgress(evt){
        background_ui.file.percent = Math.round(evt.loaded / evt.total * 100);
        background_ui.set_progress();
      }

      function readystatechange(evt){
        if (xhr.readyState == 4) {
          if (200 == xhr.status) {
            var result = JSON.parse(xhr.responseText);
            if (result.Code == 200){
              background_ui.html(progress_td, '<span class=\"text-success\">上传已经完成</span>')
              $('#tag-android table tbody').prepend(Item_html.version(result.Data));
              $('#show-android').click();
              setTimeout(function(){
              background_ui.upload_div.css('display', 'none');
                $("#s-upload-container").css('display', 'none');
              }, 2000);
            }
          }else if (403 == xhr.status) {
            window.location = "/manager/login";
          }else{
            background_ui.html(progress_td, '<span class=\"text-danger\">上传失败：'+ xhr.responseText + '</span>')
          }
          background_ui.remove_cancle();
        }
      }
    }
    xhr.open('POST', "/manager/versions", true);
    xhr.send(fd);

  })


})
