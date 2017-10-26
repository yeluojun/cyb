var Juploader = function(arg_token_url, arg_filter, arg_init ){
  var uploader = Qiniu.uploader({
      runtimes: 'html5,flash,html4',      // 上传模式，依次退化
      browse_button: 'pickfiles',         // 上传选择的点选按钮，必需
      // 在初始化时，uptoken，uptoken_url，uptoken_func三个参数中必须有一个被设置
      // 切如果提供了多个，其优先级为uptoken > uptoken_url > uptoken_func
      // 其中uptoken是直接提供上传凭证，uptoken_url是提供了获取上传凭证的地址，如果需要定制获取uptoken的过程则可以设置uptoken_func
      // uptoken : '<Your upload token>', // uptoken是上传凭证，由其他程序生成
      uptoken_url: arg_token_url,         // Ajax请求uptoken的Url，强烈建议设置（服务端提供）
      // uptoken_func: function(file){    // 在需要获取uptoken时，该方法会被调用
      //    // do something
      //    return uptoken;
      // },
      get_new_uptoken: false,             // 设置上传文件的时候是否每次都重新获取新的uptoken
      // downtoken_url: '/downtoken',
      // Ajax请求downToken的Url，私有空间时使用，JS-SDK将向该地址POST文件的key和domain，服务端返回的JSON必须包含url字段，url值为该文件的下载地址
      // unique_names: true,              // 默认false，key为文件名。若开启该选项，JS-SDK会为每个文件自动生成key（文件名）
      // save_key: true,                  // 默认false。若在服务端生成uptoken的上传策略中指定了sava_key，则开启，SDK在前端将不对key进行任何处理
      domain: 'http://oqdy6yqkp.bkt.clouddn.com',     // bucket域名，下载资源时用到，必需
      container: 's-upload-container',             // 上传区域DOM ID，默认是browser_button的父元素
      max_file_size: '100mb',             // 最大文件体积限制
      flash_swf_url: '../statics/lib/plupload-2.3.1/js/Moxie.swf',  //引入flash，相对路径
      // max_retries: 0,                     // 上传失败最大重试次数
      dragdrop: false,                     // 开启可拖曳上传
      // drop_element: 'container',          // 拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
      chunk_size: '4mb',                  // 分块上传时，每块的体积
      auto_start: true,                   // 选择文件后自动上传，若关闭需要自己绑定事件触发上传
      filters : arg_filter,
      init: arg_init
  });
  return uploader;
}


// 上传的一些设置
var jupload_option = {
  runtimes: 'html5,flash,html4',      // 上传模式，依次退化
  browse_button: 'pickfiles',         // 上传选择的点选按钮，必需
  // 在初始化时，uptoken，uptoken_url，uptoken_func三个参数中必须有一个被设置
  // 切如果提供了多个，其优先级为uptoken > uptoken_url > uptoken_func
  // 其中uptoken是直接提供上传凭证，uptoken_url是提供了获取上传凭证的地址，如果需要定制获取uptoken的过程则可以设置uptoken_func
  // uptoken : '<Your upload token>', // uptoken是上传凭证，由其他程序生成
  uptoken_url: '',         // Ajax请求uptoken的Url，强烈建议设置（服务端提供）
  // uptoken_func: function(file){    // 在需要获取uptoken时，该方法会被调用
  //    // do something
  //    return uptoken;
  // },
  unique_names: true,
  save_key: true,
  get_new_uptoken: false,             // 设置上传文件的时候是否每次都重新获取新的uptoken
  // downtoken_url: '/downtoken',
  // Ajax请求downToken的Url，私有空间时使用，JS-SDK将向该地址POST文件的key和domain，服务端返回的JSON必须包含url字段，url值为该文件的下载地址
  // unique_names: true,              // 默认false，key为文件名。若开启该选项，JS-SDK会为每个文件自动生成key（文件名）
  // save_key: true,                  // 默认false。若在服务端生成uptoken的上传策略中指定了sava_key，则开启，SDK在前端将不对key进行任何处理
  domain: 'http://oqdy6yqkp.bkt.clouddn.com',     // bucket域名，下载资源时用到，必需
  // container: 's-upload-container',             // 上传区域DOM ID，默认是browser_button的父元素
  max_file_size: '50mb',             // 最大文件体积限制
  flash_swf_url: '../statics/lib/plupload-2.3.1/js/Moxie.swf',  //引入flash，相对路径
  // max_retries: 0,                     // 上传失败最大重试次数
  dragdrop: false,                     // 开启可拖曳上传
  // drop_element: 'container',          // 拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
  chunk_size: '4mb',                  // 分块上传时，每块的体积
  auto_start: true,                   // 选择文件后自动上传，若关闭需要自己绑定事件触发上传
  filters: {
    // max_file_size : '50mb',
    prevent_duplicates: false,
    max_retries: 0,
  //Specify what files to browse for
    mime_types: [
      { title : "background files", extensions : "bmp,jpg,png,gif" }, //限定flv,mpg,mpeg,avi,wmv,mov,asf,rm,rmvb,mkv,m4v,mp4后缀格式上传
     ]
  }
}

