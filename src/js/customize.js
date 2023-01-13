((PLUGIN_ID) => {
  'use strict';

  
  // 設定値読み込み用変数
  const CONFIG = kintone.plugin.app.getConfig(PLUGIN_ID);

  if (!CONFIG) {
    alert('プラグインがうまく起動しませんでした。\n' + error.message);
    return false;
  }
  
  
  var CONFIG_MANY_TEXT = JSON.parse(CONFIG.many_text_datas);
  
 
  // event よりレコード情報を取得
  kintone.events.on('app.record.create.show', (event) => {
    const rec = event.record;

    window.alert('レコード追加画面を開きました');

    console.log(JSON.stringify(CONFIG));

    
    //データの数分処理を行う
    for (var i=0; i < CONFIG_MANY_TEXT.length; i++) {
      //入力可否判定
      if (CONFIG_MANY_TEXT[i][1] === "unable"){
        rec[CONFIG_MANY_TEXT[i][0]].disabled = true;
      }
    }
    
    return event;
  });
 
})(kintone.$PLUGIN_ID);