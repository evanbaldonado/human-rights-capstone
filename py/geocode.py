import requests
from urllib.parse import quote
import json

def getCoordinates(place):
    # TODO: worldview=cn
    # https://docs.mapbox.com/api/search/geocoding/
    coordinates = json.loads(requests.get("https://api.mapbox.com/geocoding/v5/mapbox.places/" + quote(place) + ".json?access_token=pk.eyJ1IjoiZXZhbmJhbGRvbmFkbyIsImEiOiJjbGdlb21rem4wMmtuM2VxcGtocXIzYnY3In0.F1nd5mHblgPhYbTV1mD9-A&limit=1").content)["features"][0]["center"]
    return(coordinates)

# Modified from https://www.geeksforgeeks.org/update-column-value-of-csv-in-python/#

# Importing the pandas library
import pandas as pd

# reading the csv file
df = pd.read_csv("../data/union-data-6-9-23.csv")

result = [getCoordinates(place) for place in df['School']]

# updating the column value/data
for i in range(len(df.index)):
    print(df.loc[i, 'School'])
    df.loc[i, 'Latitude'] = result[i][1]
    df.loc[i, 'Longitude'] = result[i][0]

# writing into the file
df.to_csv("../data/union-data-6-12-23.csv", index=False)
