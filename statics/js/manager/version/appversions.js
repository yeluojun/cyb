$(function(){
  if(!document.getElementById('app-versions')){
    return
  }

  // ios/android choose
  $('input[name="version_d_type"]').on('ifChecked',function(){
    $('input[name="version_d_type"]').parents('.form-group').nextAll().css('display', '');
    var t = $(this);
    if(t.val() == '0'){
      $('#s-version').parent().css('display', 'none');
      $('#android-file').parent().css('display', '');
    }else{
      $('#s-version').parent().css('display', '');
      $('#android-file').parent().css('display', 'none');
    }

  })

  // 点击发布新版本
  $('#upload-model-show').on('click', function(){
    var has_choose = false;
    $('input[name="version_d_type"]').each(function(){
      var t = $(this);
      if($(this).parent('[class*="iradio_square-blue"]').hasClass("checked")){
        has_choose = true;
        if(t.val() == '0'){
          $('#s-version').parent().css('display', 'none');
          $('#android-file').parent().css('display', '');
        }else{
          $('#s-version').parent().css('display', '');
          $('#android-file').parent().css('display', 'none');
        }
        return
      }
    })

    if (!has_choose){
      $('input[name="version_d_type"]').parents('.form-group').nextAll().css('display', 'none');
    }
  })

  $('#s-version').bind('input propertychange', function(event){
    if($(this).val().replace(/(^\s*)|(\s*$)/g, "") == ""){
      $('#pickfiles').attr('disabled',"true");
    }else{
      $('#pickfiles').removeAttr('disabled');
    }
  })

 $('#pickfiles').on("click",function(){
   $(this).attr('disabled', 'true');
 })

})
