import sheet from './Sheet';
import search from './Search';
import React, {Component} from 'react';

const SPREADSHEET_ID = '1e5bokjIu438y4DIaP_nrvtcrjE3zysUeRt7DHwtZlqw';
const FIELDS = ['term', 'type', 'url', 'kind', 'explanation', 'origin', 'alias', 'relationships'];


class App extends Component {
  componentWillMount() {
    this.setState({
      terms: [],
      results: [],
      kinds: [],
      query: ''
    });

    sheet.load(SPREADSHEET_ID, 1, rows => {
      // map long google spreadsheet field names
      // to more readable ones
      var key_map = {};
      Object.keys(rows[0]).map(k => {
        for (var i=0; i < FIELDS.length; i++) {
          if (k.startsWith(FIELDS[i])) {
            key_map[k] = FIELDS[i];
            break;
          }
        }
      });

      // clean up row data
      var terms = [];
      var kinds = [];
      rows.map(r => {
        var term = {};
        Object.keys(r).map(k => {
          var k_ = key_map[k];
          term[k_] = r[k];
        });
        kinds.push(
          ...term.kind.split(/[,;]/).map(k => k.trim().replace('-', ' ')));
        terms.push(term);
      });
      kinds = Array.from(new Set(kinds)).filter(k => k.length);
      this.setState({
        terms: terms,
        results: terms,
        kinds: kinds
      });
      search.index(terms);
    });
  }

  componentDidMount() {
    this.searchInput.focus();
  }

  search(query) {
    var results;
    if (query) {
      results = search.search(query).map(res => this.state.terms[res.ref]);
    } else {
      results = this.state.terms;
    }
    this.setState({
      results: results,
    });
  }

  filter(kind) {
    this.search(kind);
    this.setState({
      query: kind
    });
    this.searchInput.focus();
  }

  render() {
    return (
      <div>
        <input
                type="text"
                name="search"
                className="search-input"
                placeholder="Search terms"
                aria-label="Search"
                value={this.state.query}
                ref={(input) => { this.searchInput = input; }}
                onKeyUp={(ev) => this.search(ev.target.value)}/>
        <ul className="kinds">
          {this.state.kinds.map((kind, i) => <li key={i} onClick={(ev) => this.filter(kind)}><span>{kind}</span></li>)}
        </ul>
        <div className="results">
          {this.state.results.map((term, i) => <Term key={i} {...term} />)}
        </div>
      </div>
    )
  }
}

class Term extends Component {
  render() {
    return (
      <section>
        <h2>{this.props.term}</h2>
        <ul>
          <li>Type: {this.props.type}</li>
          <li>Kind: {this.props.kind}</li>
          <li>Explanation: {this.props.explanation}</li>
          <li>Origin: {this.props.origin}</li>
          <li>Alias: {this.props.alias}</li>
          <li>Relationships: {this.props.relationships}</li>
        </ul>
      </section>
    );
  }
}


export default App;
