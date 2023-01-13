jQuery.noConflict();
(function($, PLUGIN_ID) {
  'use strict';

  // プラグインIDの設定
  var CONF = kintone.plugin.app.getConfig(PLUGIN_ID);
  var $form = $('.js-submit-settings');
  var $addRowButton = $('.kintoneplugin-button-add-row-image');
  var $deleteRowButton = $('.kintoneplugin-button-remove-row-image');
  var $many = $('select[name="js-select-many-field"]');
  var $text = $('select[name="js-select-text-field"]');

  // 保存されたテーブルデータがある場合、パースして代入
  if (CONF.many_text_datas){
    var parseManyText = JSON.parse(CONF.many_text_datas);
  }

  // テーブル行数取得
  var rowIndex = 0;

  // セレクトボックス用カラム名配列
  var textColumns = [];

  // 入力モード
  const escapeHtml = (htmlstr) => {
    return htmlstr.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  };

  // テキストフィールド&テーブルテキストフィールドの取得　カラム名を追加し、行追加処理のためにカラム名配列にpush
  function setDropDownForText() {
    return KintoneConfigHelper.getFields('SINGLE_LINE_TEXT').then(function(resp) {
      var $option = $('<option>');
      $option.attr('value', "$id");
      $option.text(escapeHtml("レコードID"));
      $many.append($option.clone());
      textColumns.push({id:"$id", value:"レコードID"})
      resp.forEach(function(field) {
          var $option = $('<option>');
          $option.attr('value', field.code);
          $option.text(escapeHtml(field.label));
          $many.append($option.clone());
          textColumns.push({id:field.code,value:field.label})
          });
          return KintoneConfigHelper.getFields('DROP_DOWN').then(function(resp){
            resp.forEach(function(field) {
              var $option = $('<option>');
              $option.attr('value', field.code);
              $option.text(escapeHtml(field.label));
              $many.append($option.clone());
              textColumns.push({id:field.code,value:field.label})
            });
            return KintoneConfigHelper.getFields('NUMBER').then(function(resp){
              resp.forEach(function(field) {
                var $option = $('<option>');
                $option.attr('value', field.code);
                $option.text(escapeHtml(field.label));
                $many.append($option.clone());
                textColumns.push({id:field.code,value:field.label})
              });
              return KintoneConfigHelper.getFields('CHECK_BOX').then(function(resp){
                resp.forEach(function(field) {
                  var $option = $('<option>');
                  $option.attr('value', field.code);
                  $option.text(escapeHtml(field.label));
                  $many.append($option.clone());
                  textColumns.push({id:field.code,value:field.label})
                });
                return KintoneConfigHelper.getFields('RADIO_BUTTON').then(function(resp){
                  resp.forEach(function(field) {
                    var $option = $('<option>');
                    $option.attr('value', field.code);
                    $option.text(escapeHtml(field.label));
                    $many.append($option.clone());
                    textColumns.push({id:field.code,value:field.label})
                  });
                  $many.val(CONF.many);
                  $text.val(CONF.text);
                });
              });
            });
          }).catch(function(err) {
            return alert('Kintoneアプリのフィールド情報を取得できませんでした。');
          });
        }).catch(function(err) {
          return alert('Kintoneアプリのフィールド情報を取得できませんでした。');
        });
      }
  
  

  // 初期化処理 ドロップダウンメニューを設定&テーブル生成
  setDropDownForText()
  .then(genManyText)

  // 保存処理
  $form.on('submit', function(e) {
    e.preventDefault();
    const config = [];
    // const many = [];
    // const text = [];
    const manyTextDatas = [];

    // テーブルの値取得
    for(var i=1; i <= rowIndex; i++){
      var $recordMany = $(`select[name="js-select-many-field-${i}"]`);
      var $recordText = $(`select[name="js-select-text-field-${i}"]`);
      manyTextDatas.push([$recordMany.val(),$recordText.val()]);

    }
    
    config.many_text_datas = JSON.stringify(manyTextDatas);
       
    // 「保存する」ボタン押下時に入力情報を設定する
    kintone.plugin.app.setConfig(config, function() {
      alert('設定を保存しました。アプリを更新してください');
      window.location.href = "../../flow?app=" + kintone.app.getId() + "#section=settings";
    });
  });
 

  // テーブル行追加処理
  function addTableRow(){
    var table = document.getElementById("color-table");
    var row = table.insertRow(table.rows.length);

    // テーブル行数取得
    rowIndex = table.rows.length-1
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);

    cell1.innerHTML = `
    <div class="kintoneplugin-table-td-control">
      <div class="kintoneplugin-table-td-control-value">
        <div class="kintoneplugin-select-outer">
          <div class="kintoneplugin-select">
            <select
              id="select-many-field-${rowIndex}"
              name="js-select-many-field-${rowIndex}"
            >
              <option value="">-----</option>
            </select>
          </div>
        </div>
      </div>
    </div>
    `;

    cell2.innerHTML = `
    <div class="kintoneplugin-table-td-control">
      <div class="kintoneplugin-table-td-control-value">
        <div class="kintoneplugin-select-outer">
          <div class="kintoneplugin-select">
            <select
              id="select-text-field-${rowIndex}"
              name="js-select-text-field-${rowIndex}"
            >
            <option value="">-----</option>
            <option value="able">入力可</option>
            <option value="unable">入力不可</option>
            </select>
          </div>
        </div>
      </div>
    </div>
    `;

    // セレクトボックスの中身を設定
    var $many = $(`select[name="js-select-many-field-${rowIndex}"]`);
    textColumns.forEach((textColumn) => {
      var $option = $('<option>');
      $option.attr('value', textColumn.id);
      $option.text(escapeHtml(textColumn.value));
      $many.append($option.clone());
    });

  }

    // 設定テーブルを自動生成
  function genManyText(){
    // 保存情報をもとにテーブルを生成
    for (var i=0; i < parseManyText.length; i++) {
      addTableRow();

      var indexRow = i + 1;
      var $recordMany = $(`select[name="js-select-many-field-${indexRow}"]`);
      var $recordText = $(`select[name="js-select-text-field-${indexRow}"]`);
      

      // テーブル規定値設定
      $recordMany.val(parseManyText[i][0]);
      // テーブル規定値設定
      $recordText.val(parseManyText[i][1]);

    }
  }

  // 行追加
  $addRowButton.click(function(){
    addTableRow();
  });

  // 行削除
  $deleteRowButton.click(function(){
    var table = document.getElementById("color-table");
    if(table.rows.length-1 > 0){
      table.deleteRow(table.rows.length-1);
      rowIndex--;
    }
  });

  

  // キャンセルボタン
  $('#check-plugin-cancel').click(() => {
    window.location.href = "../../flow?app=" + kintone.app.getId() + "#section=settings";
  });

  


})(jQuery, kintone.$PLUGIN_ID);

