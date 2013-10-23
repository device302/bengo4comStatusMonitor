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
var lc = localStorage;

// utility functions
// ---------------------------------------------------
// ### changeMinToMiliSec() - 分→ミリ秒変換
// - @param {Number} _val 分
// - @return {String} ミリ秒
function changeMinToMiliSec (_val){
  
  return _val * 60000;
}
// ### changeMiliSecToMin() - ミリ秒→分変換
// - @param {Number} _val ミリ秒
// - @return {Number} 分
function changeMiliSecToMin (_val){
  return Math.floor( _val / 60000 );
}

// save functions
// ---------------------------------------------------

// ### badgeTypeSave() - バッジダイプをストアする
function badgeTypeSave() {
  lc.setItem('badgeType', this.getAttribute('value'));
}
// ### refreshTimeSave() - 更新時間をストアする
function refreshTimeSave() {
  var tmp = $('#sec').val();
  //整合性チェック(3桁以下の数字)
  if(tmp.match(/^\d{1,3}$/)){
    // 保存
    lc.setItem('timerMs', changeMinToMiliSec(tmp));
  }else{
    // 保存されてるデータをフォームに入れる
    $('#sec').val(changeMiliSecToMin(lc.getItem('timerMs')));
  }
}
// ### urlSave() - 読み込みURLをストアする
function urlSave(){
  lc.setItem('url', $('#url').val());
}

// main functions
// ---------------------------------------------------
// ### main() - メイン処理
function main($) {
  // ####フォームに現在値をセット
  $('#'+lc.getItem('badgeType')).attr('checked','checked');
  $('#sec').val(changeMiliSecToMin(lc.getItem('timerMs')));
  $('#url').val(lc.getItem('url'));
  // ####イベント設置
  $('.badgeType').on('click', 'li input', badgeTypeSave);
  $('.timer').on('click', 'li input[type="button"]', refreshTimeSave);
  $('.url').on('click', 'input[type="button"]', urlSave);
}
// ### $() - 即時関数
$(function($){
  main($);
});