const form = document.querySelector("#updateForm")
    form.addEventListener("change", function () {
        console.log("changed")
      const updateBtn = document.querySelector("#submit")
      updateBtn.removeAttribute("disabled")
    })