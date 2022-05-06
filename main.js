const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = "F8_PLAYER"

const cd = $('.cd');
const player = $('.player');
const heading = $('header h2');
const cdThumb = $(".cd-thumb");
const audio = $('#audio');
const playbtn = $('.btn-toggle-play');
const progress = $('#progress');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn =$('.btn-random');
const repeatBtn = $('.btn-repeat')
const playlist = $('.playlist')

const seconds = 0;
const minutes = 0;



const app = {
    isClock: false,
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    arrayIndex: [],
     config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs: [
        {
        name: "3107",
        single: "Wn Duongg Nau",
        path:"./music/3107-WnDuonggNau-6099150.mp3",
        image:"./img/img1-3107.jfif",
        time: 232
        },
        {
            name: "Chán gái",
            single: "Low-G",
            path:"./music/ChanGai707-LowG-6737474.mp3",
            image:"./img/img2-chan gai.jfif",
            time: 215
        },
        {
            name: "Chạy Về Nơi Phía Anh",
            single: "Khắc Việt",
            path:"./music/Chay-Ve-Noi-Phia-Anh-Khac-Viet.mp3",
            image:"./img/img3-chayvenoiphiaanh.jfif",
            time: 182,
        },
        {
            name: "Cưới Thôi",
            single: "Masewiu-Bray",
            path:"./music/CuoiThoi-MasewMasiuBRayTAPVietNam-7085648.mp3",
            image:"./img/img4-cuoithoi.jfif",
            time: 189,

        },
        {
            name: "Hát Cho Mình Em Nghe",
            single: "Minh",
            path:"./music/HatChoMinhEmNghe-Minh-7131116.mp3",
            image:"./img/img5-hatchominhemnghe.jfif",
            time: 168
        },
        {
            name: "See Tình",
            single: "Hoàng Thùy Linh",
            path:"./music/SeeTinh-HoangThuyLinh-7130526.mp3",
            image:"./img/img6-seetinh.jfif",
            time: 185
        },
        {
            name: "Thức Giấc",
            single: "DaLAB",
            path:"./music/ThucGiac-DaLAB-7048212.mp3",
            image:"./img/img7-thucgiac.jfif",
            time:  269
        },
        {
            name: "Thủ Đô Cypher",
            single: "MCK",
            path:"./music/ThuDoCypher-MCKRPTRPTOrijinnRzMaLowG-6678270.mp3",
            image:"./img/img8-thudo.jfif",
            time: 193
        },
        {
            name: "Yêu Đơn Phương Là Gì",
            single: "NC",
            path:"./music/YeuDonPhuongLaGi-NC-7014216.mp3",
            image:"./img/img9-yeudonphuonglagi.jfif",
            time: 215
        },
        {
            name: "Yêu Đương Khó Quá Thì Chạy Về Khóc Với Anh",
            single: "Erik",
            path:"./music/YeuDuongKhoQuaThiChayVeKhocVoiAnh-ERIK-7128950.mp3",
            image:"./img/img10.jfif",
            time: 224
        },

    ],
    setCofig: function(key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },
    render: function() {
       const htmls = this.songs.map((song, index) =>{
           return `<div class="song ${
                index == this.currentIndex ? "active" : ""
           }"data-index="${index}">
           <div class="thumb" style="background-image: url('${song.image}')">
           </div>
           <div class="body">
             <h3 class="title">${song.name}</h3>
             <p class="author">${song.single}</p>
           </div>
           <div class="option">
             <i class="fas fa-ellipsis-h"></i>
           </div>
           </div>`
       })
       playlist.innerHTML= htmls.join('');
       
    },
    
    defineProperties: function() {
        Object.defineProperty(this, 'currentSong',{ 
        get: function() {
            return this.songs[this.currentIndex]
            }
        })
    },
    handleEvents: function() {
         const cdWidth = cd.offsetWidth;
         const cdThumbAnimate = cdThumb.animate([
             { transform:'rotate(360deg)'}
         ], {
             duration: 10000,
             iterations: Infinity,
         });
         
         cdThumbAnimate.pause()
        document.onscroll = function() {
           
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newWidth = cdWidth - scrollTop ;
            cd.style.width = newWidth > 0 ? newWidth + 'px' : 0;
            cd.style.opacity = newWidth / cdWidth;
        };
        playbtn.onclick = function() {
           if(app.isPlaying) {
               audio.pause();
           }else{
              audio.play();
           }
        }
        // khi chạy bài hát
        audio.onplay = function() {
        app.isPlaying = true;
        player.classList.add('playing');
        cdThumbAnimate.play();
        }
        // khi dừng bài hát
        audio.onpause = function() {
            app.isPlaying = false;
            player.classList.remove('playing');
            cdThumbAnimate.pause()
        }
        // Tiến độ bài hát
        audio.ontimeupdate = function() {
            if(audio.duration) {
                const progressPrecent = Math.floor((audio.currentTime / audio.duration )* 100);
                progress.value = progressPrecent;
            
            }
        };
        // Khi tua bài 
        progress.oninput = function (e) {
            const seekTime = (audio.duration / 100) * e.target.value;
            audio.currentTime = seekTime;
          };
        // khi next bài hát
        nextBtn.onclick = function() {
            if(app.isRandom) {
                app.playRandomSongs()
            }else{
                app.nextSong();
            }

            audio.play();
            app.render();
            app.srcollToActiveSong()

        };
        // khi lùi bài hát
        prevBtn.onclick = function() {
            if(app.isRandom) {
                app.playRandomSongs()
            }else{
                app.prevSong();
            }
            audio.play();
            app.render();
            app.srcollToActiveSong();
        };
        // khi sử dụng ramdom bài hát
        randomBtn.onclick = function(event) {
            app.isRandom = !app.isRandom;
            app.setCofig('isRandom', app.isRandom)
            randomBtn.classList.toggle("active", app.isRandom);
        };
        // khi sử dụng để lặp lại bài hát
        repeatBtn.onclick = function(event) {
            app.isRepeat = !app.isRepeat
            app.setCofig('isRepeat', app.isRepeat)
            
            repeatBtn.classList.toggle("active", app.isRepeat);
            
        }
        


        // khi kết thúc sẽ tự nhảy qua bài khác
        audio.onended = function() {
            if(app.isRepeat) {
                audio.play()
            }else{
                nextBtn.click()
            }
        };
        playlist.onclick = function(e) {
            const songNode =e.target.closest('.song:not(.active)') 
            const optionsNode = e.target.closest('.options')
            if( songNode || optionsNode ) {
               // xu ly khi click vao song
                if(songNode) {
                    //$('.song.active').classList.remove('active')
                   app.currentIndex = Number(songNode.dataset.index)
                    //songNode.classList.add('active')             
                    //_this.currenIndex = songNode.dataset.index//.getAttribute('data-index')
                    app.loadCurrentSongs()
                    app.render()
                    audio.play()
        };
                if(optionsNode){

                }
    }
}
     },
     loadCurrentSongs: function() {
        
        heading.textContent = this.currentSong.name,
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
    
    },
   
    nextSong: function() {
        this.currentIndex++;
        if(this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        };
        this.loadCurrentSongs()
    },
    prevSong: function() {
        this.currentIndex--;
        if(this.currentIndex < 0) {
            this.currentIndex = this.songs.length -1;
        };
        this.loadCurrentSongs()
    },
    playRandomSongs: function() {
       
        let newIndex
        do{
            newIndex = Math.floor(Math.random() * this.songs.length);
            
        }while(newIndex === this.currentIndex || this.arrayIndex.includes(newIndex))
        if(this.arrayIndex.length === this.songs.length -1) {
            this.arrayIndex = []
        }
        this.arrayIndex.push(newIndex);
        this.currentIndex = newIndex
       
        this.loadCurrentSongs()
      
        
    },
    srcollToActiveSong: function() {
        $('.song.active').scrollIntoView({
            behavior: 'smooth',
            block: 'end',
        })
    },
    loadconfig: function(){
        app.setCofig('isRandom', app.isRandom)
        app.setCofig('isRepeat', app.isRepeat)
    },
    start: function() {
        this.loadconfig()
        this.defineProperties();
        this.handleEvents();
        this.loadCurrentSongs();
        this.render();
        randomBtn.classList.toggle("active", app.isRandom);
        repeatBtn.classList.toggle("active", app.isRepeat);
    }


};
app.start();
