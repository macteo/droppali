import {joinRoom, selfId} from 'trystero'

const byId = document.getElementById.bind(document)
const peerInfo = byId('peer-info')
const textarea = byId('textarea')
const sendButton = byId('sendButton')
const pasteButton = byId('pasteButton')
const noPeersCopy = peerInfo.innerText
const config = {appId: 'droppali-82ad3'}
const roomCap = 2

let room
let sendText

// if (location.protocol !== 'https:') {
if (navigator.clipboard == undefined) {
  console.log('Not https')
  pasteButton.style.display = "none"
}

init(window.location.search.substring(1))
document.documentElement.className = 'ready'

// textarea.addEventListener('change', (event) => {
//   sendText(textarea.value)
// });

sendButton.addEventListener('click', (event) => {
  sendText(textarea.value)
});

pasteButton.addEventListener('click', async (event) => {
  if (navigator.clipboard != undefined) {
    const text = await navigator.clipboard.readText();
    sendText(text)
  } else {
    alert('Sorry, this is available only on secure context (https)')
  }
});

async function init(name) {
  const ns = 'room' + name
  let getText

  room = joinRoom(config, ns)
  ;[sendText, getText] = room.makeAction('textchange')

  byId('room-num').innerText = 'room #' + name
  room.onPeerJoin(updatePeerInfo)
  room.onPeerLeave(updatePeerInfo)
  getText(textchange)
}

function textchange(text, id) {
  console.log(text)
  textarea.value = text
}

function updatePeerInfo() {
  const count = room.getPeers().length
  peerInfo.innerHTML = count
    ? `Right now <em>${count}</em> other peer${
        count === 1 ? ' is' : 's are'
      } connected with you. Send them some fruit.`
    : noPeersCopy
}
