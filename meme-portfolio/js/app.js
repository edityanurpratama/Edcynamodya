document.addEventListener('DOMContentLoaded', () => {
    fetch('data/memes.json')
        .then(response => response.json())
        .then(data => displayMemes(data))
        .catch(err => console.error('Failed to load memes:', err));

    function displayMemes(memes) {
        const gallery = document.getElementById('meme-gallery');
        memes.forEach(meme => {
            const item = document.createElement('div');
            item.className = 'meme-item';
            let media;
            if (meme.type === 'image') {
                media = document.createElement('img');
                media.src = meme.src;
                media.alt = meme.title;
            } else if (meme.type === 'video') {
                media = document.createElement('video');
                media.src = meme.src;
                media.controls = true;
            }
            item.appendChild(media);
            const title = document.createElement('div');
            title.className = 'meme-title';
            title.textContent = meme.title;
            item.appendChild(title);
            item.addEventListener('click', () => {
                document.getElementById('click-sound').play();
            });
            gallery.appendChild(item);
        });
    }
});
