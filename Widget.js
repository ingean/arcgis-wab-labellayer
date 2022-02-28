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
  'dojo/_base/lang',
  'jimu/BaseWidget',
  'jimu/utils',
  'esri/layers/FeatureLayer',
  'esri/tasks/FeatureSet',
  'esri/symbols/TextSymbol',
  'esri/layers/LabelClass',
  'esri/Color'
],  
function(declare, lang, BaseWidget, utils, FeatureLayer, FeatureSet, TextSymbol, LabelClass, Color) {
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
      
      let labelBtn = document.querySelector('#label-btn')
      labelLayerHandler = labelBtn.addEventListener('click', lang.hitch(this,this._labelLayer))
      
      let layerList = document.querySelector('#label-layer-list')
      layerListHandler = layerList.addEventListener('change', lang.hitch(this, this._populateFieldsList));
    },

    onOpen: function() {
      console.log('onOpen');
      lang.hitch(this, this._populateLayerList())
      let selectEl = document.querySelector('#label-layer-list') // Trigger change event
      selectEl.dispatchEvent(new Event('change'))
    },

    onClose: function() {
      console.log('onClose');
      let layerList = document.querySelector('#label-layer-list')
      layerList.innerHTML = ''

      let fieldsList = document.querySelector('#label-field-list')
      fieldsList.innerHTML = ''
    },

    _populateLayerList: function() {
      let layerList = document.querySelector('#label-layer-list')

      let layerIds = this.map.graphicsLayerIds
      layerIds.forEach(id => {
        let layer = this.map.getLayer(id)
        if (layer.arcgisProps) {
          layerList.append(
            this._createElement(
              `<option value="${id}">${layer.arcgisProps.title}</option>`
            )  
          )
        }
      })
    },

    _populateFieldsList: function() {
      let fieldsList = document.querySelector('#label-field-list')
      fieldsList.innerHTML = ''

      let layer = this._getSelectedLayer()
      let fields = layer._fields
      fields.forEach(field => {
        fieldsList.append(
          this._createElement(
            `<option value="${field.name}">${field.alias}</option>`
          )
        )
      })
    },

    _getSelectedLayer: function() {
      let selectEl = document.querySelector('#label-layer-list')
      let layerId = selectEl.value
      return this.map.getLayer(layerId) 
    },

    _createElement: function(htmlString) {
      let div = document.createElement('div')
      div.innerHTML = htmlString.trim()
      return div.firstChild;
    },

    _labelLayer: function() {
      let layerId = document.querySelector('#label-layer-list').value
      let layerIds = this.map.graphicsLayerIds
      let layer =  null
      
      layerIds.forEach(id => {
        if (id === layerId) layer = this.map.getLayer(id)
      })

      if (!layer instanceof FeatureLayer) {
        this.map.removeLayer(layer)
        layer = this._convertToFeatureLayer(layer)
        this.map.addLayer(layer)
      }
      
      let labelClass = this._createLabelClass()
      layer.setLabelingInfo([ labelClass ])
      layer.showLabels = true
    },

    _createLabelClass: function() {
      let textFont = document.querySelector('#label-font-list').value
      let textSize = document.querySelector('#label-font-size').value
      let textColor = document.querySelector('#label-color').value
      let labelField = document.querySelector('#label-field-list').value
      
      let reg=/^#([0-9a-f]{3}){1,2}$/i; // Test for hexadecimal color
      textColor = (reg.test(textColor)) ? textColor : '#666'

      let labelColor = new Color(textColor)
      let labelSymbol = new TextSymbol().setColor(labelColor)
      labelSymbol.font.setSize(`${textSize}pt`)
      labelSymbol.font.setFamily(textFont.toLowerCase())

      let json = {
        "labelExpressionInfo": {"value": `{${labelField}}`},
        "labelPlacement":"above-right"
      }

      let labelClass = new LabelClass(json)
      labelClass.symbol = labelSymbol
      return labelClass
    },

    _convertToFeatureLayer: function(layer) {
      
      let layerDef = {
        "objectIdField": layer.objectIdField,
        "geometryType": layer.geometryType,
        "fields": layer._fields
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

      return new FeatureLayer(featureCollection, {})
    }
  });
});