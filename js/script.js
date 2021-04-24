     
   //Event class: Creates new events
   
  class Event {
     constructor(eventName,date,time) {
       this.eventName = eventName;
       this.date = date;
       this.time = time;
     }
  }

  class Timer {
    constructor(days,hours,min,sec,distance) {
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

      static createTimer() {
        let date = UI.eventObj.date;
        let time = UI.eventObj.time;
        
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

        return new Timer(days,hours,minutes,seconds,distance);
      }
      
      static updateTimer() {

        let timer = UI.createTimer();

        console.log(timer)

        let timerContainer = document.querySelector('.main-timer');
        document.querySelector('.main-event-title').textContent = UI.eventObj.eventName;

        if(timer.distance < 0) {
          timerContainer.innerHTML = 'DONE';
          clearInterval(UI.timmy);  
          return;
        }
        
        timerContainer.innerHTML = `<p>
        ${timer.days}<span class="days">${timer.days > 1 ? 'Days' : timer.days === 0 ?'Days' : 'Day'}</span>${timer.hours}<span class="hours">${timer.hours > 1 ? 'Hours': timer.hours === 0 ? 'Hours': "Hour"}</span
        >${timer.min}<span class="min">Min</span>${timer.sec}<span class="sec">Sec</span>
        </p>`
      }
   }

  // Store class: Handles all the tasks related to local storage
   class Store {

   }


   //Event: Start countdown

   document.getElementById('start').addEventListener('click', (ev) => {
      ev.preventDefault(); // Probably not needed since we're not using an input of type="submit" inside form. Check this!

      //Get event data from the form
      const date = document.getElementById('date').value;
      const time = document.getElementById('time').value;
      const eventName = document.getElementById('event').value;

      //Instantiate new event using Event constructor
      const event = new Event(eventName,date,time); 

      //Assign new event to a static (accessible from outside) variable inside UI class. Which is later passed to updateTimer method inside UI class
      UI.eventObj = event;

      //Assign setInterval to static variable timmy inside UI class to be used with clearInterval when condition is met
      UI.timmy = setInterval(UI.updateTimer,1000)
   })