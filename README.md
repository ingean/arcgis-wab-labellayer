# arcgis-wab-labellayer
ArcGIS Web AppBuilder Widget for labeling added layers

#### Install widget
The widget needs to be hosted on a web server and registered as an item in ArcGIS Enterprise.
- Download code as a zip file
- Expand the zip-file and copy the folder "LabelLayer" as it contains the source files for the widget
- [Follow the instructions to host and register the widget](https://enterprise.arcgis.com/en/web-appbuilder/latest/create-apps/add-custom-widgets.htm)

## Development
The widget can be developed further or bugs may be fixed. Follow instructions to set up a development environment.

#### Install ArcGIS Web AppBuilder Developer
- [Download ArcGIS Web AppBuilder Developer](https://developers.arcgis.com/downloads/#web-appbuilder)
- [Unzip to preferred location on disk](https://developers.arcgis.com/web-appbuilder/guide/getstarted.htm)

#### Install widget in develoment environment
- Create a new folder "CustomWidgets" at
  > %WebAppBuilder_Install%/client/stemapp/widgets/CustomWidgets
- Copy or clone arcgis-wab-labellayer into "CustomWidgets" folder
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
- Start ArcGIS Web AppBuilder with the following url to access the widgets needed to develop and test the widget:
  ```
  http://localhost:3344/webappbuilder/stemapp/?config=widgets/CustomWidgets/arcgis-wab-labellayer/app_configs/config-labellayer.json
  ```