// var g_file;
var jupload_func = {

  // var background_ui;
  'FilesAdded': function(up, files) {
    var background_ui = new Background_ui('', up);
    plupload.each(files, function(file) {
      var background_ui = new Background_ui(file, up);
      name =  $("#s-name").val().replace(/(^\s*)|(\s*$)/g, "");
      if (name == null || name == "") {
        file.rename =  file.name.replace(/(^\s*)|(\s*$)/g, "");
        if(file.rename == ""){
           file.rename = "未命名";
        }
      }else{
        file.rename = name;
      }
      file.data_type = $("#s-name").attr('data-type');
      // 进度条初始化
      background_ui.file = file;
      background_ui.make_progress();
      // console.log(file.id);

      // 绑定取消上传的事件
      background_ui.upload_div.on('click', '#'+background_ui.upload_cancle_a_id, function(){
        background_ui.remove_file($(this).parents('td'));
      })
    })
    background_ui.show_upload_div(true);
    background_ui.show_upload_model(false);
  },
  'BeforeUpload': function(up, file) {
    // console.log("before");
    // g_file = file;
         // 每个文件上传前，处理相关的事情
  },
  'UploadProgress': function(up, file) {
    var background_ui = new Background_ui(file, up);
    background_ui.set_progress();
  },
  'FileUploaded': function(up, file, info) {
    var background_ui = new Background_ui(file, up);
    background_ui.remove_cancle();
  },
  'Failed': function(){

  },
  'Error': function(up, err, errTip) {
      var background_ui = new Background_ui(err.file, up);
      var td = background_ui.upload_div.find('#'+err.file.id).parent().parent();
      background_ui.html(td,'<span class=\"text-danger\">上传失败：' + errTip + '</span>' );

      // up.removeFile(err.file);
      background_ui.remove_cancle();
      console.log("66666");
      console.log(err);
      console.log(errTip);
      if (err.code == -600) {
        Common.jlert("素材大小超过限制。");
      }else if (err.code == -601) {
        Common.jlert("素材格式错误，请检查文件名后缀");
      }else{
        if (err.status == 403){
          Common.jlert("素材实际格式不匹配");
        }
        if (err.status == 400){
          Common.jlert("未知参数错误");
        }
      }
      return false;
  },
  'UploadComplete': function() {
    var background_ui = new Background_ui("","");
    background_ui.remove_cancle();
    // setTimeout(function(){
    //   background_ui.upload_div.css('display', 'none');
    //   $("#s-upload-container").css('display', 'none');
    // }, 2000);
         //队列文件处理完毕后，处理相关的事情
  }
}
