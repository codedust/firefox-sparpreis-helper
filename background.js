function onExecuted(result) {
  console.log(`We executed in all subframes`);
}

function onError(error) {
  console.log(`Error: ${error}`);
}

browser.tabs.onUpdated.addListener(function(e){
  var executing = browser.tabs.executeScript(e.tabId, {
    file: "/content-script.js",
  });
  executing.then(onExecuted, onError);
});
