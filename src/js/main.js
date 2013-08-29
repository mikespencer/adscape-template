var wpAd = wpAd || {};
wpAd.SkinWindow = (function($){

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
    trackExpClick: '',
    trackCloseClick: '',
    pageContainer: '#shell',
    pushdownContainer: '#slug_pushdown',
    expHeight: '468px',
    colHeight: '60px',
    bodyBgColor: '#ffffff',
    skinTopMargin: '30px',
    pageStyleOverrides: {},
    fullWidthColPushdown: false,
    animSpeed: 500,
    expandLanguage: 'Click to Expand',
    closeLanguage: 'Close [x]'
  };

  function SkinWindow(config){
    this.configure(config).getPageElements();
    this.cssTransitions = $('html').hasClass('wpad-csstransitions');
    this.init();

    return this;
  }

  SkinWindow.prototype = {
    configure: function(config){
      var currentConfig = this.config || defaults;
      this.config = $.extend(true, currentConfig, config);
      return this;
    },
    getPageElements: function(){
      this.$pageContainer = $(this.config.pageContainer);
      this.$pushdownContainer = $(this.config.pushdownContainer).empty().addClass('ad-skin-window-wrap');
      this.$pushdownInner = $('<a class="ad-skin-window" href="' + this.config.clickTrack + this.config.clickTag + '" target="_blank"></a>').appendTo(this.$pushdownContainer);

      return this;
    },
    init: function(){
      var root = this;

      this.clean().stylePageContainer().addSkin().stylePushdownInner().addCloseExpButtons();

      if(this.config.fullWidthColPushdown){
        this.styleFullWidthPushdownContainer();
      }
      if(this.config.auto){
        this.autoExpTimer = setTimeout(function(){
          root.expand();
          root.setCloseTimer();
        }, root.config.autoExpDelay);
      } else {
        this.$expandButton.show(0);
      }
    },
    expand: function(){
      if(!this.config.fullWidthColPushdown){
        this.styleFullWidthPushdownContainer();
      }

      if(this.cssTransitions){
        if(!this.$pushdownInner.hasClass('ad-transition-height')){
          this.$pushdownInner.addClass('ad-transition-height');
        }

        this.$pushdownInner.css({
          height: this.config.expHeight
        });
      } else {
        this.$pushdownInner.stop(true,true).animate({
          height: this.config.expHeight
        }, this.config.animSpeed);
      }

      this.$expandButton.hide(0);
      this.$closeButton.show(0);
    },
    clean: function(){
      this.styleDefaultPushdownContainer();
      this.$pushdownInner.empty();
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
    styleDefaultPushdownContainer: function(){
      this.$pushdownContainer.css({
        width: '',
        marginLeft: ''
      });
      return this;
    },
    styleFullWidthPushdownContainer: function(){
      var pageWidth = this.$pageContainer.outerWidth();
      var offsetLeft = (pageWidth - this.$pushdownContainer.outerWidth()) / 2;

      this.$pushdownContainer.css({
        width: pageWidth + 'px',
        marginLeft: (0 - offsetLeft) + 'px'
      });

      return this;
    },
    stylePushdownInner: function(){
      this.$pushdownInner.css({
        height: this.config.colHeight,
        background: this.config.bodyBgColor + ' url(' + this.config.imageURL + ') no-repeat center top fixed'
      });
      return this;
    },
    addCloseExpButtons: function(){
      var root = this;

      this.$closeButton = $('<span class="ad-btn">' + this.config.closeLanguage + '</span>').on('click', function(){
        root.collapse();
      });

      this.$expandButton = $('<span class="ad-btn">' + this.config.expandLanguage + '</span>').on('click', function(){
        root.expand();
      });

      this.$pushdownContainer.append(this.$closeButton).append(this.$expandButton);
      return this;
    },
    setCloseTimer: function(){
      var root = this;
      this.closeTimer = setTimeout(function(){
        root.collapse();
      }, this.config.timeOpen);
    },
    collapse: function(){
      var root = this;

      var callback = function(){
        if(!root.config.fullWidthColPushdown){
          root.styleDefaultPushdownContainer();
        }
        root.$closeButton.hide(0);
        root.$expandButton.show(0);
      };

      clearTimeout(this.closeTimer);

      if(this.cssTransitions){
        this.$pushdownInner.css({
          height: this.config.colHeight
        });

        setTimeout(callback, this.config.animSpeed);

      } else {
        this.$pushdownInner.stop().animate({
          height: this.config.colHeight
        }, this.config.animSpeed, callback);
      }
    }
  };

  return SkinWindow;

})(window.jQuery);
