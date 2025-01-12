document.getElementById('slider-left').addEventListener('click', function () {
    moveSlider(false);
});

document.getElementById('slider-right').addEventListener('click', function (e) {
    moveSlider(true);
});

function moveSlider(isRight) {
    const image = document.getElementById('big-image');

    let temp = image.src.split(".");
    let imageNumber = parseInt(temp[temp.length - 2]);

    if (isRight) {
        imageNumber++;
    } else {
        imageNumber--;
    }

    const src = `./Images/Image.${(imageNumber + 4) % 4}.jpg`;
    image.setAttribute('src', src);
}