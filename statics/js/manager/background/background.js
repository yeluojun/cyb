$(function(){
  if (!document.getElementById('background-top')){
    return;
  }

  // 初始化一些东西
  var init = function(){
    $('#s-move').find('span[class="img-size"]').each(function(){
      var f =  $(this).text().match(/\d/g).join("");
      var text = ((parseFloat(f)) / 1000 / 1000).toFixed(2);
      $(this).text('(' + text + 'm)');
    })
    if(window.location.pathname == "/manager/backgrounds"){
      $("#s-name").attr("data-type", '0');
    }else if(window.location.pathname == "/manager/lightmaps"){
      $("#s-name").attr("data-type", '1');
      $('#background-top .title-name').text('贴图素材管理');
    }
  }()

  var el = document.getElementById('s-move');

  var sortable = Sortable.create(el,{
    animation: 180,
    group: 'photo',
    handle: '.img-div',
    scrollSensitivity: 30,
    scrollSpeed: 30,

    onEnd: function (evt/**Event*/){
      //  TODO 移动后会触发的方法
      //  前端排序与后端排序
      sel  = $(evt.item);
      prev = sel.prev();
      next = sel.next();

      prevAll = sel.prevAll();
      nextAll = sel.nextAll();

      if(nextAll.length == 0){
        // 去到最後面了
        sel.attr('data-sort', prev.attr('data-sort'));
        prevAll.each(function(){
          $(this).attr('data-sort', parseInt($(this).next().attr('data-sort'))+1);
        })

      } else if(prevAll.length == 0){// 去到最前
        sel.attr('data-sort', next.attr('data-sort'));
        nextAll.each(function(){
          $(this).attr('data-sort', parseInt($(this).prev().attr('data-sort'))-1);
        })

      } else if (parseInt(sel.attr('data-sort')) > parseInt(next.attr('data-sort'))){
        from_sort_by = parseInt(sel.attr('data-sort'));
        sel.attr('data-sort', parseInt(next.attr('data-sort'))+1);
        prevAll.each(function(){
          var sortBy = parseInt($(this).attr('data-sort')) ;
          if(sortBy < from_sort_by){
            $(this).attr('data-sort', parseInt($(this).next().attr('data-sort'))+1)
          }
        })
      } else if (parseInt(sel.attr('data-sort')) < parseInt(next.attr('data-sort'))){
        from_sort_by = parseInt(sel.attr('data-sort'));
        sel.attr('data-sort', parseInt(prev.attr('data-sort'))-1);
        nextAll.each(function(){
          var sortBy = parseInt($(this).attr('data-sort')) ;
          if(sortBy > from_sort_by){
            $(this).attr('data-sort', parseInt($(this).prev().attr('data-sort'))-1)
          }
        })
      }
    }
  })

  // 点击删除按钮
  $('#del-button').on('click',function(){
    $('#del-div').css('display', '');
    if(window.location.pathname == "/manager/backgrounds"){
      $('.img-info-div-row').css('display','none');
      $('.img-checkbox').css('display', '');
    }
    if(window.location.pathname == "/manager/lightmaps"){
      $('.lightmap-title').css('display', 'none');
      $('.img-checkbox').css('display', '');
      $('.img-checkbox').addClass('lightmap-title-active-2')
    }
  })

  // 全选反选按钮事件绑定
  $('#checked-all').on('click', function(){
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
    }else{
       all_input.iCheck('check');
    }
  })

  // 取消删除的按键
  $('#del-div-down').on('click', function(){
    $('#s-move').find('.icheck').iCheck('uncheck');
    $('#del-div').css('display', 'none');
    $('.img-checkbox').css('display', 'none');

    if(window.location.pathname == "/manager/backgrounds"){
      $('.img-info-div-row').css('display','');
    }
    if(window.location.pathname == "/manager/lightmaps"){
      $('.lightmap-title').css('display', '');
    }
  })

  // 确认删除
  $('#del-sure').on('click', function(){
    var ids = [];
    var doms = [];
    var all_input = $('#s-move').find('.icheck');
    // console.log(all_input);
    all_input.each(function(){
      var checked = $(this).parent('[class*="icheckbox"]').hasClass("checked");
      if(checked){
        console.log('checked');
        var parentDiv = $(this).parents('.content-item');
        ids.push(parentDiv.attr('data-id'));
        doms.push(parentDiv);
      }
    })

    if(ids.length <= 0){
      Common.jlert('请选择要删除的素材');
      return
    }

    if(confirm('操作不可逆，继续吗？')){
      $.ajax({
        type: 'POST',
        url: '/manager/backgrounds/d',
        data: { ids: ids },
        success: function(data){
          if(data.Code == 200){
            Common.jlert('删除素材成功');
            for (i = 0; i < doms.length; i++){
              doms[i].remove();
            }
          }else if (data.Code == 403) {
            window.location = "/manager/login";
          }else{
            Common.jlert(data.Msg);
          }
        },
        error: function(){
          Common.jlert('网络或服务器异常，请稍后重试');
        }
      })
    }
  })

  // 保存排序
  $('#sort-buttton').on('click',function(){
    var sorts = []
    $('#s-move').children('div').each(function(){
      sorts.push( $(this).attr('data-id')  + "," + $(this).attr('data-sort') );
    })
    // console.log(data);
    $.ajax({
      url: "/manager/backgrounds/s",
      type: 'PUT',
      data: { sorts: sorts },
      success: function(data){
        if(data.Code == 200){
          Common.jlert('排序成功');
        }else if(data.Code == 403){
          window.location = "/manager/login";
        }else{
          Common.jlert(data.Msg);
        }
      },
      error: function(e){
        Common.jlert("排序失败：网络或服务器异常");
      }
    })
  })

  // 双击修改名称
  $('#s-move').on('dblclick', '.img-name', function(){
    $(this).children('span').css('display', 'none');
    $(this).children('input').css('display', '');
    $(this).children('input').val($(this).children('span[class="img-title"]').text());
    $(this).children('input').focus();
  })

  // 失去焦点时触发事件
  $('#s-move').on('blur', '.img-name input', function(){
    ts = $(this);
    ts.css('display', 'none');
    ts.prevAll().css('display', '')
    var new_title = ts.val().replace(/(^\s*)|(\s*$)/g, "");
    set_title(ts.val(), ts.parent().parent().parent().parent().parent().attr('data-id'), ts.prev() )
  })

  //========================================= lightmap 的一些方法 ====================================================
  $('#s-move').on("mouseenter", '.lightmap-item', function(){
    $(this).children('.lightmap-title').addClass('lightmap-title-active');
  })
  $('#s-move').on("mouseleave", '.lightmap-item', function(){
    $(this).children('.lightmap-title').removeClass('lightmap-title-active');
  })
  //
  // 双击修改名称
  $('#s-move').on('dblclick', '.lightmap-title', function(){
    $(this).addClass('lightmap-title-active-2');
    var sp = $(this).children('span');
    var ip = $(this).children('input');
    sp.css('display', 'none');
    ip.css('display', '');
    ip.val(sp.text());
    ip.focus();
  })

  // 失去焦点
  $('#s-move').on("blur", '.title-input', function(){
    hide_input_show_span($(this));
  })

  // 检测 enter
  $("#s-move").on("keyup", ".title-input",function(event){
    // console.log(event.target);
    // console.log($(this));
    if(event.keyCode == 13){
      hide_input_show_span($(event.target));
      set_title($(this).val(), $(this).parents('.lightmap-item').attr('data-id'), $(this).prev());
    }
  })

  var hide_input_show_span = function(arg_this){
    arg_this.css('display', 'none');
    arg_this.prev().css('display', '');
    arg_this.parents('.lightmap-title').removeClass('lightmap-title-active-2');
    set_title(arg_this.val(),arg_this.parents('.lightmap-item').attr('data-id'), arg_this.prev() )
  }

// 设置新的标题
  var set_title = function(arg_title, arg_id, arg_span_node){
    var new_title = arg_title.replace(/(^\s*)|(\s*$)/g, "");
    if (new_title == ""){
      return
    }
    $.ajax({
      url: "/manager/backgrounds/title",
      type: 'PUT',
      data: { title: new_title, id: arg_id },
      success: function(data){
        if(data.Code == 200){
          arg_span_node.text(new_title);
        }else if (data.Code == 403) {
          ts.val(ts.prev().text());
          Common.jlert("权限不足");
          window.location = "/manager/login";
        }else{
          Common.jlert(data.Msg);
        }
      },
      error: function(err){
        Common.jlert('修改失败：网络或服务器异常');
        }
    })
  }
})
