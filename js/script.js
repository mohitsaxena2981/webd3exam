let colors = ["lightpink", "lightblue", "lightgreen", "black"];
let modalPriorityColor = colors[colors.length - 1];

let FlagAdd = false;
let FlagRemoved = false;

let ButtonAdd = document.querySelector(".add-btn");
let ButtonRemove = document.querySelector(".remove-btn");
let mainCont = document.querySelector(".main-cont");


let lockClass = "fa-lock";
let unlockClass = "fa-lock-open";

let modalCont = document.querySelector(".modal-cont");
let textareaCont = document.querySelector(".textarea-cont");

let ArrayOfTickets = [];

let allPriorityColor = document.querySelectorAll(".priority-color");
let ColoroftoolBox = document.querySelectorAll(".color");

if(localStorage.getItem("jira_tickets")){
    
    ArrayOfTickets = JSON.parse(localStorage.getItem("jira_tickets"));
    ArrayOfTickets.forEach((ticketObj) =>{
        ticketisCreated(ticketObj.ticketColor , ticketObj.ticketTask , ticketObj.ticketID);
    })
}

for(let i = 0 ;  i < ColoroftoolBox.length ; i++){
    ColoroftoolBox[i].addEventListener("click" , (e) =>{
        let currentColoroftoolBox = ColoroftoolBox[i].classList[0];

        let filteredTickets = ArrayOfTickets.filter((ticketObj , idx) =>{
            return currentColoroftoolBox === ticketObj.ticketColor;
        })
        
       
        let allTicketsCont = document.querySelectorAll(".ticket-cont");
        for(let i=0 ; i < allTicketsCont.length ; i++){
            allTicketsCont[i].remove();
        }
        
        
        filteredTickets.forEach((ticketObj, idx) =>{
            ticketisCreated(ticketObj.ticketColor, ticketObj.ticketTask , ticketObj.ticketID);
        })

    })
    ColoroftoolBox[i].addEventListener("dblclick" , (e) =>{
        let allTicketsCont = document.querySelectorAll(".ticket-cont");
        for(let i=0 ; i < allTicketsCont.length ; i++){
            allTicketsCont[i].remove();
        }
        ArrayOfTickets.forEach((ticketObj , idx) =>{
            ticketisCreated(ticketObj.ticketColor , ticketObj.ticketTask , ticketObj.ticketID);
        })
    })
}



allPriorityColor.forEach((ColorElem, idx) => {
    ColorElem.addEventListener("click", (e) => {
        allPriorityColor.forEach((priorityColorElem, idx) => {
            priorityColorElem.classList.remove("border");
        })
        ColorElem.classList.add("border");

        modalPriorityColor = ColorElem.classList[0];
    })
})

ButtonAdd.addEventListener("click", (e) => {

    console.log("Kunal");

    FlagAdd = !FlagAdd;
    if (FlagAdd) {
        modalCont.style.display = "flex";
    } else {
        modalCont.style.display = "none";
    }
})

ButtonRemove.addEventListener("click", (e) => {
    FlagRemoved = !FlagRemoved;
    if(FlagRemoved){
        ButtonRemove.classList.add("kn");
    }
    else{
        ButtonRemove.classList.remove("kn");
    }

})

modalCont.addEventListener("keydown", (e) => {
    let key = e.key;
    if (key === "Enter") {
        ticketisCreated(modalPriorityColor, textareaCont.value);
        FlagAdd = false;
        Defaultmodale();
    }
})

function ticketisCreated(ticketColor, ticketTask, ticketID) {
    let id = ticketID || shortid();
    let ticketCont = document.createElement("div");
    ticketCont.setAttribute("class", "ticket-cont");
    ticketCont.innerHTML = `
    <div class = "ticket-color ${ticketColor}"></div>
    <div class="ticket-id">#${ticketID}</div>
    <div class="task-area">${ticketTask}</div>
    <div class="ticket-lock">
        <i class="fa-solid"></i>
    </div>
    `;
    mainCont.appendChild(ticketCont);

 
    if(!ticketID) {
        
        ArrayOfTickets.push({ticketColor , ticketTask , ticketID : id});
        localStorage.setItem("jira_tickets",JSON.stringify(ArrayOfTickets));
    }

    handleRemoval(ticketCont ,id);
    LockisHandled(ticketCont , id);
    handleColor(ticketCont , id);
}

function handleRemoval(ticket , id) {

    ticket.addEventListener("click" , (e) =>{
        if(!FlagRemoved) return ;
        
        let idx = getTicketIdx(id);
      
        ArrayOfTickets.splice(idx , 1);
        let strArrayOfTickets = JSON.stringify(ArrayOfTickets);
        localStorage.setItem("jira_tickets", strArrayOfTickets);
        ticket.remove(); 
    })
}

function LockisHandled(ticket , id) {
    let ticketLockElem = ticket.querySelector(".ticket-lock");
    let ticketLock = ticketLockElem.children[0];
    let ticketTaskArea = ticket.querySelector(".task-area");
    ticketLock.addEventListener("click", (e) => {
        let ticketIdx = getTicketIdx(id);
        if (ticketLock.classList.contains(lockClass)) {
            ticketLock.classList.remove(lockClass);
            ticketLock.classList.add(unlockClass);
            ticketTaskArea.setAttribute("contenteditable", "true");
        } else {
            ticketLock.classList.remove(unlockClass);
            ticketLock.classList.add(lockClass);
            ticketTaskArea.setAttribute("contentedittable", "true");
        }
       
        ArrayOfTickets[ticketIdx].ticketTask = ticketTaskArea.innerText;
        localStorag.setItem("jira_tickets",JSON.stringify(ArrayOfTickets));
    })
}

function handleColor(ticket ,id) {
    let ticketColor = ticket.querySelector(".ticket-color");
    ticketColor.addEventListener("click", (e) => {
     
        let ticketIdx = getTicketIdx(id);
        
        let currentTicketColor = ticketColor.classList[1];
      
        let currentTicketColorIdx = colors.findIndex((color) => {
            return currentTicketColor === color;
        })
        currentTicketColorIdx++;
        let newTicketColorIdx = currentTicketColorIdx % colors.length;
        let newTicketColor = colors[newTicketColorIdx];
        ticketColor.classList.remove(currentTicketColor);
        ticketColor.classList.add(newTicketColor);

 
        ArrayOfTickets[ticketIdx].ticketColor = newTicketColor;
        localStorage.setItem("jira_tickets" , JSON.stringify(ArrayOfTickets));
    })  
}

function getTicketIdx(id) {
    let ticketIdx = ArrayOfTickets.findIndex((ticketObj) =>{
        return ticketObj.ticketID == id;
    })
    return ticketIdx;
}

function Defaultmodale(){
    modalCont.style.display = "none";
    textareaCont.value = "";
    allPriorityColor.forEach((priorityColorElem, idx) => {
        priorityColorElem.classList.remove("border");
    })
    allPriorityColor[allPriorityColor.length - 1].classList.add("border");

}

