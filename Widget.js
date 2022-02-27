///////////////////////////////////////////////////////////////////////////
// Copyright © Esri. All Rights Reserved.
//
// Licensed under the Apache License Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
///////////////////////////////////////////////////////////////////////////
define([
  'dojo/_base/declare',
  'jimu/BaseWidget',
  'jimu/utils',
  'esri/layers/FeatureLayer',
  'esri/tasks/FeatureSet',
  'esri/symbols/TextSymbol',
  'esri/layers/LabelClass',
  'esri/Color'
],  
function(declare, BaseWidget, utils, FeatureLayer, FeatureSet, TextSymbol, LabelClass, Color) {
  //To create a widget, you need to derive from BaseWidget.
  return declare([BaseWidget], {
    // DemoWidget code goes here
   
    //please note that this property is be set by the framework when widget is loaded.
    //templateString: template,

    baseClass: 'jimu-widget-labellayer',

    postCreate: function() {
      this.inherited(arguments);
      console.log('postCreate');
    },

    startup: function() {
      this.inherited(arguments);
      console.log('startup');
      utils.loadStyleLink('calcite-link', 'https://js.arcgis.com/calcite-components/1.0.0-beta.77/calcite.css')
    },

    onOpen: function(){
      console.log('onOpen');
      
      // create a text symbol to define the style of labels
      let labelColor = new Color("#666")
      let labelSymbol = new TextSymbol().setColor(labelColor)
      labelSymbol.font.setSize("14pt")
      labelSymbol.font.setFamily("arial")

      //this is the very least of what should be set within the JSON  
      let json = {
        "labelExpressionInfo": {"value": "{Navn}"},
        "labelPlacement":"above-right"
      }

      let labelClass = new LabelClass(json)
      labelClass.symbol = labelSymbol

      let layerIds = this.map.graphicsLayerIds
      let layer = this.map.getLayer(layerIds[1])
      
      let layerDef = {
        "objectIdField": layer.objectIdField,
        "geometryType": layer.geometryType,
        "fields": [{
          "name": "FID",
          "type": "esriFieldTypeOID",
          "alias": "FID"
        },
        {
          "name": "Shape_leng",
          "type": "esriFieldTypeDouble",
          "alias": "Omkrets"
        },
        {
          "name": "Shape_Area",
          "type": "esriFieldTypeDouble",
          "alias": "Areal"
        },
        {
          "name": "Navn",
          "type": "esriFieldTypeString",
          "alias": "Navn"
        }]
      } 

      let features = []
      layer.graphics.forEach(g => {
        features.push({
          geometry: {
            rings: g.geometry.rings,
            spatialReference: {wkid: g.geometry.spatialReference.wkid}
          },
          attributes: g.attributes
        })
      })

      let featureCollection = {
        "layerDefinition": layerDef,
        "featureSet": {
          "features": features,
          "geometryType": layer.geometryType
        }
      }

      let featureLayer = new FeatureLayer(featureCollection, {
        showLabels: true
      });

      featureLayer.setLabelingInfo([ labelClass ])
      
      this.map.addLayer(featureLayer)
    },

    onClose: function(){
      console.log('onClose');
    },

    onMinimize: function(){
      console.log('onMinimize');
    },

    onMaximize: function(){
      console.log('onMaximize');
    },

    onSignIn: function(credential){
      /* jshint unused:false*/
      console.log('onSignIn');
    },

    onSignOut: function(){
      console.log('onSignOut');
    },

    showVertexCount: function(count){
      this.vertexCount.innerHTML = 'The vertex count is: ' + count;
    }
  });
});