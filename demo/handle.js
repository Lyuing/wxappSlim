!(async ()=>{

  const size = 20;
  // const links = await getData();
  getData().then(links=>{
    let point = 0;
    setTabs(links);
    setItems(links);
    $('video').attr('src', links[point])

    $('body').on('click', '.tabs', function(){
      let $ele = $(this)
      let n = $ele.data('index')
      setItems(links, n)
    }).on('click', '.item', function(){
      let $ele = $(this)
      let link = $ele.data('value')
      let key = $ele.data('key')
      point = key
      $('video').attr('src', links[point])
    })

    $('video').on('ended', function(){
      console.log('end')
      point ++
      $('video').attr('src', links[point])
    })
  })

  function getData(){
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

  function setTabs(links){
    let cur = size
    while(cur<=links.length){
      let str = `<p class="tabs" data-index="${parseInt(cur / size)}">${cur}</p>`
      $('.horizen').append(str)
      cur+=size
    }
  }

  function setItems(links, n=1){
    let min = size * (n-1)
    let max = size * (n-1) + size
    let cur = links.slice(min,max)
    let str = ``
    cur.forEach((i, j)=>{
      str+= `<p class="item" data-value="${i}" data-key="${j+min}">${j+min+1}.${i}</p>`
    })
    $('.select').html(str)
  }
})()