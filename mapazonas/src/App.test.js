import React from 'react';
import { render } from '@testing-library/react';
import App from './App';
import createGoogleMapsMock from 'jest-google-maps-mock';
import Enzyme, {shallow} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import  pin  from './pin.svg';


describe('Mapa creacion', () => {
  let googleMaps;
  beforeEach(() => {
    googleMaps = createGoogleMapsMock();
  });
  //
  it('Creacion del mapa Google', () => {
    const mapDiv = document.createElement('div');
    new googleMaps.Map(mapDiv);
 
    expect(googleMaps.Map).toHaveBeenCalledTimes(1);
    expect(googleMaps.Map.mock.instances.length).toBe(1);
    expect(googleMaps.Map).toHaveBeenLastCalledWith(mapDiv); 

    it('Da clic y se acerca'),() =>{
      //const text = wrapper.find('button');
      const button = wrapper.find('button');
      button.simulate('click');
      const text = wrapper.find('div div');
      expect(text.length).toBe(0);
    }
    
  });
});

