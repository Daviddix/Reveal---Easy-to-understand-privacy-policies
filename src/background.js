chrome.runtime.onInstalled.addListener(async ()=>{
    await enableSidePanel()
})

async function enableSidePanel(){
    chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error))
}

chrome.commands.onCommand.addListener((shortcut) => {
  console.log('lets reload');
  console.log(shortcut);
  if(shortcut.includes("+M")) {
      chrome.runtime.reload();
  }
})