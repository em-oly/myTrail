# Name: Ansen D. Garvin
# OSU Email: garvina@oregonstate.edu
# Course: CS325 - Analysis of Algorithms
# Release date: 2/23/2022
# Patch: 1.0.0
# Description: A weather microservice which returns a weather report from a zip code.
# Sources: This program uses two external APIs. See readme.txt for more information.
import requests
import json


def get_gps_from_zip(zip_code):
    """
    Gets a latitude and longitude from a zip code.
    This gets its information from the following API: https://www.zippopotam.us/
    """
    zippopotamus_link = 'https://api.zippopotam.us/us/' + zip_code

    request = requests.get(zippopotamus_link)

    if request.status_code == 404:
        print("Zippoputamus returned 404. Invalid zip code.")
        return 404

    print("Valid zip code")

    request_json = request.json()

    latitude = request_json['places'][0]['latitude']
    longitude = request_json['places'][0]['longitude']

    latlong = (latitude, longitude)

    return latlong


def get_weather_report_from_gps(latlong):
    """
    Gets a weather report from an input latitude and longitude tuple
    Gets its information for the US Weather Service: https://www.weather.gov/documentation/services-web-api
    """
    grid_api_link = 'https://api.weather.gov/points/' + latlong[0] + ',' + latlong[1]

    grid_request = requests.get(grid_api_link).json()

    forecast_api_link = grid_request["properties"]["forecast"]

    print(forecast_api_link)

    forecast_request = requests.get(forecast_api_link)

    forecast_request_json = forecast_request.json()

    detailed_forecast_afternoon = forecast_request_json["properties"]["periods"][0]["detailedForecast"]
    detailed_forecast_evening = forecast_request_json["properties"]["periods"][1]["detailedForecast"]

    combined_forecasts = "Forecast for the next 24 hours: " + detailed_forecast_afternoon + " Later: " + detailed_forecast_evening

    return combined_forecasts


if __name__ == '__main__':
    while True:
        f = open('request.txt')
        lines = f.readlines()
        f.close()

        if len(lines) > 0:
            f = open('request.txt', 'w')
            f.write("")
            f.close

            if not lines[0].isnumeric():
                print("ERROR: Invalid zip code")
                f = open('response.txt', 'w')
                f.write("ERROR: Invalid zip code")
                f.close()

            else:
                zip_num = lines[0]
                print("Received request:", zip_num)
                latlong = get_gps_from_zip(zip_num)

                if latlong == 404:
                    print("ERROR: Zip code could not be found in Zip to GPS API")
                    f = open('response.txt', 'w')
                    f.write("ERROR: Zip code could not be found in Zip to GPS API")
                    f.close()

                else:
                    weather = get_weather_report_from_gps(latlong)
                    print("Writing the following weather report:", weather)
                    f = open('response.txt', 'w')
                    f.write(weather)
                    f.close()
