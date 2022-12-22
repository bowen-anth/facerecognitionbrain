import './App.css';
import React, { Component } from 'react';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Navigation from './components/Navigation/Navigation';
import Signin from './components/Signin/Signin';
import Clarifai from 'clarifai';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Logo from './components/Logo/Logo';
import Rank from './components/Rank/Rank';
import ParticlesBg from 'particles-bg';
import Tilt from 'react-parallax-tilt';

const app = new Clarifai.App({
  apiKey: '8579fa0fc3014eb4bb093eadd0f1978b'
});

class App extends Component {
  constructor(){
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box: {},
      route: 'signin'
    }
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
    console.log(box);
    this.setState({box: box});
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input})
    app.models
    .predict(
      Clarifai.FACE_DETECT_MODEL,
      this.state.input)
    .then(response => this.displayFaceBox(this.calculateFaceLocation(response))) 
    .catch(err => console.log(err))
  }

onRouteChange = (route) => {
  this.setState({route: route});
}

  render() {
  return (
    <div className="App">
      <ParticlesBg type="circle" bg={true} />
      <Navigation onRouteChange={this.onRouteChange} />
      { this.state.route === 'signin'
        ? <Signin onRouteChange={this.onRouteChange} />
        : <div> 
            <Logo />
            <Rank />
            <ImageLinkForm 
            onInputChange={this.onInputChange} 
            onButtonSubmit={this.onButtonSubmit} 
            />
            <FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl} />
          </div>
     }
    </div>
  );
}
}
export default App;
