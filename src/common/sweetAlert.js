const SweetAlert = props => {
  return Swal.fire({
    title: "Are you sure?",
    text: props.text,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: props.buttonText,
  }).then(result => {
    if (result.value) {
      Swal.fire("Deleted!", "Your file has been deleted.", "success");
    }
  });
};

export default SweetAlert;
