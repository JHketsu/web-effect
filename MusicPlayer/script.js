const prevButton = document.getElementById("prev");
const nextButton = document.getElementById("next");
const repeatButton = document.getElementById("repeat");
const shuffleButton = document.getElementById("shuffle");
const audio = document.getElementById("audio");
const songImage = document.getElementById("song-image");
const songName = document.getElementById("song-name");
const songArtist = document.getElementById("song-artist");
const pauseButton = document.getElementById("pause");
const playButton = document.getElementById("play");
const playlistButton = document.getElementById("playlist");
const maxDuration = document.getElementById("max-duration");
const currentTimeRef = document.getElementById("current-time");
const progressBar = document.getElementById("progress-bar");
const playlistContainer = document.getElementById("playlist-container");
const closeButton = document.getElementById("close-button");
const playlistSongs = document.getElementById("playlist-songs");
const currentProgress = document.getElementById("current-progress");

//index for songs
let index;

//initially loop=true
let loop=true; //列表循环

const songsList = [
    {
        name:"Make Me Love",
        link:"./make-me-move.mp3",
        artist:"Culture Code",
        image:"./make-me-move.jpg"
    },
    {
        name:"Where We Started",
        link:"./where-we-started.mp3",
        artist:"Lost Sky",
        image:"./where-we-started.jpg"
    },
    {
        name:"On & On",
        link:"./on-on.mp3",
        artist:"Cartoon",
        image:"./on-on.jpg"
    },
    {
        name:"Throne",
        link:"./throne.mp3",
        artist:"Rival",
        image:"./throne.jpg"
    },
    {
        name:"Need You Know",
        link:"./need-you-now.mp3",
        artist:"Venemy",
        image:"./need-you-now.jpg"
    }
]

//event objects
let events = {
    mouse:{
        click: "click"
    },
    touch:{
        click: "touchstart"
    }
}

let deviceType="";//record device type

//Detect Touch Device
//return boolean
const isTouchDevice = () => {
    try{
        //We try to create TouchEvent(it would fail for desktops and throw error)
        document.createEvent("TouchEvent");
        deviceType = "touch";
        return true;
    }catch(e){
        deviceType = "mouse";
        return false;
    }
}

//Format Time (convert ms to seconds, minutes and add 0 id less than 10)
const timeFormatter = (timeInput) =>{
    let minute = Math.floor(timeInput/60);
    minute = minute < 10? "0"+minute:minute;
    let second = Math.floor(timeInput%60);
    second = second<10? "0"+second:second;
    return `${minute}:${second}`;//it is ``
}
console.log(timeFormatter(1500));

//set song
const setSong = (arrayIndex) =>{
    //this extracts all the variables from the object
    let { name, link, artist, image } = songsList[arrayIndex];
    audio.src = link;
    songName.innerHTML = name;
    songArtist.innerHTML = artist;
    songImage.src = image;
    //display duration when metadata loads
    audio.onloadedmetadata = () =>{
        maxDuration.innerText = timeFormatter(audio.duration);
    }

}

//play song
const playAudio = () =>{
    audio.play();
    //classList 属性读取DOM元素的class,返回DOMTokenList的集合
    pauseButton.classList.remove("hide");
    playButton.classList.add("hide");
}

//repeat button
repeatButton.addEventListener("click",()=>{
    if(repeatButton.classList.contains("active")){
        repeatButton.classList.remove("active");
        audio.loop = false;
        console.log("repeat off");
    }
    else{
        repeatButton.classList.add("active");
        audio.loop = true;
        console.log("repeat on");
    }
})

//Next Song
const nextSong = () =>{
    //if loop is true then continue in normal order
    if(loop){
        if(index == songsList.length-1){
            //if last song is being played
            index = 0;
        }
        else{
            index +=1;
        }
        setSong(index);
        playAudio();
    }
    else{
        let randIndex = Math.floor(Math.random()*songsList.length);
        console.log(randIndex);
        setSong(randIndex);
        playAudio();
    }

}

//Prev Song (you cannot go back to a randomly played song)
const prevSong = () =>{
    //if loop is true then normal
    if(loop){
        if(index == 0){
            index = songsList.length-1;
        }
        else{
            index -=1;
        }
        setSong(index);
        playAudio();
    }
    else{
        let randIndex = Math.floor(Math.random()*songsList.length);
        console.log(randIndex);
        setSong(randIndex);
        playAudio();
    }

}
//pause song
const pauseAudio = () =>{
    audio.pause();
    pauseButton.classList.add("hide");
    playButton.classList.remove("hide");
}

//next song when current song ends
audio.onended = ()=>{
    nextSong();
}

//Shuffle sons
shuffleButton.addEventListener("click",()=>{
    if(shuffleButton.classList.contains("active")){
        shuffleButton.classList.remove("active");
        loop  = true;
        console.log("shuffle off");
    }
    else{
        shuffleButton.classList.add("active");
        loop = false;
        console.log("shuffle on");
    }
})

//play button
playButton.addEventListener("click",playAudio);
//next button
nextButton.addEventListener("click",nextSong);
//pause button
pauseButton.addEventListener("click",pauseAudio);
//prev button
prevButton.addEventListener("click",prevSong);

//if user clicks on progress bar
isTouchDevice();
progressBar.addEventListener(events[deviceType].click,(event)=>{
    //start of progressBar
    let coordStart = progressBar.getBoundingClientRect().left;
    //mouse click position
    let coordEnd = !isTouchDevice()? event.clientX: event.touches[0].clientX;
    let progress = (coordEnd - coordStart)/progressBar.offsetWidth;
    //set width to progress
    currentProgress.style.width = progress * 100 + "%";
    //set time
    audio.currentTime = progress * audio.duration;
    //play
    audio.play();
    pauseButton.classList.remove("hide");
    playButton.classList.add("hide");
})

//update progress every second
setInterval(()=>{
    currentTimeRef.innerText = timeFormatter(audio.currentTime);
    currentProgress.style.width = (audio.currentTime / audio.duration.toFixed(3))*100+"%";
})
//update time
//当HTMLMedia的currentTime更新时会触发timeupdate，触发频率由系统决定，每秒4-66次
//但是，上面那个每秒更新的函数也足够用了
//audio.addEventListener("timeupdate",()=>{
//    currentTimeRef.innerText = timeFormatter(audio.currentTime);
//})

//creates playlist
const initializePlaylist = () =>{
    for(let i in songsList){
        playlistSongs.innerHTML += `<li class='playlistSong' onclick='setSong(${i})'>
                                        <div class='playlist-image-container'>
                                            <img src='${songsList[i].image}'/>
                                        </div>
                                        <div class='playlist-song-details'>
                                            <span id='playlist-song-name'>
                                                ${songsList[i].name}
                                            </span>
                                            <span id='playlist-song-artist-album'>
                                                ${songsList[i].artist}
                                            </span>
                                        </div>
                                    </li>`
    }
}

//display playlist
playlistButton.addEventListener("click",()=>{
    playlistContainer.classList.remove("hide");
})

closeButton.addEventListener("click",()=>{
    playlistContainer.classList.add("hide");
})


window.onload = () =>{
    //initial first song
    index = 0;
    setSong(index);
    //create playlist
    initializePlaylist();
}