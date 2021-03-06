     
   //Event class: Creates new events
   
  class Event {
     constructor(eventName,date,time) {
       this.eventName = eventName;
       this.date = date;
       this.time = time;
     }
  }

  class Timer {
    constructor(eventName,days,hours,min,sec,distance,) {
      this.eventName = eventName;
      this.days = days;
      this.hours = hours;
      this.min = min;
      this.sec = sec;
      this.distance = distance;
    }
  }

   // User interface class

   class UI {

      static eventObj = null;
      static timmy;
      static sideTimmy;
      static eventsArr = [];
      static eventTimeout;

      static createTimer(event) {
        let date = event.date;
        let time = event.time;
        
        date = date.split('-');
        time = time === "" ? "0:0".split(':') : time.split(":");

        const[year,month,day] = date;
        let [hr,min] = time;
        
        let now = new Date();
        let futureDate = new Date(year,month-1,day,hr,min);

        let distance = futureDate.getTime() - now.getTime();
        let days = Math.floor(distance / (1000*60*60*24));
        let hours = Math.floor((distance % (1000*60*60*24))/(1000*60*60));
        let minutes = Math.floor((distance % (1000*60*60))/(1000*60));
        let seconds = Math.floor((distance % (1000*60))/(1000));
        let evName = event.eventName;

        return new Timer(evName,days,hours,minutes,seconds,distance);
      }
      
      static updateTimer() {

        let timer = UI.createTimer(UI.eventObj);

        let timerContainer = document.querySelector('.main-timer');
        document.querySelector('.main-event-title').textContent = UI.eventObj.eventName;

        if(timer.distance < 0) {
          timerContainer.innerHTML = 'D O N E';
          UI.eventTimeout = true;
          clearInterval(UI.timmy);  
          return;
        }
        
        timerContainer.innerHTML = `<p>
        ${timer.days}<span class="days">${timer.days > 1 ? 'Days' : timer.days === 0 ?'Days' : 'Day'}</span>${timer.hours}<span class="hours">${timer.hours > 1 ? 'Hours': timer.hours === 0 ? 'Hours': "Hour"}</span
        >${timer.min < 10 ? '0' + timer.min : timer.min}<span class="min">Min</span>${timer.sec < 10 ? '0' + timer.sec : timer.sec}<span class="sec">Sec</span>
        </p>`
      }
  
      static addEventToSideMenu() {

        let df = new DocumentFragment();
        
        UI.eventsArr.forEach(event => {
           let timer = UI.createTimer(event);
           let div = document.createElement('div');
           div.classList.add('event');
           div.dataset.evName = timer.eventName;
           div.innerHTML = `<h4 class="event-title">${timer.eventName}</h4>
           <i class="fas fa-trash-alt trash"></i>
           <div class="timer">
           ${timer.days}<span class="days">${timer.days > 1 ? 'Days' : timer.days === 0 ? 'Days' : 'Day'}</span> ${timer.hours}<span class="hours"> ${timer.hours > 1 ? 'Hours' : timer.hours === 0 ? 'Hours' : 'Hour'}</span>
           ${timer.min}<span class="min"> Min</span> ${timer.sec}<span class="sec"> Sec</span>
           </div>`
           if(timer.distance < 0) {
             div.innerHTML =`
             <i class="fas fa-trash-alt trash"></i>
             <div class="timer">
             D  O  N  E
             </div>`;
             clearInterval(UI.timmy);
           }
           df.append(div);
        });
        const eventsMenu = document.querySelector('.events-menu');
        eventsMenu.innerHTML = "<h2 class='events-menu-title'>Events</h2>";
        eventsMenu.append(df);
      }

      static showAlert(date,eventName) {
        if(!date && eventName) {
          document.getElementById('event').style.border = 'none';
          document.getElementById('date').style.border = 'none';
          document.getElementById('date').style.border = '3px solid red';
          UI.resetTimer();
          clearInterval(UI.timmy);
          return false;
        }
        if(!date && !eventName) {
          document.getElementById('date').style.border = '3px solid red';
          document.getElementById('event').style.border = '3px solid red';
          document.getElementById('event').placeholder = 'Please provide event title';
          UI.resetTimer();
          clearInterval(UI.timmy);
          return false;
        }

        document.getElementById('event').style.border = 'none';
        document.getElementById('date').style.border = 'none';
        document.getElementById('event').placeholder = "Event name";
        return true;
      }
      static resetTimer() {
        document.querySelector('.main-event-title').textContent = "";
        let timer = document.querySelector('.main-timer');
        timer.innerHTML = `<p>
        00<span class="days">Day</span>00<span class="hours">Hour</span
        >00<span class="min">Min</span>00<span class="sec">Sec</span>
        </p>`
      }

      static removeEvent(target) {
       target.parentNode.remove();
      }
    }

   

  //Store class: Handles all the tasks related to local storage
   class Store {
      static setStore(events){
        localStorage.setItem('events',JSON.stringify(events));
      }

      static getStore() {
        if(JSON.parse(localStorage.getItem('events')) === null) {
          UI.eventsArr = [];
         } else {
          UI.eventsArr = JSON.parse(localStorage.getItem('events'))
         } 
      }

    }
   //Event: Start countdown

   document.getElementById('start').addEventListener('click', (ev) => {
      ev.preventDefault(); // Probably not needed since we're not using an input of type="submit" inside form. Check this!

      //Get event data from the form
      const date = document.getElementById('date').value;
      const time = document.getElementById('time').value;
      const eventName = document.getElementById('event').value;

      if(!UI.showAlert(date,eventName)) return;

      //Instantiate new event object using Event constructor
      const event = new Event(eventName,date,time); 

      //Assign new event to a static (accessible from outside) variable inside UI class. Which is later passed to updateTimer method inside UI class
      UI.eventObj = event;
      
      let form = document.querySelector('#event-form');
      form.reset();
      //Assign setInterval to static variable timmy inside UI class to be used with clearInterval when condition is met
      UI.timmy = setInterval(UI.updateTimer,1000)
   })
  

  //  Event: Save or reset event

     document.querySelector('.display-controls').addEventListener('click',(ev) => {
       
        if(ev.target.matches('.save')) {
            if(!UI.eventObj) {
              return;
            }

            let eventInStore = UI.eventsArr.filter(evObj => evObj.eventName === UI.eventObj.eventName).length;
            
            if(eventInStore === 1) {
              alert("The event already exists! Please rename the event.")
              return;
            }
        }

        if(ev.target.matches('.reset')) {
          UI.resetTimer()
          clearInterval(UI.timmy);
          UI.eventObj = null;
          return;
        }
          
          UI.eventsArr.push(UI.eventObj);
          Store.setStore(UI.eventsArr);
          UI.sideTimmy = setInterval(UI.addEventToSideMenu,1000);
        })
    
    //Event: Remove event from side menu

    document.querySelector('.events-menu').addEventListener('click',(ev) => {
      if(ev.target.matches('.trash')) {
        UI.removeEvent(ev.target);
        
        Store.getStore();
        let id = ev.target.parentNode.dataset.evName;
        UI.eventsArr = UI.eventsArr.filter(e => e.eventName != id);
        Store.setStore(UI.eventsArr);
      }
   })


   //Event: When page loads check local storage

   document.addEventListener('DOMContentLoaded', () => {
    Store.getStore();
    if(!UI.eventsArr.length) return;
    UI.sideTimmy = setInterval(UI.addEventToSideMenu,1000);

})