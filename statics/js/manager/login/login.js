// TODO
// $(function(){})表示等dom元素完成后执行,是$(document).ready() 的简写
$(function(){
  // 登陆
  // $("#login-submit").click(function(){
  //   alert('fuck your sister');
  // // })
  $("#login").submit(function(e){
    e.preventDefault(); // 阻止提交按钮默认的action
    // alert('fuck your sister');
    var username = $("#username").val();
    var password = $("#password").val();

    if(username == "" || username == null){
      $("#login-tip").text("用户名不能为空");
      return
    }

    if(password == "" || password == null){
      $("#login-tip").text("密码不能为空");
      return
    }

    $.ajax({
        type: "POST",
        url: "/manager/login",
        data:{ username: username, password: password },
        success: function(data){
          // alert(data.Code);
          if (data.Code != 200){
              $("#login-tip").text(data.Msg);
          }else{
            window.location = "/manager/users";
          }
        },
        error: function(err){
          $("#login-tip").text("网络或服务器异常，请稍后重试");
        }
      }
    )
  })
})
