# Front End Nanodegree Neighborhood Map Project

This project is a single page application featuring a map of Board Gaming locations in the Denver Colorado area. The map includes markers for each location, third party data about each location and various ways to browse the content.

## Getting Started

To get started, clone this repository from GitHub:

```
$ git clone https://github.com/rafbenitez/neighborhood-map.git
```
Install project dependencies:

```
$ npm install
```
### Start the application in Development Mode:

```
$ npm start
```
This runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Start the application in Production Mode:
```
$ npm run build
$ serve -s build
```
Open [http://localhost:5000](http://localhost:5000) to view it in the browser.<br>
Note: You may need to Open [http://0.0.0.0:5000](http://0.0.0.0:5000) instead depending on your device settings.<br>
This runs the app in the production mode and enables the Serive Worker which provides offline functionality.<br>

## Built With

* [React](https://reactjs.org/)
* [ReactDOM](https://reactjs.org/docs/react-dom.html)
* [Create React App](https://github.com/facebook/create-react-app)
* [Foursquare](https://developer.foursquare.com/docs)
* [Font Awesome](https://fontawesome.com/how-to-use/on-the-web/using-with/react)
* [Google Maps API](https://developers.google.com/maps/documentation/)
* [Google Maps Platform Styling Wizard](https://mapstyle.withgoogle.com/)
* [google-maps-react](https://www.npmjs.com/package/google-maps-react)
* [prop-types](https://www.npmjs.com/package/prop-types)
* [sort-by](https://www.npmjs.com/package/sort-by)
* See package.json for the full list of dependencies


## Notes
Offline first functionality is accomplished by enabling the service worker that is installed by create-react-app. Modified index.js to enable this feature.

## Authors

* **Rafael Benitez** - *Initial work* - [rafbenitez](https://github.com/rafbenitez)

## License

This project is licensed under the [MIT License] - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* This is a project for the Udacity Front End Web Developer Nanodegree Program
