import React, { useState } from 'react';
import { useCountries, useStates, useCities } from '../../hooks';
import { Button } from '../ui/button';
import { Select } from '../ui/select';
import { Label } from '../ui/label';
import { RefreshCw, Globe, MapPin, Building2 } from 'lucide-react';

const CascadingDropdownsTest = () => {
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  // Hooks for cascading data
  const { countries, loading: countriesLoading, error: countriesError, fetchActiveCountries } = useCountries();
  const { 
    states, 
    loading: statesLoading, 
    error: statesError, 
    fetchStatesByCountry, 
    clearStates 
  } = useStates();
  const { 
    cities, 
    loading: citiesLoading, 
    error: citiesError, 
    fetchCitiesByState, 
    clearCities 
  } = useCities();

  // Handle country selection
  const handleCountryChange = (countryId) => {
    setSelectedCountry(countryId);
    setSelectedState('');
    setSelectedCity('');
    
    // Clear dependent dropdowns
    clearStates();
    clearCities();
    
    // Fetch states for selected country
    if (countryId) {
      fetchStatesByCountry(countryId);
    }
  };

  // Handle state selection
  const handleStateChange = (stateId) => {
    setSelectedState(stateId);
    setSelectedCity('');
    
    // Clear cities dropdown
    clearCities();
    
    // Fetch cities for selected state
    if (stateId) {
      fetchCitiesByState(stateId);
    }
  };

  // Handle city selection
  const handleCityChange = (cityId) => {
    setSelectedCity(cityId);
  };

  // Reset all selections
  const handleReset = () => {
    setSelectedCountry('');
    setSelectedState('');
    setSelectedCity('');
    clearStates();
    clearCities();
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Cascading Dropdowns Test
        </h3>
        <div className="flex space-x-2">
          <Button
            onClick={fetchActiveCountries}
            disabled={countriesLoading}
            variant="outline"
            size="sm"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${countriesLoading ? 'animate-spin' : ''}`} />
            Refresh Countries
          </Button>
          <Button
            onClick={handleReset}
            variant="outline"
            size="sm"
          >
            Reset All
          </Button>
        </div>
      </div>

      {/* Status Display */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
          <div className="flex items-center space-x-2">
            <Globe className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-900 dark:text-blue-100">Countries</span>
          </div>
          <div className="text-xs text-blue-700 dark:text-blue-300 mt-1">
            {countriesLoading ? 'Loading...' : `${countries.length} loaded`}
          </div>
        </div>
        
        <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded border border-green-200 dark:border-green-800">
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-900 dark:text-green-100">States</span>
          </div>
          <div className="text-xs text-green-700 dark:text-green-300 mt-1">
            {statesLoading ? 'Loading...' : `${states.length} loaded`}
          </div>
        </div>
        
        <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded border border-purple-200 dark:border-purple-800">
          <div className="flex items-center space-x-2">
            <Building2 className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-900 dark:text-purple-100">Cities</span>
          </div>
          <div className="text-xs text-purple-700 dark:text-purple-300 mt-1">
            {citiesLoading ? 'Loading...' : `${cities.length} loaded`}
          </div>
        </div>
      </div>

      {/* Error Display */}
      {(countriesError || statesError || citiesError) && (
        <div className="mb-6 space-y-2">
          {countriesError && (
            <div className="text-red-600 dark:text-red-400 p-3 bg-red-50 dark:bg-red-900/20 rounded border border-red-200 dark:border-red-800">
              <strong>Countries Error:</strong> {countriesError}
            </div>
          )}
          {statesError && (
            <div className="text-red-600 dark:text-red-400 p-3 bg-red-50 dark:bg-red-900/20 rounded border border-red-200 dark:border-red-800">
              <strong>States Error:</strong> {statesError}
            </div>
          )}
          {citiesError && (
            <div className="text-red-600 dark:text-red-400 p-3 bg-red-50 dark:bg-red-900/20 rounded border border-red-200 dark:border-red-800">
              <strong>Cities Error:</strong> {citiesError}
            </div>
          )}
        </div>
      )}

      {/* Cascading Dropdowns */}
      <div className="space-y-4">
        {/* Country Dropdown */}
        <div className="space-y-2">
          <Label htmlFor="country">Country</Label>
          <Select
            id="country"
            value={selectedCountry}
            onChange={(e) => handleCountryChange(e.target.value)}
            disabled={countriesLoading}
            className={countriesError ? 'border-red-500' : ''}
          >
            <option value="">
              {countriesLoading ? 'Loading countries...' : 'Select Country'}
            </option>
            {countries.map((country) => (
              <option key={country.countryid} value={country.countryid}>
                {country.countryname}
              </option>
            ))}
          </Select>
        </div>

        {/* State Dropdown */}
        <div className="space-y-2">
          <Label htmlFor="state">State</Label>
          <Select
            id="state"
            value={selectedState}
            onChange={(e) => handleStateChange(e.target.value)}
            disabled={!selectedCountry || statesLoading}
            className={statesError ? 'border-red-500' : ''}
          >
            <option value="">
              {!selectedCountry ? 'Select Country First' : 
               statesLoading ? 'Loading states...' : 'Select State'}
            </option>
            {states.map((state) => (
              <option key={state.stateid} value={state.stateid}>
                {state.statename}
              </option>
            ))}
          </Select>
        </div>

        {/* City Dropdown */}
        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Select
            id="city"
            value={selectedCity}
            onChange={(e) => handleCityChange(e.target.value)}
            disabled={!selectedState || citiesLoading}
            className={citiesError ? 'border-red-500' : ''}
          >
            <option value="">
              {!selectedState ? 'Select State First' : 
               citiesLoading ? 'Loading cities...' : 'Select City'}
            </option>
            {cities.map((city) => (
              <option key={city.cityid} value={city.cityid}>
                {city.cityname}
              </option>
            ))}
          </Select>
        </div>
      </div>

      {/* Selection Display */}
      {(selectedCountry || selectedState || selectedCity) && (
        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
          <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Current Selection:</h4>
          <div className="space-y-2 text-sm">
            {selectedCountry && (
              <div className="flex items-center space-x-2">
                <Globe className="w-4 h-4 text-blue-600" />
                <span className="text-gray-700 dark:text-gray-300">
                  Country: {countries.find(c => c.countryid === parseInt(selectedCountry))?.countryname}
                </span>
              </div>
            )}
            {selectedState && (
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-green-600" />
                <span className="text-gray-700 dark:text-gray-300">
                  State: {states.find(s => s.stateid === parseInt(selectedState))?.statename}
                </span>
              </div>
            )}
            {selectedCity && (
              <div className="flex items-center space-x-2">
                <Building2 className="w-4 h-4 text-purple-600" />
                <span className="text-gray-700 dark:text-gray-300">
                  City: {cities.find(c => c.cityid === parseInt(selectedCity))?.cityname}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* API Response Debug */}
      <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
        <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">API Response Debug:</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div>
            <strong>Countries:</strong>
            <pre className="mt-1 bg-white dark:bg-gray-900 p-2 rounded overflow-auto max-h-32">
              {JSON.stringify(countries.slice(0, 3), null, 2)}
            </pre>
          </div>
          <div>
            <strong>States:</strong>
            <pre className="mt-1 bg-white dark:bg-gray-900 p-2 rounded overflow-auto max-h-32">
              {JSON.stringify(states.slice(0, 3), null, 2)}
            </pre>
          </div>
          <div>
            <strong>Cities:</strong>
            <pre className="mt-1 bg-white dark:bg-gray-900 p-2 rounded overflow-auto max-h-32">
              {JSON.stringify(cities.slice(0, 3), null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CascadingDropdownsTest;
