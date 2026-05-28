function toggleModal(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.toggle('open');
}

function closeModalOutside(e, id) {
  if (e.target.id === id) toggleModal(id);
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.open').forEach(m => m.classList.remove('open'));
  }
});
