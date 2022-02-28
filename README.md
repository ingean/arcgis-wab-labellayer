# arcgis-wab-labellayer
ArcGIS Web AppBuilder Widget for labeling added layers

#### Install
Copy arcgis-wab-labellayer folder to 
%WebAppBuilder_Install%/client/stemapp/widgets

## Development
The widget can be developed further or bugs may be fixed. Follow instructions to set up a development environment.

#### Install ArcGIS Web AppBuilder Developer
- Download ArcGIS Web AppBuilder 2.23 or newer
- Unzip to preferred location on disk

#### Install widget
Copy arcgis-wab-labellayer folder to 
%WebAppBuilder_Install%/client/stemapp/widgets/CustomWidgets

#### Development (Windows)
- Start Node.js by running startup.bat from the installed folder

#### Development (macOS)
- Open terminal
- Navigate to /server folder of the ArcGIS Web AppBuilder installation
- Start node by typing
```
node server.js
```

#### Debug
Start ArcGIS Web AppBuilder with the following url:
```
http://localhost:3344/webappbuilder/stemapp/?config=widgets/CustomWidgets/arcgis-wab-labellayer/_test/config-labellayer.json
```
This opens ArcGIS Web AppBuilder with the widgets needed to develop and test LabelLayer further.