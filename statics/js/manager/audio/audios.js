// TODO 移动触发方法
// TODO 音频标题只显示15个字符，其他的用... 表示
//
var as;

// 初始化音乐插件
audiojs.events.ready(function() {
  as = audiojs.createAll();
});

$(function() {
  var audio_size = function(){
    $('#audio-content table tr').each(function(){
      var td = $(this).find('td:eq(3)');
      var old_text = td.text();
      var size = parseFloat(old_text);
      if(size >= 1 * 1000 * 1000){
        size = (parseFloat(old_text) / 1000 / 1000).toFixed(2) + 'm';
      }else if (size >= 1 * 1000) {
        size = (parseFloat(old_text) / 1000 ).toFixed(2) + 'k';
      }else{
        size += 'b';
      }
      td.text(size);
    })
  }()

  // 元素移动
  var el = document.getElementById('s-move');
  var sortable = Sortable.create(el,{
    animation: 180,
    group: 'photo',
    handle: '.td-move',
    scrollSensitivity: 30,
    scrollSpeed: 30,

    onEnd: function (el/**Event*/){
      var sel = $(el.item);
      var prev = sel.prev();
      var next = sel.next();
      var prevAll = sel.prevAll();
      var nextAll = sel.nextAll();

      if (nextAll.length == 0) {
      // 去到最後面了
        sel.attr('data-sort', prev.attr('data-sort'));
          prevAll.each(function() {
            $(this).attr('data-sort', parseInt($(this).next().attr('data-sort')) + 1);
        })
      } else if (prevAll.length == 0) { // 去到最前
        sel.attr('data-sort', next.attr('data-sort'));
          nextAll.each(function() {
            $(this).attr('data-sort', parseInt($(this).prev().attr('data-sort')) - 1);
        })
      } else if (parseInt(sel.attr('data-sort')) > parseInt(next.attr('data-sort'))) {
        from_sort_by = parseInt(sel.attr('data-sort'));
        sel.attr('data-sort', parseInt(next.attr('data-sort')) + 1);
        prevAll.each(function() {
          var sortBy = parseInt($(this).attr('data-sort'));
          if (sortBy < from_sort_by) {
            $(this).attr('data-sort', parseInt($(this).next().attr('data-sort')) + 1)
          }
        })
      } else if (parseInt(sel.attr('data-sort')) < parseInt(next.attr('data-sort'))) {
        from_sort_by = parseInt(sel.attr('data-sort'));
        sel.attr('data-sort', parseInt(prev.attr('data-sort')) - 1);
        nextAll.each(function() {
          var sortBy = parseInt($(this).attr('data-sort'));
          if (sortBy > from_sort_by) {
            $(this).attr('data-sort', parseInt($(this).prev().attr('data-sort')) - 1)
          }
        })
      }
    }
  })

  // 点击"上传素材"
  $("#upload-model-show").on('click', function(){
    $('#s-name').val("");
  })

  // 删除
  $('#del-sure').on('click',
  function() {
    console.log('come on baby');
    var ids = [];
    var doms = [];
    var all_input = $('#s-move').find('.icheck');
    all_input.each(function(){
      var checked = $(this).parent('[class*="icheckbox"]').hasClass("checked");
      if(checked){
        console.log('checked');
        var parentDiv = $(this).parents('tr');
        ids.push(parentDiv.attr('data-id'));
        doms.push(parentDiv);
      }
    })

    if (ids.length <= 0) {
      Common.jlert('请选择要删除的素材');
      return
    }

    if (confirm('操作不可逆，继续吗？')) {
      $.ajax({
        type: 'POST',
        url: '/manager/audios/d',
        data: {
          ids: ids
        },
        success: function(data) {
          if (data.Code == 200) {
            Common.jlert('删除素材成功');
            for (i = 0; i < doms.length; i++) {
              doms[i].remove();
              $('#audio-content table thead tr[class=tr-with-del]').css('display', 'none');
              $('#audio-content table thead tr[class=tr-no-del]').css('display', '');
            }
          } else if (data.Code == 403) {
            window.location = "/manager/login";
          } else {
            Common.jlert(data.Msg);
          }
        },
        error: function() {
          Common.jlert('网络或服务器异常，请稍后重试');
        }
      })
    }
  })

  // 保存排序
  $('#sort-buttton').on('click',
  function() {
    var sorts = [];
    $('#s-move').children('tr').each(function() {
      sorts.push($(this).attr('data-id') + "," + $(this).attr('data-sort'));
      // data.push({ id: $(this).attr('data-id'), sort_by: $(this).attr('data-sort')})
    })
    // console.log(data);
    $.ajax({
      url: "/manager/audios/s",
      type: 'PUT',
      data: {
        sorts: sorts
      },
      success: function(data) {
        if (data.Code == 200) {
          Common.jlert('排序成功');
        } else if (data.Code == 403) {
          window.location = "/manager/login";
        } else {
          Common.jlert(data.Msg);
        }
      },
      error: function(e) {
        Common.jlert("排序失败：网络或服务器异常");
      }
    })
  })

  // 双击修改名称
  $("#s-move").on('dblclick', '.audio-title',
  function() {
    var d = $(this);
    var n = d.next();
    d.css('display', 'none');
    n.css('display', '');
    n.children('input').val(d.text());
    n.children('input').focus();
  })

  // 点击完成
  $('#audio-content').on('click', 'a[class="finish"]', function(){
    var a = $(this);
    var ipt = a.parent().prev();
    var input_group = a.parents('.input-group');
    input_group.css('display', 'none');
    input_group.prev().css('display', '');
    var new_title = ipt.val().replace(/(^\s*)|(\s*$)/g, "");
    if(new_title == ""){
      return;
    }

    $.ajax({
      url: "/manager/audios/title",
      type: 'PUT',
      data: {
        title: new_title,
        id: a.parents('tr').attr('data-id')
      },
      success: function(data) {
        if (data.Code == 200) {
          input_group.prev().text(ipt.val());
        } else if (data.Code == 403) {
          Common.jlert("权限不足");
          window.location = "/manager/login";
        } else {
          Common.jlert(data.Msg);
        }
      },
      error: function(err) {
        Common.jlert('修改失败：网络或服务器异常');
      }
    })
  })

  // 点击播放事件
  $('#s-move').on('click', 'a[class="audio-play"]',
  function() {
    console.log(audiojs.instances);
    $('#s-move').find('a[class="audio-play"]').each(function() {
      if ($(this).next()) {
        $(this).next().remove();
        $(this).css('display', '');
      }
    })

    for (var prop in audiojs.instances) {
      audiojs.instances[prop].pause();
    }

    audiojs.instances = {};

    var td = $(this).parent();
    var tr = td.parent();
    $(this).css('display', 'none');
    var audio = $('<audio/>', {
      id: 'test'
    }).appendTo(td).attr('src', tr.attr('data-url'))[0];
    var as_one = audiojs.create(audio); // initialise new audio.js player
    // as_one.settings.autoplay = true;
    console.log(as_one);
    return true;
  })

  // 全选反选
  $("#audio-content").on('click', '.choose-all', function(){
    var no_checked = false;
    var all_input = $('#s-move').find('.icheck');
    // var checkboxes = $(checkAll, 'input.check');
    all_input.each(function(){
      console.log($(this));
      var checked = $(this).parent('[class*="icheckbox"]').hasClass("checked");
      if(!checked){
         no_checked = true;
         return;
      }
    })
    if(!no_checked){
       all_input.iCheck('uncheck');
       $('#audio-content table thead tr[class=tr-with-del]').css('display', 'none')
       $('#audio-content table thead tr[class=tr-no-del]').css('display', '')
    }else{
       all_input.iCheck('check');
       $('#audio-content table thead tr[class=tr-with-del]').css('display', '')
       $('#audio-content table thead tr[class=tr-no-del]').css('display', 'none')

    }
  })

  // 检测复选框改变
  $('#s-move').on('ifChecked','input', function(event){
    $('#audio-content table thead tr[class=tr-with-del]').css('display', '')
    $('#audio-content table thead tr[class=tr-no-del]').css('display', 'none')
  });

 $('#s-move').on('ifUnchecked', 'input', function(){
   var input_this = $(this);
   no_checked = true;
   var all_input = $('#s-move').find('.icheck');
   all_input.each(function(){
     if( $(this).parents('tr').attr('data-id') != input_this.parents('tr').attr('data-id')){
       var checked = $(this).parent('[class*="icheckbox"]').hasClass("checked");
       console.log(checked);
       if(checked){
          no_checked = false;
          return;
       }
     }
   })
   if(no_checked){
      $('#audio-content table thead tr[class=tr-with-del]').css('display', 'none')
      $('#audio-content table thead tr[class=tr-no-del]').css('display', '')
   }
 })
})
