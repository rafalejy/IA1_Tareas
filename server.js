const minimax = require("./minimax")
var http = require('http'); // 1 - Import Node.js core module
const express = require('express')
const app = express()

app.get('/reversi', (req, res) => {
   
    console.log(req.query.estado);
    var indice = mini_max(req.query.estado, req.query.turno);
    var r = indexToCol(indice);
    console.log("jugar a la posición: "+r);
    res.send(String(r));
    
})

app.listen(process.env.PORT || 5000); //3 - listen for any incoming requests

console.log('Node.js web server at port 5000 is running..')


function mini_max(s, t){
    status = s;
    var vector = []
    for (let index = 0; index < 64; index++) {
        vector.push([status[index],index]);
    }
   
    moves = getSuccessorMoves(t,vector);
    return selectBetter(moves[0]);
    // respuesta = algoritmo(vector,t,0,[]);
    // console.log("respuesta:")
    // console.log(respuesta);
    // return respuesta[1][0];

}


function indexToCol(indice){
    col = Math.trunc(indice/8);
    fil = (indice%8);
    console.log("c: "+col+" ,f:"+fil);
    res = ""+col+""+fil;
    return res;
}

function selectBetter(moves){
    var better=[];
    var indice = 0;

    for (let index = 0; index < moves.length; index++) {

      if (moves[index].length > better.length){
          better = moves[index].length;
          indice = index;
      }
    }

    //console.log("indice: "+indice);

    col = Math.trunc(indice/8);
    fil = (indice%8);
    console.log("f,c"+fil+","+col);

    res = ""+col+""+fil;
    //return res;
    return indice;
}


function algoritmo(tablero,turno,nivel,movimiento){
    console.log("===========================================================entrando a algoritmo con nivel:"+ nivel);
   // print_my(tablero);
    console.log("heredado es");
    console.log(movimiento);
    console.log("===================================================================================================");
    peso = [99,-8,8,6,6,8,-8,99,-8,-24,-4,-3,-3,-4,-24,-8,8,-4,7,4,4,7,-4,8,6,-3,4,0,0,4,-3,6,6,-3,4,0,0,4,-3,6,8,-4,7,4,4,7,-4,8,-8,-24,-4,-3,-3,-4,-24,-8,99,-8,8,6,6,8,-8,99]
    peso_propio =0;
    ocupa_propio=0;

    peso_enemigo = 0;
    ocupa_enemigo=0;
    espacios_vacios = 0;

    cant_comidas =0

    for (let index = 0; index < tablero.length; index++) {
       if (tablero[index][0] == turno){peso_propio += peso[index]; ocupa_propio++;}
       else if (tablero[index][0] == 2){espacios_vacios++;}
       else {peso_enemigo += peso[index];ocupa_enemigo++;}
    }
    
  
    pp = (peso_propio-216)*100/784;
    pe = (peso_enemigo-216)*100/784;
    var r_pesos = pp/pe;

    op = (ocupa_propio*100/64);
    oe = (ocupa_enemigo*100/64);
    var r_ocupa = op/oe;

    // console.log("HEURISTIC DATA");
    // console.log("peso propio "+peso_propio);
    // console.log("peso enemig "+peso_enemigo);
    // console.log("ocup propio "+ocupa_enemigo);
    // console.log("ocup enemig "+ocupa_enemigo);
    // console.log("sin ocupar  "+espacios_vacios);
    // console.log("HEURISTIC DATA2");
    // console.log(pp);
    // console.log(pe);
    // console.log(op);
    // console.log(oe);
    // console.log("RELACIONES");
    // console.log("rel pesos %"+r_pesos);
    // console.log("rel ocupa %"+r_ocupa);

    //Version 1 
    var mih = r_pesos + r_ocupa ;
   // console.log("mi heuristica "+mih);
  
    valores = [];
    max=-90000;
    min=90000;
    max_mov =[];
    min_mov = [];

    movesarray = getSuccessorMoves(turno,tablero);
    moves = movesarray[1];

    if (nivel == 2){
        console.log("la heuristica es "+ mih);
        return [mih,movimiento];
    }
    if (moves.length ==0){
        console.log("la heuristica es "+ mih);
        return [mih,movimiento];
    }

    //movesarray = getSuccessorMoves(turno,tablero);
    //moves = movesarray[1];


    var selected_move_index =0; 
    var mov_heredado=[];
    if (nivel==0){
        mov_heredado = moves[x];
    }
    else {
        mov_heredado = movimiento}

    for (let x = 0; x < moves.length; x++) {
        tableronuevo = Mover(tablero,moves[x],turno);
        res = algoritmo(tableronuevo,next(turno),nivel+1,mov_heredado); 
        if (res[0]>max) {max_mov = res; max = res[0];selected_move_index = x};
        //if (res[0]<min) {min_mov = res; min = valores[0]};
    }

    // if (nivel%2 ==0){
    //     console.log("elegido maximo"+max_mov[1]);
    //     return max_mov;
    // }
    // else{
    //     console.log("elegido minimo"+min_mov[1]);
    //     return min_mov;
    // }

    console.log("----------------------------------------------elegido maximo"+max_mov);
    

    if (nivel==0){
        return [max, moves[selected_move_index]];
    }else{
        return [max,movimiento];
    }
    
    // console.log("elegido maximo: "+max_mov[0]);
    // return max_mov;
    
}


function next(turno){
    return Math.abs(turno-1).toString();
}

function Mover(est,movimiento, turno){
    console.log(">>>moviendo con turno "+turno);
    console.log(movimiento);
    console.log(">>>en estado: ");
    print_my(est);
    estado = [...est]
    estado[movimiento[0]]=[turno,movimiento[0]];
    for (let index = 0; index < movimiento[1].length; index++) {
        estado[movimiento[1][index]]=[turno,movimiento[1][index]];
    }
    print_my(estado);
    return estado;
}

