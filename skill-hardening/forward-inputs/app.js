document.querySelector('#menu').addEventListener('click',()=>{
  const panel=document.querySelector('#menu-panel');panel.hidden=!panel.hidden;
  document.querySelector('#menu').setAttribute('aria-expanded',String(!panel.hidden));
});
// The archived application referred to a separate renderer worker, not supplied here.
//# sourceMappingURL=app.js.map
