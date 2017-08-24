import lunr from 'lunr';
import _ from 'underscore';

const search = {
  index: function(items) {
    this._index = lunr(function() {
      this.field('term', {boost: 10});
      this.field('type');
      this.field('kind');
      this.field('explanation', {boost: 10});
      this.field('origin');
      this.field('alias');
      this.field('relationships');
      this.ref('id');
    });

    _.each(items, (item, i) => {
      var item = Object.assign({}, item);
      item.id = i;
      this._index.add(item);
    });
  },

  search: function(query) {
    return this._index.search(query);
  }
};

export default search;
