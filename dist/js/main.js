var wpAd = wpAd || {};
wpAd.Adscape = (function($){

  'use strict';

  // jQuery safety check
  if(!$){
    return function(){
      if(window.console){
        window.console.log('$ is undefined');
      }
    };
  }

  var defaults = {
    imageURL: '',
    clickTrack: '',
    clickTag: '',
    timeOpen: 4000,
    auto: false,
    autoExpDelay: 1000,
    impressionPixels: [],
    trackExpClick: [],
    trackCloseClick: [],
    pageContainer: '#shell',
    adscapeContainer: '#slug_pushdown',
    expHeight: '468px',
    colHeight: '60px',
    bodyBgColor: '#ffffff',
    collapsedMessageHTML: '',
    collapsedMessageCSS: {},
    expandedMessageHTML: '',
    expandedMessageCSS: {},
    closeButtonCSSOverrides: {},
    expandButtonCSSOverrides: {},
    skinTopMargin: '30px',
    pageStyleOverrides: {},
    fullWidthColAdscape: true,
    animSpeed: 500,
    expandLanguage: 'Click to Expand',
    closeLanguage: 'Close [x]'
  };

  function Adscape(config){
    this.configure(config).setPageElements();
    this.cssTransitions = $('html').hasClass('wpad-csstransitions');
    this.init();

    return this;
  }

  Adscape.prototype = {
    configure: function(config){
      var currentConfig = this.config || defaults;
      this.config = $.extend(true, currentConfig, config);
      return this;
    },
    setPageElements: function(){
      this.$pageContainer = $(this.config.pageContainer);
      //this.$adscapeContainer = $(this.config.adscapeContainer).empty().addClass('ad-adscape-wrap');
      this.$adscapeContainer = $('<div class="ad-adscape-wrap"></div>');
      $(this.config.adscapeContainer).css({display: 'none'}).after(this.$adscapeContainer);
      this.$adscapeInner = $('<a class="ad-adscape" href="' + this.config.clickTrack + this.config.clickTag + '" target="_blank"></a>').appendTo(this.$adscapeContainer);
      return this;
    },
    init: function(){
      var root = this;

      this.clean().stylePageContainer().addSkin().styleAdscapeInner().addMessaging().addCloseExpButtons();

      if(this.config.fullWidthColAdscape){
        this.stylefullWidthColAdscapeContainer();
      }
      if(this.config.auto){
        this.autoExpTimer = setTimeout(function(){
          root.expand(false);
          root.setCloseTimer();
        }, root.config.autoExpDelay);
      } else {
        this.$expandButton.show(0);
      }

      var l = this.config.impressionPixels.length;
      if(l){
        while(l--){
          this.addPixel(this.config.impressionPixels[l]);
        }
      }
    },
    expand: function(clicked){
      if(!this.config.fullWidthColAdscape){
        this.stylefullWidthColAdscapeContainer();
      }

      var root = this;
      var callback = function(){
        root.$adscapeContainer.removeClass('collapsed expanded');
        root.$adscapeContainer.addClass('expanded');
      };

      if(this.cssTransitions){
        if(!this.$adscapeInner.hasClass('ad-transition-height')){
          this.$adscapeInner.addClass('ad-transition-height');
        }

        this.$adscapeInner.css({
          height: this.config.expHeight
        });

        //setTimeout(callback, this.config.animSpeed);

        callback();

      } else {
        this.$adscapeInner.stop(true,true).animate({
          height: this.config.expHeight
        }, this.config.animSpeed, callback);
      }

      var l = this.config.trackExpClick.length;
      if(l && clicked){
        while(l--){
          this.addPixel(this.config.trackExpClick[l]);
        }
      }

    },
    clean: function(){
      this.styleDefaultAdscapeContainer();
      this.$adscapeInner.empty();
      return this;
    },
    addSkin: function(){
      $('body').css({
        background: this.config.bodyBgColor + ' url(' + this.config.imageURL + ') no-repeat center top fixed'
      }).prepend(this.getSkinClickArea());

      return this;
    },
    getSkinClickArea: function(){
      return $('<a class="ad-skin-click-area" href="' + this.config.clickTrack + this.config.clickTag + '" target="_blank"></a>').css({
        height: this.config.skinTopMargin
      });
    },
    stylePageContainer: function(){
      this.$pageContainer.css(this.config.pageStyleOverrides);
      return this;
    },
    styleDefaultAdscapeContainer: function(){
      this.$adscapeContainer.css({
        width: '',
        marginLeft: ''
      });
      return this;
    },
    stylefullWidthColAdscapeContainer: function(){
      var pageWidth = this.$pageContainer.outerWidth();
      var offsetLeft = (pageWidth - this.$adscapeContainer.outerWidth()) / 2;

      this.$adscapeContainer.css({
        width: pageWidth + 'px',
        marginLeft: (0 - offsetLeft) + 'px'
      });

      return this;
    },
    styleAdscapeInner: function(){
      this.$adscapeInner.css({
        height: this.config.colHeight,
        background: this.config.bodyBgColor + ' url(' + this.config.imageURL + ') no-repeat center top fixed'
      });
      return this;
    },
    addMessaging: function(){
      if(this.config.collapsedMessageHTML){
        this.$collapsedMessage = $('<div class="message collapsed">' + this.config.collapsedMessageHTML + '</div>')
          .css(this.config.collapsedMessageCSS)
          .appendTo(this.$adscapeInner);
      }
      if(this.config.expandedMessageHTML){
        this.$expandedMessage = $('<div class="message expanded">' + this.config.expandedMessageHTML + '</div>')
          .css(this.config.expandedMessageCSS)
          .appendTo(this.$adscapeInner);
      }
      return this;
    },
    addCloseExpButtons: function(){
      var root = this;

      this.$closeButton = $('<span class="ad-btn collapse">' + this.config.closeLanguage + '</span>').on('click', function(){
        root.collapse(true);
      }).css(this.config.closeButtonCSSOverrides);

      this.$expandButton = $('<span class="ad-btn expand">' + this.config.expandLanguage + '</span>').on('click', function(){
        root.expand(true);
      }).css(this.config.expandButtonCSSOverrides);

      this.$adscapeContainer.append(this.$closeButton).append(this.$expandButton);
      return this;
    },
    setCloseTimer: function(){
      var root = this;
      this.closeTimer = setTimeout(function(){
        root.collapse(false);
      }, this.config.timeOpen);
    },
    collapse: function(clicked){
      var root = this;

      var callback = function(){
        if(!root.config.fullWidthColAdscape){
          root.styleDefaultAdscapeContainer();
        }

        root.$adscapeContainer.removeClass('collapsed expanded');
        root.$adscapeContainer.addClass('collapsed');
      };

      clearTimeout(this.closeTimer);

      if(this.cssTransitions){
        this.$adscapeInner.css({
          height: this.config.colHeight
        });

        setTimeout(callback, this.config.animSpeed);

      } else {
        this.$adscapeInner.stop(true, true).animate({
          height: this.config.colHeight
        }, this.config.animSpeed, callback);
      }

      var l = this.config.trackCloseClick.length;
      if(l && clicked){
        while(l--){
          this.addPixel(this.config.trackCloseClick[l]);
        }
      }
    },
    addPixel: function(src){
      $('<img />').attr({
        src: src.replace(/\[timestamp\]|%n|\[ord\]|\[random\]/i, Math.floor(Math.random() * 1E7)),
        width: '1',
        height: '1',
        alt: 'pixel'
      }).css({
        border: '0',
        display: 'none'
      }).appendTo(this.$adscapeContainer);
    }
  };

  return Adscape;

})(window.jQuery);
