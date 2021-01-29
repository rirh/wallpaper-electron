onmessage = e => {
  const url = e.data;
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
      console.log(this.responseText);
    }
  });

  xhr.open("POST", url);
  xhr.setRequestHeader("content-type", "application/json");

  xhr.send(data);
};
