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
  'jimu/LayerStructure',
  'jimu/LayerNode',
  'esri/layers/FeatureLayer',
  'esri/tasks/FeatureSet',
  'esri/symbols/TextSymbol',
  'esri/symbols/Font',
  'esri/layers/LabelClass',
  'esri/Color',
  './libs/colorize-main/colorize',
  './libs/widget-notifications/notifications'
],  
function(declare, lang, BaseWidget, utils, LayerStructure, LayerNode, FeatureLayer, FeatureSet, TextSymbol, Font, LabelClass, Color, Gn8Colorize, WidgetNotifications) {
  //To create a widget, you need to derive from BaseWidget.
  return declare([BaseWidget], {
    
    baseClass: 'jimu-widget-labellayer',
    layerStructure: LayerStructure.getInstance(),
    pointLabelPlacement: ["above-center", "above-left", "above-right", "below-center", "below-left", "below-right", "center-center", "center-left", "center-right"],
    lineLabelPlacement: ["above-after", "above-along", "above-before", "above-start", "above-end", "below-after", "below-along", "below-before", "below-start", "below-end", "center-after", "center-along", "center-before", "center-start", "center-end"],
    notification: new WidgetNotifications(),

    postCreate: function() {
      this.inherited(arguments);
    },

    startup: function() {
      this.inherited(arguments);

      let folderUrl = this.folderUrl
      if (folderUrl.includes('webappbuilder/stemapp')) {
        folderUrl = folderUrl.substr(folderUrl.indexOf('widgets'))
      }
      
      utils.loadStyleLink('CSSColorPicker', folderUrl + 'libs/colorize-main/style.css')
      utils.loadStyleLink('WidgetNotifications', folderUrl + 'libs/widget-notifications/style.css')
      
      document.querySelector('#label-btn')
      .addEventListener('click', lang.hitch(this,this._labelLayer))
      
      document.querySelector('#label-layer-list')
      .addEventListener('change', lang.hitch(this, this._updateFieldsAndPlacementOptions))

      document.querySelector('#label-color-preview')
      .addEventListener('click', lang.hitch(this, this._initColorPicker))

      document.querySelector('#label-color')
      .addEventListener('change', lang.hitch(this, this._updateLabelColorPreview))

      document.querySelector('#label-halo-color-preview')
      .addEventListener('click', lang.hitch(this, this._initHaloColorPicker))

      document.querySelector('#label-halo-color')
      .addEventListener('change', lang.hitch(this, this._updateHaloColorPreview))
    },

    onOpen: function() {
      document.querySelector('#widget-notifications').innerHTML = '' // Delete old notifications
      document.querySelector('#label-btn').disabled = false;
      lang.hitch(this, this._updateLayerOptions())    
      },

    onClose: function() {
  
    },

    _updateLayerOptions: function() {
      let layerIds = this.map.graphicsLayerIds
      let layers = []
      
      layerIds.forEach(id => {
        let layer = this.map.getLayer(id)
        if (layer.arcgisProps) {
          layers.push({"value" : id, "caption": layer.arcgisProps.title})
        }
      })

      if (layers.length > 0) {
        this._updateSelectOptions('label-layer-list', layers)
        this._updateFieldsAndPlacementOptions()
      } else {
        this.notification.notify(
          'Ingen kartlag kan tekstes', 
          'Legg til et kartlag som kan tekstes, f.eks ved hjelp av knappen "Legg til data"', 
          'info'
        )
        document.querySelector('#label-btn').disabled = true;
      }
    },

    _updateFieldsAndPlacementOptions: function() {
      let layer = this._getSelectedLayer()
      let fields = layer._fields

      this._updateSelectOptions('label-field-list', fields, 'name', 'alias')
      this._updatePlacementOptions(layer)
    },

    _updatePlacementOptions(layer) {
      let placements = []
      if (layer.geometryType === 'esriGeometryPoint') {
        document.querySelector('#label-placement-container').style.display = 'block'
        placements = this.pointLabelPlacement
      } else if (layer.geometryType === 'esriGeometryPolyline') {
        document.querySelector('#label-placement-container').style.display = 'block'
        placements = this.lineLabelPlacement
      } else {
        document.querySelector('#label-placement-container').style.display = 'none'
      }
      placements = placements.map(p => ({"value": p, "caption": p}))
      this._updateSelectOptions('label-placement-list', placements)
    },

    _updateSelectOptions(id, options, valueKey = 'value', captionKey = 'caption') {
      let selectNode = document.querySelector(`#${id}`)
      selectNode.innerHTML = ''

      options.forEach(option => {
        selectNode.append(
          this._createElement(
            `<option value="${option[valueKey]}">${option[captionKey]}</option>`
          )
        )
      })
    },

    _initColorPicker: function() {
      
      let data = {
        "id" : null,
        "container" : document.querySelector('#colorizer'),
        "value" : document.querySelector('#label-color').value
      }
      let colorizer = new Gn8Colorize(data);
      colorizer.init().then( 
        success => {
          document.querySelector('#label-color').value = success.hex
          document.querySelector('#label-color-preview').style.backgroundColor = success.hex
          console.log( success );
        }, error => {
          console.log( error );
        } 
      )
    },

    _initHaloColorPicker: function() {
      
      let data = {
        "id" : null,
        "container" : document.querySelector('#colorizer'),
        "value" : document.querySelector('#label-halo-color').value
      }
      let colorizer = new Gn8Colorize(data);
      colorizer.init().then( 
        success => {
          document.querySelector('#label-halo-color').value = success.hex
          document.querySelector('#label-halo-color-preview').style.backgroundColor = success.hex
          console.log( success );
        }, error => {
          console.log( error );
        } 
      )
    },

    _updateLabelColorPreview: function() {
      this._updateColorPreview('label-color')
    },

    _updateHaloColorPreview: function() {
      this._updateColorPreview('label-halo-color')
    },

    _updateColorPreview: function(id) {
      let textColor = document.querySelector(`#${id}`).value
      let reg=/^#([0-9a-f]{3}){1,2}$/i; // Test for hexadecimal color
      if (reg.test(textColor)) {
        document.querySelector(`#${id}-preview`).style.backgroundColor = textColor
      }
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
      let layer =  this._getSelectedLayer()
      let layerNode = this.layerStructure.getNodeById(layer.id)

      if (!layer instanceof FeatureLayer) {
        try {
          let featureLayer = this._convertToFeatureLayer(layer)
          this.map.removeLayer(layer)
          this.map.addLayer(layer)
          layer = featureLayer
        } catch(e) {
          this.notification.notify('Teksting feilet', 'Klarte ikke å konvertere grafikklag til kartobjektlag (FeatureLayer)')
        }
      }
      
      let labelClass = this._createLabelClass()
      layer.setLabelingInfo([ labelClass ])
      layerNode.showLabel()  
    },

    _createLabelClass: function() {
      let labelPlacement = document.querySelector('#label-placement-list').value ?? 'above-right'
      let textFont = document.querySelector('#label-font-list').value
      let textSize = document.querySelector('#label-font-size').value
      let textColor = document.querySelector('#label-color').value
      let textWeight = document.querySelector('input[name="label-font-weight"]:checked').value ?? 'WEIGHT_NORMAL'
      let labelField = document.querySelector('#label-field-list').value
      let labelHalo = document.querySelector('#label-halo-checkbox').checked
      let labelHaloColor = document.querySelector('#label-halo-color').value
      let labelHaloSize = document.querySelector('#label-halo-size').value
      
      let reg=/^#([0-9a-f]{3}){1,2}$/i; // Test for hexadecimal color
      textColor = (reg.test(textColor)) ? textColor : '#666'

      let fontWeights = {
        normal: Font.WEIGHT_NORMAL,
        bold: Font.WEIGHT_BOLD,
        bolder: Font.WEIGHT_BOLDER,
        lighter: Font.WEIGHT_LIGHTER,
      }

      let labelColor = new Color(textColor)
      let labelSymbol = new TextSymbol().setColor(labelColor)
      labelSymbol.font.setSize(`${textSize}pt`)
      labelSymbol.font.setFamily(textFont.toLowerCase())
      labelSymbol.font.setWeight(fontWeights[textWeight])
      
      if (labelHalo) {
        labelSymbol.setHaloColor(new Color(labelHaloColor))
        labelSymbol.setHaloSize(labelHaloSize)
      }
      
      let json = {
        "labelExpressionInfo": {"value": `{${labelField}}`},
        "labelPlacement": labelPlacement
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
          geometry: g.geometry,
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