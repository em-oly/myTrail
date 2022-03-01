INSTRUCTIONS FOR USE:
1. Install the 'requests' module. You can do this by typing 'pip install requests' in Python.
2. Run weather.py
3. Write a 5-digit zip code into 'request.txt'. This service will erase it once it's been read.
4. Wait for a response.
5. Read weather report from response.txt, and erase once you've stored it.

weather.py runs on an infinite loop, so terminate it once you're done using it.

TROUBLESHOOTING:
Problem: response.txt reads "ERROR: Invalid zip code."
Solution: A non-number was entered into request.txt. You must input a 5-digit number.

Problem: response.txt reads "ERROR: Zip code could not be found in Zip to GPS API"
Solution: Two things could have happened here:
    The ZIP code that was entered was invalid (e.g. it was numeric but was wrong),
    OR
    The zip code was valid, but the external API I use did not have it on record. If this is the case, then this ZIP
    code will never be able to have a weather repiort. I recommend writing something like "Weather not available"


AUTHOR INFORMATION / SOURCES
Microservice created by Ansen Garvin for Software Engineering I

This program uses two external APIs to retrieve a local weather report from a zip code.

Zippopotamus: http://www.zippopotam.us/
Used to retrieve latitude and longitude coordinates from a zip code

US Weather Service: https://www.weather.gov/documentation/services-web-api
Used to retrieve weather data from latitude and longitude