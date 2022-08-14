for(let i=1;i<=30;i++){
    $('.window1').append(`<img src="hidden-card.png" id=card${i} class=card>`)
    if(i%5===0){
        $('.window1').append(`<br>`)
    }
}
$("#card1").attr("src", '뿔버섯.png');
