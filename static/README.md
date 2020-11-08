These are the administrative regions of North Korea.
| admin_level | Definition |
| ------------- | ---------- |
| 2 | country |
| 4 | province |
| 6 | county |
| 7 | pyongyang regions |

Run this overpass query for North Korean counties, pyongyang inner regions, the special administrative region of kaesong and the Rason area.
```
[out:json][timeout:25];
{{geocodeArea:"North Korea"}}->.searchArea;
(
  relation
  	["type"="boundary"]
  	["boundary"="administrative"]
  	["admin_level"="4"]
  	["name:en"="Kaesong"]
  	(area.searchArea);
  relation
  	["type"="boundary"]
  	["boundary"="administrative"]
  	["admin_level"="4"]
  	["name:en"="Rason"]
  	(area.searchArea);
  relation
  	["type"="boundary"]
  	["boundary"="administrative"]
  	["admin_level"="6"]
  	(area.searchArea);
  relation
  	["type"="boundary"]
  	["boundary"="administrative"]
  	["admin_level"="7"]
  	(area.searchArea);
);
out body;
(._;>;);
out skel qt;
```

Install the mapshaper npm package and run this command in the folder of the geojson. The first parameter, `nk_regions.geojson`, is the name of the input file, so make sure the name is correct.
```
mapshaper nk_regions.geojson -simplify dp keep-shapes 20% -o format=geojson
```

This will generate three files. One with all the ways, another with some linestrings, maybe incorrect data? And a third with admin_centre points. We only need the first (also largest) file.

You can test the quality of the geojson here: https://geojson.io