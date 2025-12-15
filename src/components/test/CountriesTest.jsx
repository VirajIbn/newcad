import React from 'react';
import { useCountries } from '../../hooks/useCountries';
import { Button } from '../ui/button';
import { RefreshCw } from 'lucide-react';

const CountriesTest = () => {
  const { 
    countries, 
    loading, 
    error, 
    fetchActiveCountries 
  } = useCountries();

  return (
    <div className="p-6 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Countries API Test
        </h3>
        <Button
          onClick={fetchActiveCountries}
          disabled={loading}
          variant="outline"
          size="sm"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {loading && (
        <div className="text-blue-600 dark:text-blue-400 mb-4">
          Loading countries...
        </div>
      )}

      {error && (
        <div className="text-red-600 dark:text-red-400 mb-4 p-3 bg-red-50 dark:bg-red-900/20 rounded border border-red-200 dark:border-red-800">
          <strong>Error:</strong> {error}
        </div>
      )}

      {countries.length > 0 && (
        <div className="space-y-2">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Found {countries.length} countries:
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {countries.slice(0, 12).map((country) => (
              <div
                key={country.countryid}
                className="p-3 bg-gray-50 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700"
              >
                <div className="font-medium text-gray-900 dark:text-gray-100">
                  {country.countryname}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Code: {country.countrycodeforeinvoice || country.countrynamealis}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-500">
                  ID: {country.countryid}
                </div>
              </div>
            ))}
          </div>
          {countries.length > 12 && (
            <div className="text-sm text-gray-500 dark:text-gray-500 text-center">
              ... and {countries.length - 12} more countries
            </div>
          )}
        </div>
      )}

      {!loading && !error && countries.length === 0 && (
        <div className="text-gray-500 dark:text-gray-400 text-center py-8">
          No countries found. Click refresh to try again.
        </div>
      )}
    </div>
  );
};

export default CountriesTest;
