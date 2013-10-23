// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file. 

// ----------------
// Version: 1.0   
// Last Up Date: 2013/10/22   
// Author: device302@gmail.com

// ##usage
// ###require
// * zepto.js ( http://zeptojs.com )
// * backgound.js

// variable declaration
// ---------------------------------------------------
// localStrage
var lc = localStorage
// bg
  , bg = chrome.extension.getBackgroundPage()
// display area
  , _loading = '<div style="width: 260px; padding: 58px 0 59px;text-align:center;"><img src="/img/gif.gif" /></div>'
  , _options = '<div class="notice">右上の[ option ]ボタンから設定をしてください</div>';

// utility functions
// ---------------------------------------------------
// ### diffStatus() - '-'がついてなかったら'+'をつける
// - @param {Number or String} _val
// - @return {String} 
function diffStatus(_v){
  return _v[0]==='-'?_v:'+'+_v;
}

// ### displayData() - 表示処理
// - @param {String} _v
// - @param {zepto obj} _area
// - @param {String} _type
function displayData(_v, _area, _type){
  document.getElementById(_area).innerHTML = _v;
  if(_type==='loading'){
    bg.requestStatus();
  }
}

// main functions
// ---------------------------------------------------
// ### setStatus() - 表示処理
function setStatus(){
  var _jd = lc.getItem('data')
    , jd = _jd!==''?JSON.parse(_jd):'init'
    , dl = JSON.parse(lc.getItem('dispLevel'))
    , _line = ''
    , i = 0;

  for(var key in dl){
    if(jd!=='init'){
      if (dl.hasOwnProperty(key)) {
        if( jd[key] === undefined && dl[key][0] === 1 ){
          if(i>0){
            _line += '</li></ul>';
          }
          _line += '<h2 id="'+key+'">'+ decodeURI(dl[key][1])+'</h2>'+
                   '<ul>';
          i++;
        }
        else {
          _line += '<li><span id="list_'+key+'">'+ decodeURI(jd[key]['jpName']) +'</span>'+
                   '<strong>'+ jd[key]['currentValue'] + '</strong>' +
                   '<em>('+ diffStatus(jd[key]['diffValue']) + ')</em>' +
                   '<span>'+ decodeURI(dl[key][1]) + '</span>' +
                   '</li>';
        }
      }
      document.getElementById('update').innerHTML = lc.getItem('update');
    }
  }
  displayData(_line+'</ul>', 'bengo4', 'data');
}

// ### $() - 即時関数
$(function($){
  // ####イベント設置
  $(window).on('storage', setStatus);
  $('#reload').on('click', function(){ displayData(_loading, 'bengo4', 'loading'); });
  $('#option').on('click', function(){ window.open('/options.html'); });
  
  // ####フォームに現在値をセット
  // option画面への誘導
  if(lc.url === ''){
    displayData(_options, 'bengo4', 'option notice');
  }
  // 表示処理
  else {
    setStatus();
  }
});