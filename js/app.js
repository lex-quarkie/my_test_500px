 
  // Redux actions
  const actions = {
    SELECT: 'SELECT_photo',
    DESELECT: 'DESELECT_photo',
    LOAD: 'LOAD_photos'
  };
  
  // Redux store
  const reducer = (state, action) => {
    switch (action.type) {
        case actions.SELECT:
          return {photo: action.photo};
        case actions.DESELECT:
          return {photo: action.photo};
        case actions.DESELECT:
          return {photo: action.photo};
        default:
          return {photo: null};
    }
  };
  const photoStore = Redux.createStore(reducer);

  class Photo extends React.Component {
    render() {
      let photo = (<div>No photo selected</div>);
      if (this.props.photo) { }
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
        image_size: 6,
        page: "1"
      };
    }

    componentDidMount() {
      let self = this;
      let url = `https://api.500px.com/v1/photos?feature=${this.state.feature}&consumer_key=${this.state.consumer_key}&page=${this.state.page}&image_size=${this.image_size}`
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
            <div className="photo" key={key} onClick={() => self.selectPhoto(photo).bind(self)}>          
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

  class Imageview extends React.Component {

    constructor(props) {
      super(props);
    }

    render() {
       if (photoStore.getState().photo){
        return (
          <div className="modal">
            <h1>{photoStore.getState().photo.name}</h1>
            <img src={photoStore.getState().photo.image_url} onClick={() => self.deselectPhoto()}></img>
          </div>
      ) }
        else {return (
      <div className="modal none">
      </div>  )
      }
    }

    deselectPhoto(photo) {
      this.props.store.dispatch({
        type: actions.DESELECT,
        photo: null
      });
    }
}
 

  class Gallery extends React.Component {

    constructor(props) {
      super(props);
      
    }

    componentDidMount() {
      this.unsubscribe = photoStore.subscribe(this.onPhotoSelected.bind(this));
    }

    componentWillUnmount() {
      this.unsubscribe();
    }

    onPhotoSelected() {
      this.forceUpdate();
    }

    render() {
      
      return (
        <div>
          <Photos store={photoStore}/>
          <Imageview store={photoStore}/>
        </div>
      )
    }
  }


  ReactDOM.render(<Gallery/>, document.getElementById('app'));
  