function print_my(estado){
    var contador =0;
    let a = "";
    for (let j = 0; j < 64; j++) {
         a = a+" [";
         if(estado[j][1]<10){a=a+0;}
         a=a+estado[j][1]+": "+estado[j][0]+"]";
        contador++;
        if (contador>7){
            contador =0;
            a=a+"\n";
        }

    }
    console.log(a);
}
function getSuccessorMoves(t, vector){
    var movimientos =[];
    var moves =[];
    for (let index = 0; index < 64; index++) {
       moves[index] = [];        
    }
    //console.log(moves);
    //VERTICALES Y HORIZONTALES
    for (var x = 0; x < 8; x++) {
        v = getVertical(x,vector);
        h = getHorizontal(x,vector);
        //console.log(v);
        //console.log(h);
        var mv= getMoves(v,t);
        var mh= getMoves(h,t);
        //console.log(mv);
        //console.log(mh);
        movimientos = movimientos.concat(mv);
        movimientos = movimientos.concat(mh);

    }
    //DIAGONALES
    for(let y=0; y<6; y++){
        var asc = 56+y; 
        var desc = y;
        da1 = getDiagonal(asc,vector,true);
        dd1 = getDiagonal(desc,vector,false);
        movimientos = movimientos.concat(getMoves(da1,t));
        movimientos = movimientos.concat(getMoves(dd1,t));
     
    }
    for(let y=2; y<7; y++){
        var asc = y; 
        var desc =(7-y)*8;
        da2 = getDiagonal(asc,vector,true);
        dd2 = getDiagonal(desc,vector,false);
        movimientos = movimientos.concat(getMoves(da2,t));
        movimientos = movimientos.concat(getMoves(dd2,t));
    }

    
   for (let index = 0; index < movimientos.length; index++) {
       mov = movimientos[index];
       moves[mov[0]]= moves[mov[0]].concat(mov[1]);
   }

   var movimientos_no_rep=[];
   for (let index = 0; index < moves.length; index++) {
    if (moves[index].length!=0){
        movimientos_no_rep.push([index,moves[index]]);
    }
   }

//    console.log("-----movimientos: ")
//    console.log(movimientos);
//    console.log("-----moves: ")
//    console.log(moves);
//    console.log("-----movimientos sin repetidos (fusionados): ")
//    console.log(movimientos_no_rep);
   //return [moves,movimientos];
   return [moves,movimientos_no_rep];

}

function getVertical(i,vector){
    resultado = [];
    for (let index = i; index < 64; index+=8) {
       resultado.push(vector[index])
    }
    //console.log("vertical "+i );
    //console.log(resultado);
    return resultado;
}

function getHorizontal(j,vector){
    resultado = [];
    for (let index = 0; index <8; index++) {
       resultado.push(vector[j*8+index])
    }
    //console.log("horizontal "+j );
    //console.log(resultado);
    return resultado;
}

function getDiagonal(k,vector,asc){
   
    if (asc){
        ls=64;
        factor = -7;
        if(k>=56){
            li= 8*k-442;
        }else{

            li = 5/8-1;
        }
    }
    else {
        factor=9;
        li=-1;
        if(k<7){
            ls= 7*(9-k)+1;
        }else{
            ls= 63-(k/8)+1;
        }
    }
    resultado = [];
    for (let index = k; index >li && index <ls; index+=factor) {
        //console.log("hi");
        resultado.push(vector[index]);
    }
    //console.log("diagonal "+k + "ascendente: "+asc);
    //console.log(resultado);
     return resultado;
}


function getMoves(vector, turno){
    // console.log("evaluando vector:")
    // console.log(vector);
    propia = false;
    vacia = false;
    var temp;
    var move_p = [];
    var list_p = [];
    var move_v =[];
    var list_v =[];
    var res=[];
    //console.log(turno);
    for (let pos = 0; pos < vector.length; pos++) {

        //console.log("inicia iteracion ---"+pos);
       if (vector[pos][0] == 2){  //ENCONTRANDO UNA VACÍA
            //console.log("vacia");
            vacia = true;
            temp = vector[pos][1];
            if (propia && list_p.length!=0){
                var new_move = [temp,[...list_p]]
                move_p.push(new_move);
                //console.log("se pusheo: "+vector[pos][1] +" que voltea a "+ list_p );
                list_p = [];
                //console.log(list_p);
            }
            if(vacia){
                list_v=[];
            }
            propia = false; 
        }
       else if (vector[pos][0] == turno){ // ENCONTRANDO UNA PROPIA
        //console.log("propia");
           propia = true
           if(vacia && list_v.length !=0){
                var new_move = [temp,[...list_v]]
                move_v.push(new_move);
                //console.log("se pusheo: "+temp +" que voltea a "+ list_v );
                list_v = [];
           }
           if(propia){
               list_p=[];
           }
           vacia = false;
        }
        else{                       //ENCONTRANDO UNA ENEMIGA
            //console.log("enemiga");
            if(propia){
                list_p.push(vector[pos][1]);
                //console.log("se voltearía: "+vector[pos][1] );
                //console.log(list_p);

            }
            if(vacia){
                list_v.push(vector[pos][1]);
                //console.log("se voltearía: "+vector[pos][1] );
                //console.log(list_v);
            }
        }
     
      
    }

    res = move_p.concat(move_v);
    //console.log("resultado :");
    //console.log(res);
    //console.log("termina iteracion ---------"+pos);
    return res;

}







