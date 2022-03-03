define([
  'dojo/_base/declare',
  'dojo/_base/lang'
  ], 
  function(declare, lang) {
    return declare(null, {

      container: null,

      constructor: function(container = 'widget-notifications') {
        this.container = container
      },

      notify: function(title, message, level = 'error') {
        let notificationContainer = document.querySelector(`#${this.container}`)
        notificationContainer.innerHTML = ''
        
        let notification = document.createElement('div')
        notification.classList.add('widget-notification')
        notification.classList.add(`widget-notification-${level}`)


        let header = document.createElement('div')
        header.classList.add('widget-notification-header')
      
        let titleText = document.createElement('div')
        titleText.classList.add('widget-notification-title')
        titleText.innerText = title
        
        let x = document.createElement('div')
        x.classList.add('widget-notification-close')
        x.innerText = 'x'

        header.append(titleText)
        header.append(x)

        let body = document.createElement('div')
        body.classList.add('widget-notification-body')
        body.innerText = message

        notification.append(header)
        notification.append(body)
        notificationContainer.append(notification)
        
        document.querySelector('.widget-notification-close')
        .addEventListener('click', lang.hitch(this, this.close))
      },

      close: function() {
        let notificationContainer = document.querySelector(`#${this.container}`)
        notificationContainer.innerHTML = ''
      }
    })
});