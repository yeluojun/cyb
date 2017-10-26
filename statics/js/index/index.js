$(function(){
  if (!document.getElementById("dg_index_main")){
    return
  }
  var cheight = document.documentElement.clientHeight;
  var cwidth = document.documentElement.clientWidth;
  var qr_hide = false;
  var background = "page1"
  var timer = 0;

  $('#index_banner').css("height", cheight/8 +'px');
  $('#index_content').css("height", 7*cheight/8 + "px");
  $('#index_content').css("padding-top", cheight/8 + "px");
  // $('.content_next')
  // $('#index_content img').css("height", 7*cheight/8 + "px");

  // $('.index_page').css("top", cheight/8 + "px");
  var change_page = function(){
    $('.slider_btn').each(function(){
      $(this).removeClass('slider_btn_active')
    })
    if(background == "page1"){
      background = "page2";
      $('#index_page_one').css('z-index', '0');
      $('#index_page_two').css('z-index', '3');
      $('#index_page_three').css('z-index', '0');
      $('.slider_btn:eq(1)').addClass('slider_btn_active');
    }else if (background == "page2") {
      background = "page3";
      $('#index_page_one').css('z-index', '0');
      $('#index_page_two').css('z-index', '0');
      $('#index_page_three').css('z-index', '3');
      $('.slider_btn:eq(2)').addClass('slider_btn_active');
    }else if (background == "page3") {
      background = "page1";
      $('#index_page_one').css('z-index', '3');
      $('#index_page_two').css('z-index', '0');
      $('#index_page_three').css('z-index', '0');
      $('.slider_btn:eq(0)').addClass('slider_btn_active');
    }
  }
  var auto_start = function(){
    if (timer == 0){
      timer = setInterval(function(){
        change_page();
      }, 3000);
    }else{
      clearInterval(timer);
      timer = 0;
    }
  }

  // auto_start();

  $('#index_buttom .slider_btn').on('mouseover', function(){
     auto_start();
     var t = $(this);
     var next_length = t.nextAll().length ;
     $('.slider_btn').each(function(){
       $(this).removeClass('slider_btn_active')
     })
     t.addClass('slider_btn_active');
     if(next_length == 2){
       background = "page1";
       $('#index_page_one').css('z-index', '3');
       $('#index_page_two').css('z-index', '0');
       $('#index_page_three').css('z-index', '0');
     }else if (next_length == 1 ){
        background = "page2";
       $('#index_page_one').css('z-index', '0');
       $('#index_page_two').css('z-index', '3');
       $('#index_page_three').css('z-index', '0');
     }else if (next_length == 0){
        background = "page3";
       $('#index_page_one').css('z-index', '0');
       $('#index_page_two').css('z-index', '0');
       $('#index_page_three').css('z-index', '3');
     }
  })

  $('#index_buttom .slider_btn').on('mouseout', function(){
    auto_start();
  })

  $(".index_page").on('click', function(){
    //  auto_start();
    change_page();
  })

  $('#img_download').on("mouseover", function(){
    qr_hide = false;
    $('#index_banner_qr').css('display', '');
  })

  $('#img_download').on("mouseout", function(){
    qr_hide = true;
    setTimeout(function(){
      if(qr_hide){
        $('#index_banner_qr').css('display', 'none')
      }
    }, 1000)
  })

  $('#index_banner_download img').on("mouseout", function(){
    qr_hide = true;
    setTimeout(function(){
      if(qr_hide){
        $('#index_banner_qr').css('display', 'none')
      }
    }, 1000)
  })

  $('#dg_index_main .index_banner_qr').on("mouseover", function(){
    qr_hide = false;
    $(this).css('display', '');
  })

  $('#index_banner_qr').on("mouseout", function(){
    qr_hide = true;
    setTimeout(function(){
      if(qr_hide){
        $('#index_banner_qr').css('display', 'none')
      }
    }, 1000)
  })
})
