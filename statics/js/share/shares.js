$(function(){
  if (!document.getElementById('share-content')){
    return
  }
  var init = function(){
    // var width = docEl.documentElement.getBoundingClientRect().width;
    // document.getElementsByTagName("html")[0].style.fontSize =(window.screen.availWidth / 30 ) + 'px';
    var cheight = document.documentElement.clientHeight;
    var cwidth = document.documentElement.clientWidth;

    if(cwidth > 960){
      cwidth = 960;
    }

    $('#share-banner').css('height', cheight/8 +'px');
    $('#share-banner').css('line-height', cheight/8 +'px');
    $('#share-video').css('height', 7*cheight/8 + 'px');
    // $('#share-buttom').css('height', cheight/10 +'px');
    $('#banner-left').css('width', cwidth/4 + 'px');
    $('#banner-left').css('line-height', cheight/8 +'px');
    $('#banner-right').css('width', cwidth/6 + 'px');
    $('#banner-right a').css('line-height', cheight/16 + 'px');
    // alert(window.screen.availWidth);
  }()
})
