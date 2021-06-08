var states_list = [false, false, false, false, false, false, false, false];
var stop = false;

function reflex_agent(location, state){
    if (state=="DIRTY") return "CLEAN";
    else if (location=="A") return "RIGHT";
    else if (location=="B") return "LEFT";
}


function test(states){
       var location = states[0];		
       var state = states[0] == "A" ? states[1] : states[2];
       var action_result = reflex_agent(location, state);
       document.getElementById("log").innerHTML+="<br>Status: [".concat(states[0]).concat(" | ").concat(states[1]).concat(" | ").concat(states[2]).concat("]  ").concat(" -- Action: ").concat(action_result);
       mark_state();
       if (action_result == "CLEAN"){
         if (location == "A") states[1] = "CLEAN";
         else if (location == "B") states[2] = "CLEAN";
       }
       else if (action_result == "RIGHT") states[0] = "B";
       else if (action_result == "LEFT") states[0] = "A";
      if(!stop){		
        setTimeout(function(){ test(states); }, 2000);
      }
}

var states = ["A","DIRTY","DIRTY"];
test(states); 

//-------



function mark_state(){
  if (states[0] == "A"){
    if (states[1]=="DIRTY"){
      if (states[2] == "DIRTY"){
          //A D  D
          states_list[0] = true;
      }
      else{
        //A D C
          states_list[1] = true;
      }
    }
    else{
      if (states[2] == "DIRTY"){
        //A C  D
        states_list[2] = true;
      }
      else{
        //A C C
        states_list[3] = true;
      }
    }
  }
  else{
    if (states[1]=="DIRTY"){
      if (states[2] == "DIRTY"){
        //B D  D
        states_list[4] = true;
      }
      else{
        //B D C
        states_list[5] = true;
      }
    }
    else{
      if (states[2] == "DIRTY"){
        //B C  D
        states_list[6] = true;
      }
      else{
        //B C C
        states_list[7] = true;
      }
    }
  }
}

function visited_states(){
  var count =0;
 for (let index = 0; index < states_list.length; index++) {
   if (states_list[index])count++;
 }
 if(count ==8){stop = true;}
  return count;
}

function is_completed(){
  for (const val in states_list) {
      if (val==false) {return false;}
  }
  return true;
}

function random_dirt(){
  var action = Math.floor(Math.random()*4);
  switch(action){
    case 0:
      break;

    case 1:
      states[1] = "DIRTY";
      document.getElementById("log").innerHTML+="<br>Dirtyed space A";
      break;

    case 2:
      states[2] = "DIRTY";
      document.getElementById("log").innerHTML+="<br>Dirtyed space B";
      break;
    
    case 3:
      states[1] = "DIRTY";
      states[2] = "DIRTY";
      document.getElementById("log").innerHTML+="<br>Dirtyed spaces A and B";
      break;
  }
  if(!stop){
  setTimeout(function(){ random_dirt(); }, 4000);
  }
}

function paint(){
  
  if (states[0] =="A"){
    document.getElementById("a_cleaner").style.visibility='visible';
    document.getElementById("b_cleaner").style.visibility='hidden';
  }
  else{
    document.getElementById("a_cleaner").style.visibility='hidden';
    document.getElementById("b_cleaner").style.visibility='visible';
  }


  if (states[1] =="DIRTY"){
    document.getElementById("a_dirt").style.visibility='visible';
  }
  else{
    document.getElementById("a_dirt").style.visibility='hidden';
  }

  if (states[2] =="DIRTY"){
    document.getElementById("b_dirt").style.visibility='visible';
  }
  else{
    document.getElementById("b_dirt").style.visibility='hidden';
  }

  document.getElementById("actualstatus").innerHTML="<br>Actual Status: [".concat(states[0]).concat(" | ").concat(states[1]).concat(" | ").concat(states[2]).concat("]  ");
  document.getElementById("statesvisited").innerHTML = visited_states();
  setTimeout(function(){ paint(); }, 1000);

}
paint();

function dirt(x){
  states[x] = "DIRTY";
}