import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import GalleryScreen from './GalleryScreen'
import "swiper/swiper-bundle.min.css";
import { Route, Routes, BrowserRouter} from 'react-router-dom'
ReactDOM.render(
  <>
  <BrowserRouter>
  <Routes>
    <Route
    path='/'
    element={<App />}
    /> 
    <Route
    path='/gallery'
    element={<GalleryScreen />}
    />
  </Routes>
  </BrowserRouter>
  </>,
  document.getElementById('root')
);
