import $ from 'jquery';
import _ from 'underscore';

// first publish your spreadsheet:
// File > Publish to the web
// then click "Publish"

const spreadsheet = {
  load: function(id, num, onLoad) {
    var url = `https://spreadsheets.google.com/feeds/list/${id}/${num}/public/full?alt=json`;
    $.ajax({
      url: url,
      success: data => onLoad(data.feed.entry.map(this.parseRow))
    });
  },

  parseRow: function(row) {
    // parse a GSX (Google Spreadsheet)
    // row into something nicer
    var obj = {};
    _.each(row, (v, k) => {
      if (k.startsWith('gsx$')) {
        var field = k.replace('gsx$', '');
        obj[field] = v.$t;
      }
    });
    return obj;
  }
}

export default spreadsheet;
