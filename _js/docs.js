docReady(function() {
    function go() {
        var iframe = document.querySelector('#teaser');
        if (!iframe) {
            setTimeout(go, 1000)
            return
        }

        var player = new Vimeo.Player(iframe);

        player.on('play', function () {
            document.body.classList.add('playing')
        });
        
        player.on('pause', function() {
            document.body.classList.remove('playing')
        })

    }
    go()
})