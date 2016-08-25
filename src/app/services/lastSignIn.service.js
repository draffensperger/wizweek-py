(function() {
  'use strict';

  angular
  .module('wizweekPy')
  .service('lastSignIn', lastSignIn);

  /** @ngInject */
  function lastSignIn($window) {
    var service = {
      isLikelyActive: isLikelyActive,
      signedIn: signedIn,
      signedOut: signedOut
    }
    return service;

    function signedIn(expiresAt) {
      // Because Google saves logins over time (and refreshes them), just assume
      // for now that if we get a sign in, just ignore the expiresAt parameter.
      // We may as well store it anyway but it's only used for its truthy value.
      $window.localStorage.signedInBefore = expiresAt;
    }

    function signedOut() {
      $window.localStorage.signedInBefore = 0;
    }

    function isLikelyActive() {
      // Coerce the truthy/falsey value of signedInBefore to actual true/false
      var result =  $window.localStorage.signedInBefore ? true : false;
      console.log(result);
      return result;
    }
  }
})();
