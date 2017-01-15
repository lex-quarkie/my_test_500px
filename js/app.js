((React, fetch, Redux) => {    
  // Redux actions
  const actions = {
    SELECT: 'SELECT_photo'
  };
  
  // Redux store
  const reducer = (state, action) => {
    switch (action.type) {
        case actions.SELECT:
          return {photo: action.photo};
        default:
          return {photo: null}
    }
  };
  const photoStore = Redux.createStore(reducer);

  // photo component
  class Photo extends React.Component {
    render() {
      let photo = (<div>No photo selected</div>);
      if (this.props.photo) {
        console.log('props.photo BLABLABLA');
        photo = (
          <div className="photo">
            <h2>{this.props.photo.name}</h2>
            <p>{this.props.photo.description}</p>            
          </div>
        )
      }
      return (
        <div className="photo">{photo}</div>  
      )
    }
  }

  class Photos extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        photos: [],
        consumer_key: 'wB4ozJxTijCwNuggJvPGtBGCRqaZVcF6jsrzUadF',
        feature: "popular",
        page: "1"
      };
    }

    componentDidMount() {
      let self = this;
      let url = `https://api.500px.com/v1/photos?feature=${this.state.feature}&consumer_key=${this.state.consumer_key}&page=${this.state.page}`
      fetch(url)
        .then((response) => response.json())
        .then((json) => {
          console.log(json);
          self.setState({
            photos: json.photos
          });
        })
        .catch((e) => {
          console.log('Error while retrieving photos', e);
        });
    }

    render() {
      let photos, self = this;
      if (self.state.photos.length === 0) {
        photos = (<div>loading...</div>)
      }
      else {
        let photosList = self.state.photos.map((photo, key) => {
          return (
            <div className="photo" id={key} onClick={() => self.selectPhoto(photo).bind(self)}>          
                  <img src={photo.image_url} />
                <div className="info">
                  <p className="title">{photo.name}</p>
                  <p className="author">{photo.user.fullname}</p>
                </div>
            </div>
            );
        });
        photos = (<div>{photosList}</div>)
      }
      return (
        <div className="photos">{photos}</div>
      );
    }
    
    selectPhoto(photo) {
      this.props.store.dispatch({
        type: actions.SELECT,
        photo: photo
      });
    }

  }

  // App component
  class Gallery extends React.Component {

    constructor(props) {
      super(props);
      this.state = {
        selectedPhoto: null
      };
    }

    componentDidMount() {
      this.unsubscribe = photoStore.subscribe(this.onphotoSelected.bind(this));
    }

    componentWillUnmount() {
      this.unsubscribe();
    }

    onphotoSelected() {
      this.setState({
        selectedPhoto: photoStore.getState().photo
      });
      console.log('Photo selected ');
    }

    render() {
      return (
        <div>
          <Photos store={photoStore}/>
          <Photo photo={this.state.selectedPhoto} store={photoStore}/>
        </div>
      )
    }
  }

  // Render application
  ReactDOM.render(<Gallery/>, document.getElementById('app'));
  
})(React, fetch, Redux);
