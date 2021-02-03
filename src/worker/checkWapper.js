let timer;
onmessage = e => {
  const { url, is_random, selectedtime } = e.data;
  console.log(url, is_random, selectedtime);
  const [type, time] = selectedtime.split("-");
  if (time) clearTimeout(timer);
  timer = setTimeout(() => {
    if (type === "net") {
      fetch_image(url, selectedtime);
    } else {
      postMessage(selectedtime);
    }
  }, Number(time));
  // }, 1000 * 10);
};

function fetch_image(url, selectedtime) {
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
  console.log("worker time:", selectedtime);

  const xhr = new XMLHttpRequest();
  xhr.withCredentials = true;
  xhr.addEventListener("readystatechange", function() {
    if (this.readyState === this.DONE) {
      const data = JSON.parse(this.responseText);
      data.largeImageURL && postMessage(data.largeImageURL);
    } else {
      setTimeout(() => {
        fetch_image();
      }, 1000 * 60 * 1);
    }
  });
  xhr.open("POST", url);
  xhr.setRequestHeader("content-type", "application/json");
  xhr.send(data);
}
