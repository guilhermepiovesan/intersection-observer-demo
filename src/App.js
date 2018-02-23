import React, { Component } from 'react';
import axios from 'axios';
import './App.css';

class App extends Component {
  constructor(props) {
    super()
    this.state = {
      users: [],
      page: 0,
      loading: false,
      prevY: 0
    }
  }

  componentDidMount() {
    this.getUsers(this.state.page)

    let options = {
      root: null,
      rootMargin: '0px',
      threshold: 1.0
    }

    this.observer = new IntersectionObserver(
      this.handleObserver,
      options
    )

    this.observer.observe(this.loadingRef)
  }

  handleObserver = (entities, observer) => {
    const y = entities[0].boundingClientRect.y;
    if (this.state.prevY > y) {
      const lastUser = this.state.users[this.state.users.length - 1]
      const currentPage = lastUser.id;

      this.getUsers(currentPage)
      this.setState({ page: currentPage })
    }
    this.setState({ prevY: y })
  }

  getUsers(page) {
    this.setState({ loading: true })
    axios
      .get(`https://api.github.com/users?since=${page}&per_page=50`)
      .then(res => {
        this.setState({ users: [...this.state.users, ...res.data] })
        this.setState({ loading: false })
      })
  }

  render() {
    const loadingCss = {
      heigth: '100px',
      margin: '30px'
    }

    const loadingTextCSS = { display: this.state.loading ? 'block' : 'none' }

    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Infinite Scroll with Intersection Observer</h1>
        </header>
        <div id="App-container" className="App-container">
          <div style={{ minHeight: '800px' }}>
            <ul>
              { this.state.users.map(user => <li key={user.id}>{user.login}</li>)}
            </ul>
          </div>
          <div ref={loadingRef => (this.loadingRef = loadingRef)} className="App-loading">
            <span style={loadingTextCSS}>Loading...</span>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
