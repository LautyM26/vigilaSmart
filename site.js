/* Comportamiento común a todas las páginas (Inicio, Cámaras, Instalación). */

/* Con movimiento reducido también hay que pausar el video: el reset de CSS
   solo alcanza animaciones y transiciones. En pausa, queda el primer cuadro. */
(function(){
  var q=window.matchMedia&&window.matchMedia('(prefers-reduced-motion:reduce)'),
      v=document.querySelector('video.art');
  if(!q||!v)return;
  function sync(){ if(q.matches){v.pause();}
                   else{var p=v.play();if(p)p.catch(function(){});} }
  sync();
  q.addEventListener ? q.addEventListener('change',sync) : q.addListener(sync);
})();

/* El año del pie se mantiene al día solo; el HTML trae 2026 por si no corre JS. */
(function(){
  var year=document.getElementById('year');
  if(year)year.textContent=new Date().getFullYear();
})();

/* En celular el menú es un checkbox: al tocar un link se cierra el panel. */
(function(){
  var toggle=document.getElementById('nav-open');
  if(!toggle)return;
  document.querySelectorAll('.navpanel a').forEach(function(a){
    a.addEventListener('click',function(){toggle.checked=false;});
  });
  /* Escape cierra el panel abierto */
  document.addEventListener('keydown',function(e){
    if(e.key==='Escape'&&toggle.checked)toggle.checked=false;
  });
})();
