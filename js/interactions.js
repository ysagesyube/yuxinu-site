/* YUXINU — interactions: reveals, parallax, counters, nav, menu, form
   Scroll-based (no IntersectionObserver) for maximum robustness. */
(function(){
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let revealEls=[], parallaxEls=[], counterEls=[];

  function animateCount(el){
    const to=parseFloat(el.getAttribute("data-to")), dur=1400, t0=performance.now();
    const pre=el.getAttribute("data-pre")||"", suf=el.getAttribute("data-suf")||"";
    (function frame(t){
      const p=Math.min(1,(t-t0)/dur), e=1-Math.pow(1-p,3);
      el.textContent=pre+Math.round(to*e)+suf;
      if(p<1) requestAnimationFrame(frame);
    })(t0);
  }

  function update(){
    const vh=window.innerHeight, y=window.scrollY||window.pageYOffset;
    const nav=document.querySelector(".nav");
    if(nav){ if(y>40){nav.classList.add("nav-solid");nav.classList.remove("nav-top");} else {nav.classList.add("nav-top");nav.classList.remove("nav-solid");} }
    // active nav link
    let current="";
    document.querySelectorAll("section[id]").forEach(sec=>{
      const r=sec.getBoundingClientRect();
      if(r.top<=vh*0.42 && r.bottom>vh*0.42) current=sec.id;
    });
    const navLinks=document.querySelectorAll('.nav-links a[href^="#"]');
    navLinks.forEach(a=>a.classList.toggle("active", a.getAttribute("href")==="#"+current));

    const fab=document.querySelector(".fab-contact");
    if(fab) fab.classList.toggle("show", y>vh*0.6 && current!=="contato");

    const snakeRail=document.querySelector(".snake-rail");
    if(snakeRail){
      const hero=document.querySelector(".hero");
      if(hero) snakeRail.classList.toggle("show", y > hero.offsetHeight*0.85);
      const snakeTrack=snakeRail.querySelector(".snake-rail-track");
      const trackH=snakeTrack.offsetHeight, railH=snakeRail.offsetHeight;
      const fade=80, startY=fade+10;
      const endY=Math.max(startY, railH-fade-trackH);
      const travel=endY-startY;
      const maxScroll=Math.max(1, document.documentElement.scrollHeight-vh);
      const pct=Math.min(1, Math.max(0, y/maxScroll));
      snakeTrack.style.transform="translate3d(0,"+(startY+pct*travel).toFixed(1)+"px,0)";
    }

    for(let i=revealEls.length-1;i>=0;i--){
      const el=revealEls[i], r=el.getBoundingClientRect();
      if(r.top < vh*0.90 && r.bottom > 0){ el.classList.add("in"); revealEls.splice(i,1); }
    }
    for(let i=counterEls.length-1;i>=0;i--){
      const el=counterEls[i], r=el.getBoundingClientRect();
      if(r.top < vh*0.85 && r.bottom > 0){ animateCount(el); counterEls.splice(i,1); }
    }
    if(!reduce){
      for(const el of parallaxEls){
        const speed=parseFloat(el.getAttribute("data-parallax"))||0.1;
        const rect=el.parentElement.getBoundingClientRect();
        const offset=(rect.top+rect.height/2-vh/2);
        el.style.transform="translate3d(0,"+(-offset*speed).toFixed(1)+"px,0)";
      }
    }
  }

  let ticking=false;
  function onScroll(){ if(!ticking){ requestAnimationFrame(()=>{update();ticking=false;}); ticking=true; } }

  function initMenu(){
    const burger=document.querySelector(".burger"), menu=document.querySelector(".mobile-menu");
    if(!burger||!menu) return;
    const close=()=>{ menu.classList.remove("open"); document.body.classList.remove("menu-open"); burger.setAttribute("aria-expanded","false"); };
    burger.addEventListener("click",()=>{ const o=menu.classList.toggle("open"); document.body.classList.toggle("menu-open",o); burger.setAttribute("aria-expanded",o?"true":"false"); });
    menu.querySelectorAll("a").forEach(a=>a.addEventListener("click",close));
    menu.querySelectorAll(".lang button").forEach(b=>b.addEventListener("click",close));
    window.addEventListener("keydown",e=>{ if(e.key==="Escape") close(); });
  }

  function initForm(){
    const form=document.querySelector("#contact-form");
    if(!form) return;
    form.addEventListener("submit",e=>{
      e.preventDefault();
      const lang=window.__yxLang||"pt";
      const dict=(window.YuxinuI18N&&window.YuxinuI18N.dict[lang])||{};
      const status=form.querySelector(".form-status");
      const submitBtn=form.querySelector(".submit");
      if(submitBtn) submitBtn.disabled=true;
      const body=new URLSearchParams(new FormData(form)).toString();
      fetch("/", { method:"POST", headers:{"Content-Type":"application/x-www-form-urlencoded"}, body })
        .then(res=>{
          if(!res.ok) throw new Error("submit failed: "+res.status);
          if(status) status.textContent=dict["form.ok"]||"";
          form.reset();
        })
        .catch(()=>{
          if(status) status.textContent=dict["form.err"]||"";
        })
        .finally(()=>{
          if(submitBtn) submitBtn.disabled=false;
        });
    });
  }

  function boot(){
    revealEls=[...document.querySelectorAll(".reveal")];
    parallaxEls=[...document.querySelectorAll("[data-parallax]")];
    counterEls=[...document.querySelectorAll("[data-to]")];
    if(reduce){ revealEls.forEach(e=>e.classList.add("in")); revealEls=[];
      counterEls.forEach(el=>el.textContent=(el.getAttribute("data-pre")||"")+el.getAttribute("data-to")+(el.getAttribute("data-suf")||"")); counterEls=[]; }
    initMenu(); initForm();
    window.addEventListener("scroll",onScroll,{passive:true});
    window.addEventListener("resize",onScroll,{passive:true});
    update();
    // safety passes (fonts/layout settling, environments without scroll events)
    setTimeout(update,150); setTimeout(update,600);
    window.addEventListener("load",()=>{ update(); setTimeout(update,200); });
  }
  if(document.readyState!=="loading") boot(); else document.addEventListener("DOMContentLoaded",boot);
})();
