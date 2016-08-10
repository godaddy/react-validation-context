const appDiv = document.createElement('div');
appDiv.id = 'app';

window.addEventListener('appBundleLoaded', function onAppBundleLoaded(event) {
  event.renderApp(appDiv, function onAppRender() {
    document.body.appendChild(appDiv);
  });

  window.removeEventListener('appBundleLoaded', onAppBundleLoaded);
});

