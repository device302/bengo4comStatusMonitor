// Version: 1.0   
// Last Up Date: 2013/10/22   
// Author: device302@gmail.com

// ##usage
// ###require
// * zepto.js ( http://zeptojs.com )

// variable declaration
// ---------------------------------------------------
var lc = localStorage                    // ローカルストレージ
  , timerID                              // 更新タイマーハンドラ
  // ### defaults settings propertys
  , defaultProps = { url: ''
    , badgeType : 'numLawyerAnswerRate'　// icon badgeに表示するデータのID
    , timerMs   : 300000　　　　　　　　　　// 何分おきに更新するか(ミリ秒)
    , update    : ''  　　　　　　　　　　　// 更新時間を保存
    , status    : 'installed'           // 状況: ここを更新してlcの更新イベントを投げる
    , data      : ''                    // 方喰城のJSONデータ丸ごと保存
    , dispLevel: '{'+                   // 表示用のデータ：ここにid入ってないのはJSONにあっても表示されないよ
        '"titleLaw": [1, "%e5%bc%81%e8%ad%b7%e5%a3%ab%e9%96%a2%e9%80%a3%e3%82%b9%e3%83%86%e3%83%bc%e3%82%bf%e3%82%b9"]'+
      ', "numLawyer": [2, "%e4%ba%ba"]'+                        //'登録弁護士数'
      ', "numBillingLawyer":  [2, "%e4%ba%ba"]'+                //'有料弁護士数'
      ', "numSearchContact":  [2, "%e4%bb%b6"]'+                //'プロフ問い合せ数'
      ', "titleUser": [1, "%e4%b8%80%e8%88%ac%e3%83%a6%e3%83%bc%e3%82%b6%e3%83%bc%e9%96%a2%e9%80%a3%e3%82%b9%e3%83%86%e3%83%bc%e3%82%bf%e3%82%b9"]'+
      ', "numCitizen":  [2, "%e4%ba%ba"]'+                      //'登録ユーザー数'
      ', "numBillingCitizen":  [2, "%e4%ba%ba"]'+               //'有料ユーザー数'
      ', "numBillingCitizenCurrentMonth":  [3, "%e4%ba%ba"]'+   //'今月有料ユーザー登録数'
      ', "numUnBillingCitizenCurrentMonth":  [3, "%e4%ba%ba"]'+ //'今月有料ユーザー退会数'
      ', "titleMinpo": [1, "%e3%81%bf%e3%82%93%e6%b3%95%e9%96%a2%e9%80%a3%e3%82%b9%e3%83%86%e3%83%bc%e3%82%bf%e3%82%b9"]'+
      ', "numBbsQuestion":  [2, "%e4%bb%b6"]'+                  //'みん法質問数'
      ', "numBbsAnswer":  [2, "%e4%bb%b6"]'+                    //'みん法回答数'
      ', "numLawyerAnswerRate":  [2, "%25"]'+                   //'みん法弁護士回答率'
    '}'
  };

// utility functions
// ---------------------------------------------------

  // ### zeroFill() - 数字の頭に'0'をつける
  // - @param {Number or String} value 頭に'0'をつける対象
  // - @param {Number} digit 桁数
  // - @return {String} 不正なデータの場合は value をリターン

  /* test code
  ------------------------------
  
  
  
  
  
  */
function zeroFill(value, digit){
  var tmp = '';
  if(typeof digit === 'string'){
    digit = parseInt(digit, 10);
  }
  else if (typeof digit !== 'number'){
    return value;
  }
  for(var i=0; i < digit; i++){
    tmp += '0';
  }
  return (tmp + value).slice('-'+digit);
}

// ### dateFormat() - 日付フォーマット変換
// - @param {String} _v 元になる日付データ
// - @return {String} YYYY/MM/DD h:m:s

/* test code
------------------------------
- 後で
*/
function dateFormat(_v){
  var date = new Date(_v)
    , Y = date.getFullYear()
    , M = zeroFill(date.getMonth() + 1, 2)
    , D = zeroFill(date.getDate(), 2)
    , h = zeroFill(date.getHours(), 2)
    , m = zeroFill(date.getMinutes(), 2)
    , s = zeroFill(date.getSeconds(), 2);

  return Y + '/' + M + '/' + D + ' ' + h + ':' + m + ':' + s;
}


// functions
// ---------------------------------------------------

// ### updateBadge() - バッジの数字をアップデートする
// - @param {String} _v 表示するデータ
function updateBadge(_v){
  var tmp = lc.getItem('data')
    , _tmp//= JSON.parse(tmp)
    , bType = lc.getItem('badgeType')
    , num;
  
  if(tmp !== ''){
    _tmp = JSON.parse(tmp);
    
    for(var key in _tmp){
      if (_tmp.hasOwnProperty(key)) {
        if(key === bType){
          num = _tmp[key]['currentValue'].split(',').join('');
          break;
        }
      }
    }
  }else{
    num = _v?_v:'---';
  }
  chrome.browserAction.setBadgeBackgroundColor({color: '#fe6000'});
  chrome.browserAction.setBadgeText({text: num});
}

// ### updateStatus() - lcの更新をして更新イベントFireする
// - @param {String} _v lcの'data'に入れるデータ
function updateStatus(_v){
  var _date  = new Date();
  
  // 正常データ時（Ajaxでデータとれた時
  if(_v !== 'offline'){
    lc.setItem('data', JSON.stringify(_v));
    lc.setItem('update', dateFormat(_date));
    updateBadge();
  }
  // オフライン時
  else {
    lc.setItem('status', 'offline:'+dateFormat(_date));
    updateBadge('offline');
  }
}

// ### requestURL() - ajax処理
// - @param {String} url 読み込みURL
// - @param {function} callback callback関数
function requestURL(url, callback) {
  $.ajax({
    type: 'GET',
    url: url,
    dataType: 'json',
    timeout: 300,
    success: function(data){
      callback(data);
    },
    error: function(){
      callback('offline');
    }
  });
}

// ### requestStatus() - リクエスト処理
function requestStatus() {
  requestURL(lc.getItem('url'), updateStatus);
  //更新タイマー処理
  if(timerID){
    clearTimeout(timerID);
  }
  timerID = setTimeout(requestStatus, lc.getItem('timerMs'));
}

// ### init() - 初期処理
function init(){
  // #### インストール直後のみ
  // lcにdefaultPropsのデータをコピーする（extendsだとダメー
  if(lc.getItem('update') === '' || lc.getItem('update') === null){
    for(var key in defaultProps){
      if (defaultProps.hasOwnProperty(key)) {
        lc.setItem(key, defaultProps[key]);
      }
    }
  }
  // url 確認して通信するか分岐
  // （コンパイル前にURLにデータ入れてたら else に入るね
  if(lc.getItem('status') === 'installed'){
    if(lc.getItem('url')===''){
      updateStatus('offline');
      updateBadge('urlx');
    } else {
      requestStatus();
    }
  }
  // ####イベント設置
  $(window).on('storage', requestStatus);
}
// ### $() - 即時関数
$(function($){
  // lc.clear();
  init($);
});