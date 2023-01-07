import React, { Component } from 'react';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Navigation from './components/Navigation/Navigation';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Logo from './components/Logo/Logo';
import Rank from './components/Rank/Rank';
import ParticlesBg from 'particles-bg';
import Tilt from 'react-parallax-tilt';
import './App.css';



const initialState = {
    input: '',
    imageUrl: '',
    box: {},
    route: 'signin',
    isSignedIn: false,
    user: {
      id: '',
      name: '',
      email: '',
      entries: 0,
      joined: ''
    }
  }


class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }

  loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }})
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  displayFaceBox = (box) => {
    this.setState({box: box});
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

//stackoverflow's
  onButtonSubmit = () => {
    console.log('button clicked');
    this.setState({imageUrl: this.state.input});
    const USER_ID = 'oxxxxxxxxxx';//(the code by your name)
    const PAT = '96d20xxxxxxxxxxxx';//(your Clarifai api key)
    const APP_ID = 'facerec';//(what you named your app in Clarifai)
    const MODEL_ID = 'face-detection';
    const MODEL_VERSION_ID = '6dc7e46bc9124c5c8824be4822abe105';    
    const IMAGE_URL = this.state.input;
    const raw = JSON.stringify({
      "user_app_id": {
          "user_id": USER_ID,
          "app_id": APP_ID
      },
      "inputs": [{"data": {"image": {"url": IMAGE_URL}}}]
    });
    
    const requestOptions = {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Authorization': 'Key ' + PAT
      }, body: raw
    };
    fetch("https://api.clarifai.com/v2/models/" + MODEL_ID + "/versions/" + MODEL_VERSION_ID + "/outputs", requestOptions)
      .then(response => response.text())
      .then(response => {
        const parser = JSON.parse(response)
        console.log('hi', parser.outputs[0].data.regions[0].region_info.bounding_box)
        // console.log(response[])
        if (response) {
          fetch('http://localhost:3000/image', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              id: this.state.user.id
            })
          })
          .then(response => response.json())
          .then(count => {
            this.setState(Object.assign(this.state.user, { entries: count }))
          })
        }
        this.displayFaceBox(this.calculateFaceLocation(response))
      })
      .then(result => console.log(result))
      .catch(error => console.log('error', error));

  //andrei's
  // onButtonSubmit = () => {
  //   this.setState({imageUrl: this.state.input});
  //     fetch('https://intense-plains-82472.herokuapp.com/imageurl', {
  //       method: 'post',
  //       headers: {'Content-Type': 'application/json'},
  //       body: JSON.stringify({
  //         input: this.state.input
  //       })
  //     })
  //     .then(response => response.json())
  //     .then(response => {
  //       if (response) {
  //         fetch('https://intense-plains-82472.herokuapp.com/image', {
  //           method: 'put',
  //           headers: {'Content-Type': 'application/json'},
  //           body: JSON.stringify({
  //             id: this.state.user.id
  //           })
  //         })
  //           .then(response => response.json())
  //           .then(count => {
  //             this.setState(Object.assign(this.state.user, { entries: count}))
  //           })
  //           .catch(console.log)

  //       }
  //       this.displayFaceBox(this.calculateFaceLocation(response))
  //     })
  //     .catch(err => console.log(err));
  // }

  // onButtonSubmit = () => {
  //   this.setState({imageUrl: this.state.input});
  //   fetch('https://intense-plains-82472.herokuapp.com/imageurl', {
  //     method: 'post',
  //     headers:{'Content-Type': 'application/json'},
  //     body: JSON.stringify({
  //       input: this.state.input
  //     })
  //   })
  //   .then(response => response.json())
  //   .then(response => {
  //     if (response) {
  //       fetch('https://intense-plains-82472.herokuapp.com/image', {
  //         method: 'put',
  //         headers:{'Content-Type': 'application/json'},
  //         body: JSON.stringify({
  //           id: this.state.user.id
  //         })
  //       })
  //       .then(response => response.json())
  //       .then(count => {
  //         this.setState(Object.assign(this.state.user, { entries: count }))
  //         })
  //         .catch(console.log);
  //     }
  //     this.displayFaceBox(this.calculateFaceLocation(response)) 
  //   })
  //   .catch(err => console.log(err));
  // }

onRouteChange = (route) => {
  if (route === 'signout') {
    this.setState(initialState)
  } else if (route === 'home') {
    this.setState({isSignedIn: true})
  }
  this.setState({route: route});
}

  render() {
   const { isSignedIn, imageUrl, route, box } = this.state;
  return (
    <div className="App">
      <ParticlesBg type="circle" bg={true} />
      <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
      { route === 'home'
        ? <div> 
        <Logo />
        <Rank 
          name={this.state.user.name} 
          entries={this.state.user.entries}
          />
        <ImageLinkForm 
          onInputChange={this.onInputChange} 
          onButtonSubmit={this.onButtonSubmit} 
        />
        <FaceRecognition box={box} imageUrl={imageUrl} />
      </div>
      :  (
        route === 'signin'
        ? <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
        : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
        )
      }
    </div>
    );
  }
}
export default App;
