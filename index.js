/**
 * the app
 */
const flatten = data => {
  for (let semester in data) {
    data[semester] = [].concat.apply([], Object.keys(data[semester]).map(subject =>
      [].concat.apply([], Object.keys(data[semester][subject]).map(level =>
        Object.keys(data[semester][subject][level]).map(section =>
          data[semester][subject][level][section]
        )
      ))
    ));
  }
  return data;
};


class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      data: {},
      filteredData: {},
      semester: '',
      allAttributes: [],
      allSubjects: [],
      pages: 1,
      filters: {
        status: {
          query: null,
          func: (data, query) => data.filter(course => query ? course['STATUS'] === query : true)
        },
        subjects: {
          query: [],
          func: (data, query) => data.filter(course => query.length ? query.some(subject => subject === course.dept) : true)
        },
        attributes: {
          query: [],
          func: (data, query) => data.filter(course => query.length ? query.reduce((p, c) => p && course['CRSE ATTR'].includes(c), true) : true)
        },
        title: {
          query: null,
          func: (data, query) => data.filter(course => query ? course['TITLE'].toLowerCase().indexOf(query.toLowerCase()) > -1 : true)
        }
      }
    };
    this.onSemesterChange = this.onSemesterChange.bind(this);
    this.filter = this.filter.bind(this);
    this.onFilter = this.onFilter.bind(this);
    this.loadPage = this.loadPage.bind(this);
    this.removeFilter = this.removeFilter.bind(this);
  }

  componentDidMount() {
    fetch('https://wm-course-data.herokuapp.com/courses')
      .then(res => res.json())
      .then(data => {
        data = flatten(data);
        const semester = Object.keys(data)[0];
        const allAttributes = [].concat.apply([], [].concat.apply([], Object.keys(data).map(semester => data[semester])).map(course => course['CRSE ATTR']))
          .filter((el, i, self) => i === self.indexOf(el))
          .sort();
        const allSubjects = [].concat.apply([], [].concat.apply([], Object.keys(data).map(semester => data[semester])).map(course => course.dept))
          .filter((el, i, self) => i === self.indexOf(el))
          .sort();
        this.setState({
          data,
          filteredData: JSON.parse(JSON.stringify(data)),
          semester,
          allAttributes,
          allSubjects
        }, this.filter);
      });
  }

  onSemesterChange(e) {
    this.setState({ semester: e.target.value, pages: 1 }, this.filter);
  }

  filter() {
    const { data, filters, semester } = this.state;
    let filteredData = JSON.parse(JSON.stringify(data));
    for (let filter in filters) {
      if (filteredData[semester])
        filteredData[semester] = filters[filter].func(filteredData[semester], filters[filter].query);
    }
    this.setState({ filteredData });
  }

  onFilter(filter, e) {
    const { filters } = this.state;
    if (Array.isArray(filters[filter].query)) {
      if (e.target.value !== 'null')
        filters[filter].query.push(e.target.value);
      else
        filters[filter].query = [];
    } else {
      filters[filter].query = e.target.value === 'null' ? null : e.target.value;
    }
    this.setState({ filters }, this.filter);
  }

  loadPage() {
    this.setState({ pages: ++this.state.pages });
  }

  removeFilter(filter, query) {
    const { filters } = this.state;
    filters[filter].query = filters[filter].query.filter(q => q !== query);
    this.setState({ filters }, this.filter);
  }

  render() {
    const {
      data,
      pages,
      filters,
      semester,
      allSubjects,
      filteredData,
      allAttributes,
    } = this.state;

    return (<div className='container mb2'>

      <div style={{ borderBottom: '#000 1px solid' }}>
        <div className='center'>
          <h2>W&M Course Search</h2>
        </div>
      </div>


      <div className='row mt1'>

        <div className='col s12 m6 l6 mb1'>
          <div>Semester</div>
          <div className='input-field'>
            <select className='browser-default' onChange={this.onSemesterChange.bind(this)}>
              {Object.keys(data).map((semester, i) => <option key={i} value={semester}>
                {semester}
              </option>)}
            </select>
          </div>
        </div>

        <div className='col s12 m6 l6 mb1'>
          <div>Subject</div>
          <div className='input-field'>
            <select className='browser-default' onChange={this.onFilter.bind(this, 'subjects')}>
              <option value={'null'}>ALL</option>
              {allSubjects.map((subject, i) => <option key={i} value={subject}>{subject}</option>)}
            </select>
          </div>
        </div>

        <div className='col s12 m6 l6 mb1'>
          <div>Status</div>
          <div className='input-field'>
            <select className='browser-default' onChange={this.onFilter.bind(this, 'status')}>
              <option value={'null'}>ALL</option>
              {data[semester] && data[semester]
                .map(course => course['STATUS'])
                .filter((el, i, self) => i === self.indexOf(el))
                .map((status, i) => <option key={i} value={status}>{status}</option>)}
            </select>
          </div>
        </div>

        <div className='col s12 m6 l6 mb1'>
          <div>Attribute</div>
          <div className='input-field'>
            <select className='browser-default' onChange={this.onFilter.bind(this, 'attributes')}>
              <option value={'null'}>Any</option>
              {allAttributes.map((attr, i) => <option key={i} value={attr}>{attr}</option>)}
            </select>
          </div>
        </div>

      </div>


      {/* Search bar */}
      <div className='row'>
        <div className='input-field col s12 m8 l6 offset-m2 offset-l3'>
          <input id='search' type='text' onChange={this.onFilter.bind(this, 'title')} />
          <label htmlFor='search'>Search for a class</label>
        </div>
      </div>


      {/* Filters */}
      <div>
        {Object.keys(filters).filter(filter => filters[filter].query && Array.isArray(filters[filter].query)).map((filter, i) => <div key={i} className='flex-container'>
          {filters[filter].query.map((query, i) => <div key={i} className='valign-wrapper mr1 pr1 border mb1'>
            <i className='material-icons hover-red clickable valign' onClick={this.removeFilter.bind(this, filter, query)}>close</i>
            <span>{query}</span>
          </div>)}
        </div>)}
      </div>


      {/* table */}
      <div>
        <table className='striped'>
          <thead>
            <tr>
              <th>Subject</th>
              <th>Level</th>
              <th>Title</th>
              <th>Instructor</th>
              <th>Credits</th>
              <th>Section</th>
              <th>Days</th>
              <th>Meet Times</th>
              <th>Seats Available</th>
              <th>Attributes</th>
            </tr>
          </thead>
          <tbody>
            {filteredData[semester] && filteredData[semester].slice(0, 50 * pages).map((course, i) => <tr key={i}>
              <td>{course.dept}</td>
              <td>{course.level}</td>
              <td>{course['TITLE']}</td>
              <td>
                <a href={`http://www.ratemyprofessors.com/search.jsp?query=${course['INSTRUCTOR'].replace(/, /g, '+')}`} target='_blank'>
                  {course['INSTRUCTOR']}
                </a>
              </td>
              <td>{course['CRDT HRS']}</td>
              <td>{course.section}</td>
              <td>{course['MEET DAYS']}</td>
              <td>{course['MEET TIMES']}</td>
              <td>{course['SEATS AVAIL']}</td>
              <td>{course['CRSE ATTR'].join(', ')}</td>
            </tr>)}
          </tbody>
        </table>
      </div>

      <div className='center'>
        <a className='btn-floating btn-large waves-effect waves-light red'>
          <i className='material-icons' onClick={this.loadPage}>add</i>
        </a>
      </div>

    </div>);
  }

}

ReactDOM.render(<App />, document.getElementById('app'));
