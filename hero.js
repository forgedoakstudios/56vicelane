// 56ViceLane — Auto Hero Image
// Upload to GitHub root. Works on all article pages automatically.
(function(){
  const slug = location.pathname.split('/').pop().replace('.html','').toLowerCase();
  let img = 'gta6-hero.png';
  if(/gta5|ragemp|fivem|switch2|gta-gta5|gta5-/.test(slug)) img='gta5-hero.png';
  else if(/gpu|pc-build|amd|nvidia|frame-gen|extrapolation|samsung|prompt-inject|tech|rtx|hardware/.test(slug)) img='tech-hero.png';
  else if(/online|heist|shark|gtao/.test(slug)) img='gtao-hero.png';
  const hero=document.querySelector('.article-hero');
  if(hero) hero.style.backgroundImage="url('/images/"+img+"')";
  const og=document.querySelector('meta[property="og:image"]');
  if(og) og.content='https://56vicelane.com/images/'+img;
})();
