//bitvk loader
//original script by pihel
//forked and modified by j2only
//published under Mozilla Public License Version 1.1
(function() {
  var VK_global_doc = undefined;

  // loadFile
  var VK_loadFile = function (aURL, aDefaultFileName)
  {
    //https://developer.mozilla.org/en-US/docs/Mozilla/JavaScript_code_modules/Downloads.jsm
    Components.utils.import("resource://gre/modules/Downloads.jsm");
    Components.utils.import("resource://gre/modules/osfile.jsm")
    Components.utils.import("resource://gre/modules/Task.jsm");

    //choose save folder and file name
    var nsIFilePicker = Components.interfaces.nsIFilePicker;
    var fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);
    var ext = ".mp3";
    var filen = aDefaultFileName.substr(0, aDefaultFileName.length - 1)+ext;
    fp.appendFilter("Audio Files (*.mp3)","*.mp3");
    fp.defaultString = filen;
    fp.init(window, null, nsIFilePicker.modeSave);
    var res = fp.show();
    if (res != nsIFilePicker.returnCancel){
      var thefile = fp.file;

      //actually saving a file
      Task.spawn(function () {
        let list = yield Downloads.getList(Downloads.ALL);
        try {
          let download = yield Downloads.createDownload({
            source: aURL,
            target: thefile,
          });
          list.add(download);
          try {
            download.start();
          } finally {}
        } finally {}
      }).then(null, Components.utils.reportError);
      //saving a file
      }
    return true;
   }//VK_loadFile

  function VK_sendDataToWindow(eventName, attrName, attrValue) {
    var element = VK_global_doc.createElement(eventName);
    element.setAttribute("attr_name", attrName);
    element.setAttribute("attr_value", attrValue);
    VK_global_doc.documentElement.appendChild(element);

    var evt = VK_global_doc.createEvent("Events");
    evt.initEvent(eventName, true, false);
    element.dispatchEvent(evt);
  } //VK_sendDataToWindow

  function VK_getFileSize(name, id) {
    var req = new XMLHttpRequest();
    req.open('HEAD', name, true);
    req.onreadystatechange = function() {
      if (req.readyState == 4 && req.status == 200) {
        var length = null;
        length = parseFloat(req.getResponseHeader('Content-Length'));
        VK_sendDataToWindow("vk_fileSizeAnsw", id, length)
      }
    };
    req.send(null);
  } //VK_getFileSize

  function VK_getFileInfo() {
      var request = new XMLHttpRequest();
      request.open('GET', '', true);
      request.send();
      //request.onreadystatechange = function() {
      if (request.status === 200) {
        VK_sendDataToWindow("vk_fileInfoAnsw", "data", request.responseText)
      }
      //}
  }

  function load_css(doc)
  { 
      var style = doc.createElement('link');
      style.setAttribute('rel', 'stylesheet');
      style.setAttribute('type', 'text/css');
      style.setAttribute('href', ' chrome://bitvk/content/bitvk.css');
      doc.getElementsByTagName('head')[0].appendChild(style);
  }

  var VK_secureEvent = {
    saveFile: function(evt) {
      VK_loadFile(evt.target.getAttribute("attribute_url"), evt.target.getAttribute("attribute_title"));
    },
    getFileSize: function(evt) {
      VK_getFileSize(evt.target.getAttribute("attribute_url"), evt.target.getAttribute("attribute_id"));
    },
    getFileInfo: function(evt) {
      VK_getFileInfo();
    }
  }
  document.addEventListener("vk_loadFileEvent", function(e) { VK_secureEvent.saveFile(e); }, false, true);
  document.addEventListener("vk_getFileSizeEvent", function(e) { VK_secureEvent.getFileSize(e); }, false, true);
  //document.addEventListener("getFileInfoEvent", function(e) {  VK_secureEvent.getFileInfo(e); }, false, true); //TODO

  var VK_loader = new function(){};
  VK_loader.run = function(e) {
    var unsafeWin=e.target.defaultView;
    if (unsafeWin.wrappedJSObject) {
      unsafeWin=unsafeWin.wrappedJSObject;
    }
    var unsafeLoc=new XPCNativeWrapper(unsafeWin, 'location').location;
    var href=new XPCNativeWrapper(unsafeLoc, 'href').href;
    if (!href.match(/^http:\/\/vk\.com(.*)?$/i) &&
        !href.match(/^https:\/\/vk\.com(.*)?$/i) )
          return;


    //if(VK_global_doc == undefined) {
      VK_global_doc = e.target.defaultView.document;
    //}

    if(VK_global_doc) {
      load_css(VK_global_doc);

      var script = VK_global_doc.createElement( 'script' );
      script.type = 'text/javascript';
      script.src = 'chrome://bitvk/content/jquery-1.7.2.min.js';
      VK_global_doc.body.appendChild(script);

      script.onload = function(){
        var script_tool = VK_global_doc.createElement( 'script' );
        script_tool.type = 'text/javascript';
        script_tool.src = 'chrome://bitvk/content/vk_script.js';
        VK_global_doc.body.appendChild(script_tool);
      };
    }
  }; //VK_loader.run

  var vk_load = function() {
      window.document.addEventListener("DOMContentLoaded", VK_loader.run, true);
  };
  window.addEventListener("load", vk_load, false);

})();