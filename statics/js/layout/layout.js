$(function(){
  // 修改item高度
  var container_height = $("#dg-meun").outerHeight(true);
  $('#p-container').css("min-height", (container_height) + 'px');

  var setActive = function(arg_name){
    var menus = $("#dg-meun").find('.meun-item');
    menus.each(function(){
      if($(this).attr('id') == arg_name){
        $(this).addClass('meun-item-active');
      }else{
        $(this).removeClass('meun-item-active');
      }
    })
  }

  var set_class = function(){
    if(window.location.pathname == "/manager/audios"){
      setActive('audios');
    }else if(window.location.pathname == "/manager/users"){
      setActive('users');
    }else if(window.location.pathname == "/manager/lightmaps"){
      setActive('lightmaps');
    }else if(window.location.pathname == "/manager/pwd"){
      setActive('change-pwd');
    }else if(window.location.pathname == "/manager/versions"){
      setActive('versions');
    }
  }();

  $('#dg-meun .meun-item').click(function(){
    if($(this).attr('id') == 'change-pwd'){
      $('#change-pwd-model').modal('show');
      $('#change-pwd-tip').text('');
      var submit = $('#change-pwd-form')
      submit.find('input[name="old_pwd"]').val('');
      submit.find('input[name="new_pwd"]').val('');
      submit.find('input[name="sure_pwd"]').val('');
    }else{
      setActive($(this).attr('id'));
      if($(this).attr('id') == 'users'){
          window.location = "/manager/users";
      }else if ($(this).attr('id') == 'audios') {
        window.location = "/manager/audios";
      }else if ($(this).attr('id') == 'lightmaps') {
        window.location = "/manager/lightmaps";
      }else if($(this).attr('id') == 'versions'){
        window.location = "/manager/versions";
      }
    }
  })

  //修改密码
  $('#change-pwd-form').on('submit', function(e){
    e.preventDefault(); // 阻止事件冒泡
    var old_pwd = $(this).find('input[name="old_pwd"]').val();
    var new_pwd = $(this).find('input[name="new_pwd"]').val();
    var sure_pwd = $(this).find('input[name="sure_pwd"]').val();

    if(old_pwd.replace(/(^\s*)|(\s*$)/g, "") == '' || new_pwd.replace(/(^\s*)|(\s*$)/g, "") == "" || sure_pwd.replace(/(^\s*)|(\s*$)/g, "") == ""){
      $('#change-pwd-tip').text('提示：请补充完整所有信息');
      return;
    }
    if(new_pwd != sure_pwd){
      $('#change-pwd-tip').text('提示：前后密码不致，请更正');
      return;
    }

    // 发送修改密码的http请求
    $.ajax({
      type: 'PUT',
      url: '/manager/pwd',
      data:{
        new_pwd: new_pwd,
        old_pwd: old_pwd
      },
      success: function(data){
        if(data.Code == 200){
          Common.jlert('修改成功');
          $('#change-pwd-model').modal('hide');
        }else if(data.Code == 403){
          window.location = '/manager/login';
        }else{
          $('#change-pwd-tip').text('提示：' + data.Msg);
        }
      },
      error: function(){
        $('#change-pwd-tip').text('提示：修改失败，网络或服务器异常');
      }
    })
  })

  // 推出登陆
  $("#logout").click(function(){
    if(confirm('退出系统？')){
      $.ajax({
        url: "/manager/login",
        type: "DELETE",
        success: function(data){
          if(data.Code != 200){
            alert(data.Msg);
          }else{
            window.location = "/manager/login"
          }
        },
        error: function(err){
           alert("网络或服务器异常")
        }
      })
    }
  })
})
