Overpass query to get the boundaries.

| admin_level | Definition |
| ------------- | ---------- |
| 2 | country |
| 4 | province |
| 6 | county |
| 7 | pyongyang regions |

```
[out:json][timeout:25];
{{geocodeArea:"North Korea"}}->.searchArea;
(
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