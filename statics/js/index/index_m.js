$(function(){
// window.onload=function(){
  if(!document.getElementById('index-m-banner')){
    return
  }

  var cheight = document.documentElement.clientHeight;
  var cwidth = document.documentElement.clientWidth;

  var c_realw = cwidth;
  if(cwidth > 960){
    cwidth = 960;
  }

  var init = function(){

    // alert($('#index-m-banner').css('width'));
    b_width = parseFloat($('#index-m-banner').css('width'));
  // alert(b_width);
    $('#index-m-banner').css('height', cheight/8 +'px');
    // $('#index-m-banner').css('margin-left',(c_realw-b_width)/2 + 'px');
    $('#index-m-banner').css('line-height', cheight/8 +'px');
    // $('#share-buttom').css('height', cheight/10 +'px');
    $('#banner-left').css('width', cwidth/4 + 'px');
    $('#banner-left').css('line-height', cheight/8 +'px');
    $('#banner-right').css('width', cwidth/6 + 'px');
    $('#banner-right a').css('line-height', cheight/16 + 'px');
    $('#index-m-content').css('height', 7*cheight/8 +'px');
    $('#index-m-content img').css('margin-top', 0.7*cheight/16 +'px');
    // $('#index-m-content').css('padding-top', cheight/8 +'px');

    $('.index-m-content-next').css('height', 7*cheight/8 +'px');

    var kxm_margin_top = (7*cheight/8 -  0.9*cwidth * 619 / 749 ) / 2
    $('#index-kxm').css("margin-top", kxm_margin_top + 'px');


    var zy_margin_top = (7*cheight/8 -  0.7*cwidth * 465 / 533 ) / 2
    $('#index-zy').css("margin-top", zy_margin_top + 'px');
  }()

  var startX, startY, moveEndX, moveEndY
  var position = 0;

  $("#index-m-content-container").on("touchstart", function(e) {
    e.preventDefault();
    startX = e.originalEvent.changedTouches[0].pageX,
    startY = e.originalEvent.changedTouches[0].pageY;
  });

  $("#index-m-content-container").on("touchend", function(e) {
    e.preventDefault();
    moveEndX = e.originalEvent.changedTouches[0].pageX,
    moveEndY = e.originalEvent.changedTouches[0].pageY,
    X = moveEndX - startX,
    Y = moveEndY - startY;

    if ( Y > 0) {
      if(position == 2){
        position = 1;
        $('#index-m-content-3').fadeOut(500);
        $('#index-m-content-2').fadeIn(1300);
      }else if (position == 1) {
        position = 0;
        $('#index-m-content-2').fadeOut(500);
        $('#index-m-content').fadeIn(1300);
      }
    }else if ( Y < 0 ) {
      if(position == 0){
        position = 1;
        $('#index-m-content').fadeOut(500);
        $('#index-m-content-2').fadeIn(1300);

      }else if (position == 1) {
        position = 2;
        $('#index-m-content-2').fadeOut(500);
        $('#index-m-content-3').fadeIn(1300);
      }
    }
  });
// }
})
// window.onload=function(){
//   if(!document.getElementById('index-m-banner')){
//     return
//   }
//
//   var init = function(){
//     // var width = docEl.documentElement.getBoundingClientRect().width;
//     // document.getElementsByTagName("html")[0].style.fontSize =(window.screen.availWidth / 30 ) + 'px';
//     var cheight = document.documentElement.clientHeight;
//     var cwidth = document.documentElement.clientWidth;
//     var c_realw = cwidth;
//     if(cwidth > 960){
//       cwidth = 960;
//     }
//     // alert(c_realw);
//
//     // alert($('#index-m-banner').css('width'));
//     b_width = parseFloat($('#index-m-banner').css('width'));
//   // alert(b_width);
//     $('#index-m-banner').css('height', cheight/8 +'px');
//     $('#index-m-banner').css('margin-left',(c_realw-b_width)/2 + 'px');
//     $('#index-m-banner').css('line-height', cheight/8 +'px');
//     // $('#share-buttom').css('height', cheight/10 +'px');
//     $('#banner-left').css('width', cwidth/4 + 'px');
//     $('#banner-left').css('line-height', cheight/8 +'px');
//     $('#banner-right').css('width', cwidth/6 + 'px');
//     $('#banner-right a').css('line-height', cheight/16 + 'px');
//     $('#index-m-content').css('height', 7*cheight/8 +'px');
//     $('#index-m-content').css('padding-top', cheight/8 +'px');
//
//     $('.index-m-content-next').css('height', 7*cheight/8 +'px');
//     $('.index-m-content-next').css('padding-top', cheight/10 +'px');
//
//     // 获取 图片高度
//     kmx_height = $('#index-kxm').height();
//     $('#index-kxm').css("margin-top", (7*cheight/8 - kmx_height)/2);
//     // alert($('#index-kxm').height());
//
//     // $('.index-m-content-2-inline').css('height', 2*cheight/3 + 'px');
//   }()
// }
