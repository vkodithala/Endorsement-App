import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove, update } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://playground-334e4-default-rtdb.firebaseio.com/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const endorsementsinDB = ref(database, "endorsements")

const button=  document.getElementById("publish-btn")
const endEl = document.getElementById("end-el")
const fromEl = document.getElementById("from")
const toEl = document.getElementById("to")
const endList = document.getElementById("end-list")

button.addEventListener("click", function() {
    let userInput = endEl.value
    push(endorsementsinDB, {
        end: endEl.value,
        from: fromEl.value,
        to: toEl.value,
        likes: 0
    })
    clearInputField()
})

onValue(endorsementsinDB, function(snapshot) {
    if (snapshot.exists()) {
        let itemsArray = Object.entries(snapshot.val())
        clearEndorsements()
        for (let i=0; i<itemsArray.length; i++) {
            let currentItem = itemsArray[i]
            addEndorsement(currentItem)
        }
    } else {
        endList.innerHTML = "<p id='filler'>No endorsements given yet...</p>"
    }
})

function addEndorsement(current) {
    let endID = current[0]
    let endval = current[1].end
    let endfrom = current[1].from
    let endto = current[1].to
    let endlikes = current[1].likes
    let newend = document.createElement("li")
    newend.innerHTML = `<b>To ${endto}</b><br><br>${endval}<br><br><b>From ${endfrom}</b>`
    let likesbtn = document.createElement("p")
    likesbtn.innerHTML = `<p id="likes-btn">❤️ ${endlikes}</p>`
    newend.append(likesbtn)
    let deletebtn = document.createElement("button")
    deletebtn.setAttribute("id", "delete-btn")
    deletebtn.innerHTML = "DELETE"
    newend.append(deletebtn)
    likesbtn.addEventListener("click", function() {
        if (clickCount<1) {
            let end_loc = ref(database, `endorsements/${endID}`)
            update(end_loc, {
                likes: endlikes + 1
            })
            clickCount += 1
        }
    })
    deletebtn.addEventListener("click", function() {
        let end_loc = ref(database, `endorsements/${endID}`)
        remove(end_loc)
    })
    endList.append(newend)
}

function clearEndorsements() {
    endList.innerHTML = ""
}

function clearInputField() {
    endEl.value = ""
    fromEl.value = ""
    toEl.value = ""
}
