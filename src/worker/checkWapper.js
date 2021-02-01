let timer;
onmessage = e => {
  const { url, is_random, selectedtime } = e.data;
  console.log(url, is_random, selectedtime);
  const [type, time] = selectedtime.split("-");
  if (time) clearTimeout(timer);
  timer = setTimeout(() => {
    if (type === "net") {
      fetch_image(url);
    } else {
      postMessage(selectedtime);
    }
  }, Number(time));
};

function fetch_image(url) {
  const data = JSON.stringify({
    options: {
      method: "get",
      data: {
        type: 1,
        count: 1
      },
      dataType: "json"
    }
  });

  const xhr = new XMLHttpRequest();
  xhr.withCredentials = true;
  xhr.addEventListener("readystatechange", function() {
    if (this.readyState === this.DONE) {
      const data = JSON.parse(this.responseText);
      data.largeImageURL && postMessage(data.largeImageURL);
    } else {
      setTimeout(() => {
        fetch_image();
      }, 1000 * 60 * 5);
    }
  });
  xhr.open("POST", url);
  xhr.setRequestHeader("content-type", "application/json");
  xhr.send(data);
}
