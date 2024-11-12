// eslint-disable-next-line react/prop-types
function Modal({ modalIsOpen, setIsOpen }) {
  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    // subtitle.style.color = '#f00';
  }

  function closeModal() {
    setIsOpen(false);
  }

  return <div>Modal</div>;
}

export default Modal;
