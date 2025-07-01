import {joinRoom, selfId} from 'trystero'
import { saveAs } from 'file-saver';

const byId = document.getElementById.bind(document)
const peerInfo = byId('peer-info')
const textarea = byId('textarea')
const picture = byId('picture')
const sendButton = byId('sendButton')
const sendPicButton = byId('sendPicButton')
const pasteButton = byId('pasteButton')
const noPeersCopy = peerInfo.innerText
const config = {appId: 'droppali-82ad3'}
const roomCap = 2

let room
let sendText
let sendPic

init(window.location.search.substring(1))
document.documentElement.className = 'ready'

sendButton.addEventListener('click', (event) => {
  sendText(textarea.value)
});

pasteButton.addEventListener('click', async (event) => {
  const text = await navigator.clipboard.readText();
    sendText(text)
});

async function init(name) {
  const ns = 'room' + name
  let getText
  let getPic

  room = joinRoom(config, ns)
  ;[sendText, getText] = room.makeAction('textchange')
  ;[sendPic, getPic] = room.makeAction('pic')

  byId('room-num').innerText = 'room #' + name
  room.onPeerJoin(updatePeerInfo)
  room.onPeerLeave(updatePeerInfo)
  getText(textChange)
  getPic(receivePicture)
}

function textChange(text, id) {
  console.log("Received text")
  textarea.value = text
}

function receivePicture(data, id, meta) {
  console.log('Received picture')
  console.log(data);
  let blob = new Blob([data], { type: meta.type })
  saveAs(blob, meta.name);
  
//   var saveData = (function () {
//     var a = document.createElement("a");
//     document.body.appendChild(a);
//     a.style = "display: none";
//     return function (data, fileName) {
//       let blob = new Blob([data], { type: meta.type })
//       console.log(blob);
//       let url = window.URL.createObjectURL(blob);
//       console.log(url);
//         a.href = blob;
//         a.download = meta.name;
//         a.click();
//         window.URL.revokeObjectURL(url);
//     };
// }());

// var data = { x: 42, s: "hello, world", d: new Date() },
//     fileName = "my-download.json";

// saveData(data, fileName);
}

function updatePeerInfo() {
  const count = room.getPeers().length
  peerInfo.innerHTML = count
    ? `Right now <em>${count}</em> other peer${
        count === 1 ? ' is' : 's are'
      } connected with you. Send them some fruit.`
    : noPeersCopy
}

function dropHandler(ev) {
  console.log('File(s) dropped');

  // Prevent default behavior (Prevent file from being opened)
  ev.preventDefault();

  // if (ev.dataTransfer.items) {
    // Use DataTransferItemList interface to access the file(s)
    for (var i = 0; i < ev.dataTransfer.items.length; i++) {
      // If dropped items aren't files, reject them
      if (ev.dataTransfer.items[i].kind === 'file') {
          let file = ev.dataTransfer.items[i].getAsFile();
          console.log('... file[' + i + '].name = ' + file.name);

              let reader = new FileReader();
              reader.onload = function(e2) {
                  // finished reading file data.
                  console.log(e2.target.result);
                  var img = document.getElementById("picture");
                  // img.src = e2.target.result;
                  sendPic(e2.target.result, null, {name: file.name, type: file.type});

                  // document.body.appendChild(img);
              }
              reader.readAsArrayBuffer(file); // start reading the file data.
      }
    }
  // } else {
  //   // Use DataTransfer interface to access the file(s)
  //   for (var i = 0; i < ev.dataTransfer.files.length; i++) {
  //     console.log('... file[' + i + '].name = ' + ev.dataTransfer.files[i].name);
  //     let file = ev.dataTransfer.files[i];
  //     console.log("Pipp");
  //     console.log(file.arrayBuffer());
  //     sendPic(file.arrayBuffer(), null, {name: file.name, type: file.type});

  //     // if (file.type.match(/image.*/)) {
  //     //     let reader = new FileReader();
  //     //     reader.onload = function(e2) {
  //     //         // finished reading file data.
  //     //         var img = document.getElementById("picture");
  //     //         img.src = e2.target.result;
  //     //         sendPic(e2.target.result, null, {name: file.name, type: file.type});

  //     //         document.body.appendChild(img);
  //     //     }
  //     //     reader.readAsDataURL(file); // start reading the file data.
  //     // }
  //   }
  // }
}

window.dropHandler = dropHandler;

function dragOverHandler(ev) {
  // Prevent default behavior (Prevent file from being opened)
  ev.preventDefault();
}

window.dragOverHandler = dragOverHandler;
