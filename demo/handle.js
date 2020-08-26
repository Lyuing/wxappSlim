class KS {
  constructor (){
    this.point = 0    // 当前激活 索引
    this.size = 20;   // 每页容量
    this.links = []   // 数据
    self = this
  }
  async init(){
    this.links = await this.getData();
    this.setTabs();
    this.setItems();
    this.playControl()
    $('body').on('click', '.tabs', function(){
      // 导航栏
      let $ele = $(this)
      let n = $ele.data('index')
      self.setItems(n)
    }).on('click', '.item', function(){
      // 标题
      let $ele = $(this)
      let key = $ele.data('key')
      self.point = key
      self.playControl()
    })

    $('video').on('ended', function(){
      // 结束
      console.log('end')
      self.point ++
      if(self.point%self.size === 0){
        self.setItems(self.point/self.size + 1)
      }
      self.playControl()
    })
  }
  getData(){
    return new Promise((resolve, reject)=>{
      $.get('http://49.232.9.114/index/player',function(res){
        // console.log(res)
        let links = []
        let options = res.match(/<option data-id[^<]+<\/option>/g);
        options.map(i=>{
          let value = i.match(/data-src="([^"]+)"/)
          links.push(value[1])
        })
        // console.log(links)
        resolve(links)
      })
    })
  }
  setTabs(){
    let cur = this.size
    while(cur<=this.links.length){
      let str = `<p class="tabs" data-index="${parseInt(cur / this.size)}">${cur}</p>`
      $('.horizen').append(str)
      cur+=this.size
    }
  }
  setItems(n=1){
    let min = this.size * (n-1)
    let max = this.size * (n-1) + this.size
    let cur = this.links.slice(min,max)
    let str = ``
    cur.forEach((i, j)=>{
      // str+= `<p class="item" data-value="${i}" data-key="${j+min}">${j+min+1}.${i}</p>`
      str+= `<p class="item" data-key="${j+min}">${j+min+1}.${i}</p>`
    })
    $('.select').html(str)
    this.markCurrent(this.point)
  }
  playControl(){
    // 标注
    this.markCurrent(this.point)
    let url = $('video').attr('src')
    if(url != this.links[this.point]){
      $('video').attr('src', this.links[this.point])
    }
  }
  markCurrent(){
    let point = this.point
    let page = parseInt(point / this.size) + 1
    $(`.tabs.current`).removeClass('current')
    $(`.tabs[data-index=${page}]`).addClass('current')
    $(`.item.current`).removeClass('current')
    $(`.item[data-key=${point}]`).addClass('current')
  }
}

!(()=>{
  new KS().init()
})()