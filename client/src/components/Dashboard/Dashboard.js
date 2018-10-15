import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import './Dashboard.css';

//Services Imports
import discordServices from '../../services/discordServices';
import guildServices from '../../services/GuildServices/guildServices';

class Dashboard extends Component {

  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      userData: this.props.userData,
      chosenGuild: null
    };
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    document.querySelector('.NavBar').style.display = "inline-block";
    this._isMounted = true;
    this.getUserGuilds();
    console.log(this._isMounted);
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  getUserGuilds() {
    if(window.location.search) {
      this.setState({
        manageGuildId: window.location.search.split("&")[1].split("guild_id=")[1],
        manageGuildRedirect: true
      })
    }
    if(!window.localStorage.access_token) return;
    if(this._isMounted) {
      discordServices.getUserGuilds(window.localStorage.access_token)
        .then(results => {
          let tempArr = [];
          for(let i = 0; i < results.data.length; i++) {
            if(results.data[i].permissions >= 2146958591) tempArr.push(results.data[i]);
          }
          if(this._isMounted) this.setState({ discordGuilds: tempArr, chosenGuild: tempArr[0], dataReceived: true });
        })
        .catch(err => console.log(err));
    }
  }

  handleChange(e) {
    let value = e.target.value;
    guildServices.checkForGuild(value)
      .then(results => {
        if(results.data.data) {
          this.setState({
            manageGuildId: value,
            manageGuildRedirect: true
          })
        }else if(!results.data.data) {
          for(let i = 0; i < this.state.discordGuilds.length; i++) {
            if(value === this.state.discordGuilds[i].id) return this.setState({ chosenGuild: this.state.discordGuilds[i] }, () => {
              console.log(this.state.chosenGuild);
              window.location = `https://discordapp.com/api/oauth2/authorize?client_id=441338104545017878&response_type=code&guild_id=${this.state.chosenGuild.id}&permissions=2146958583&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fdashboard&scope=bot`
            })
          }
        }
      })
      .catch(err => console.log(err));

  }


  renderGuilds() {
    let Guilds = this.state.discordGuilds.map((el, idx) => {
      return(
        <option key={idx} value={el.id}>{el.name}</option>
      );
    });
    return(
      <div className="Dashboard-DiscordGuilds">
        <h4>Manage Discord Server: </h4>
        <select onChange={this.handleChange}>
          <option>Select A Server: </option>
          {Guilds}
        </select>
      </div>
    );
  }

  render() {
    return(
      <div className="Dashboard">
        <div className="Dashboard-Contents">
          {this.state.dataReceived ? this.renderGuilds() : <div className="loading" id="Dashboard" />}
          {this.state.manageGuildRedirect ? <Redirect to={`/dashboard/server/${this.state.manageGuildId}`}/> : ''}
        </div>
      </div>
    );
  }
};

export default Dashboard;
