# arcgis-wab-labellayer
ArcGIS Web AppBuilder Widget for labeling added layers

#### Install widget
- Copy LabelLayer folder to
  > %WebAppBuilder%/client/stemapp/widgets

## Development
The widget can be developed further or bugs may be fixed. Follow instructions to set up a development environment.

#### Install ArcGIS Web AppBuilder Developer
- Download ArcGIS Web AppBuilder 2.23 or newer
- Unzip to preferred location on disk

#### Install widget in develoment environment
- Create a new folder "CustomWidgets" at
  > %WebAppBuilder_Install%/client/stemapp/widgets/CustomWidgets
- Copy arcgis-wab-labellayer into "CustomWidgets" folder
- Start Node.js
  - On Windows: 
    - Run startup.bat
      > %WebAppBuilder%/startup.bat
  - On macOS or others:
    - Open terminal
    - Navigate to the server folder of the ArcGIS Web AppBuilder installation
      > %WebAppBuilder%/server folder 
    - Start node by typing
      ```
      node server.js
      ```

#### Debugging
- Start ArcGIS Web AppBuilder with the following url to access the widgets needed to develop and test:
  ```
  http://localhost:3344/webappbuilder/stemapp/?config=widgets/CustomWidgets/arcgis-wab-labellayer/app_configs/config-labellayer.json
  ```