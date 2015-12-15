(function() {
  //bitvk script

  var downloadImage="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAB1SURBVHjaYvz//z9DQsPiegYGhgYG0kDDgobYRuYHDMrkaAYBhw0HLjEwkakZ7goWXDJA56Hwgd7Eqo6JgUIwDAxgwRdwuOSQA5SJmJDGp4aJkAJCckzEKiQ5HSBrwOcqFlL8i8sFFOUFJlCWJNMQcHYGCDAAaV4ovC+RCW8AAAAASUVORK5CYII=";

  document.addEventListener("vk_fileSizeAnsw", function(e) { setFileSizeAttr(e) }, false, true);

  vktools_start();

  function vktools_start() {
    vktools_monitor();
  }

  function vktools_monitor() {
    vktools_music();
    
    setTimeout(function() {
      if(vktools_monitor !== undefined) vktools_monitor()
    }, 500);
  }
  
  function setFileSizeAttr(e) {
    var size = parseInt(e.target.getAttribute("attr_value"));
    var id = parseInt(e.target.getAttribute("attr_name"));
    var obj = $("#download_btn"+id).parent().parent().parent();
    var size_mb = (size / 1048576.0).toFixed(1);
    var duration = $(obj).find(".duration").text();
    var parts = duration.split(':');
    var seconds = parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
    var bitrate = ((size * 8) / seconds / 1000).toFixed();
    var size_text = "Скачать " + size_mb + "МБ";
    $(obj).find('.bitvk_el').attr('onmouseover','Audio.rowActive(this, \''+size_text+'\');');
    $(obj).find(".duration").after('<div class="fl_r bitrate">' + bitrate + '</div>');
    $(obj).attr('size', size);
  }

  function vktools_music() {
    //music

    $('.audio').each(function(index) {
    
      if (($(this).find('.download_btn').attr('href')===undefined)&&($(this).find('input').attr('value')!==undefined)){
        var url = ($(this).find('input').attr('value')).toString().split ( ',' );
        var g_title = '';
        
        //find music title
        if ($(this).find('.title_wrap').text() != '') {
            g_title = $(this).find('.title_wrap').find('a:first').text()+' - '+$(this).find('.title_wrap').find('span[class!="match"]:first').text();
            $(this).find('.info').css('width',($(this).find('.info').width()-15)+'px');
        } else if($(this).find('.audio_title_wrap').text() != ''){
            g_title = $(this).find('.audio_title_wrap').find('a:first').text()+' - '+$(this).find('.audio_title_wrap').find('span[class!="match"]:first').text();
            $(this).find('.audio_title_wrap').css('width',($(this).find('.audio_title_wrap').width()-15)+'px');
        }

        var ins = $(this).find('.actions');
        $(ins).prepend(
          $("<div>", {
              class:   "audio_remove_wrap bitvk_el fl_r",
              onmouseover: "Audio.rowActive(this, 'Download');",
              onmouseout: "Audio.rowInactive(this);",
              onclick: "return cancelEvent(event);"
            })
        
        .prepend(
          $("<div>", {
            href:   url[0],
            class:   "download_btn",
            vk_title:  g_title,
            id:   "download_btn" + index,
            size:   0
          })
          .bind("click", function (o) {
            var element = document.createElement("vk_loadFileEvent");
            element.setAttribute("attribute_url",   $(this).attr("href"));
            element.setAttribute("attribute_title", $(this).attr("vk_title"));
            document.documentElement.appendChild(element);
            var evt = document.createEvent("Events");
            evt.initEvent("vk_loadFileEvent", true, false);
            if(!element.dispatchEvent(evt)) {
              return true;
            }
            return false;
          })
        ));

        if($('#download_btn'+index).parent().attr('class') == 'play_btn fl_l') {
          $('#download_btn'+index).css('margin', '9px 5px 0 26px');
          $(this).find('td:first').css('max-width','33px').css('min-width','33px');
        } else {
          $(this).find('.title_wrap').css('margin-right', '-15px');
          $(this).find('.info').removeAttr('style');
          $(this).find('td:first').css('max-width','50px').css('min-width','50px');
        }

        //load file size
        var element = document.createElement("vk_getFileSizeEvent");
        element.setAttribute("attribute_url", url[0]);
        element.setAttribute("attribute_id",  index);
        element.setAttribute("id",  "id"+index);
        document.documentElement.appendChild(element);
        var evt = document.createEvent("Events");
        evt.initEvent("vk_getFileSizeEvent", true, false);
        element.dispatchEvent(evt);
      }
    });//each
    
  } //vktools_music

})();