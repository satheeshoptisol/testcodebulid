export function runBlock ($log, $rootScope, $auth, $state) {
  'ngInject';
  $log.debug('runBlock end');

 var unregister = $rootScope.$on('$stateChangeStart',
  function (event, toState) {
    var requiredLogin = false;

    if (toState.data && toState.data.requiredLogin) 
      requiredLogin = true;

    // if yes and if this user is not logged in, redirect him to login page
    if (requiredLogin && !$auth.isAuthenticated()) {
        event.preventDefault();
        $state.go('login');
      }

    if (!requiredLogin && $auth.isAuthenticated() && toState.data.redirect) {
      $state.go('admin-dashboard');
    }
  });
 
}
