import React, { Component } from 'react';
import logo from './logo.svg';
// import MyDiagram from './Components/MyDiagram';
import Genogram from './Components/Genogram';
import './App.css';

class App extends Component {
    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <h1 className="App-title">React - Genogram</h1>
                </header>

                {/* <MyDiagram /> */}

                <Genogram />
            </div>
        );
    }
}

export default App;
