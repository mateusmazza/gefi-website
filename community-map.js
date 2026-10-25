/* Public founding-member profiles only; application responses never enter this map. */
(() => {
  const svg = document.querySelector('#community-map');
  const source = document.querySelector('#community-member-data');
  if (!svg || !source) return;
  const members = JSON.parse(source.textContent);
  const menu = document.querySelector('#member-location');
  const pins = document.querySelector('#map-pins');
  const canvas = document.querySelector('.map-canvas');
  const popup = document.querySelector('#member-popup');
  const ns = 'http://www.w3.org/2000/svg';
  const world = { x: 0, y: 0, width: 1080, height: 435 };
  let view = { ...world };
  let activeMember = null;
  let placements = [];
  const locations = [];
  for (const member of members) {
    let location = locations.find(item => item.id === member.location);
    if (!location) {
      location = { id: member.location, label: `${member.city}, ${member.country}`, x: (member.longitude + 180) * 3, y: (85 - member.latitude) * 3, members: [] };
      locations.push(location);
    }
    location.members.push(member);
  }
  locations.sort((a, b) => a.label.localeCompare(b.label));
  for (const location of locations) {
    const option = document.createElement('option');
    option.value = location.id;
    option.textContent = `${location.label} (${location.members.length})`;
    menu.append(option);
  }
  function node(tag, attributes) {
    const element = document.createElementNS(ns, tag);
    for (const [key, value] of Object.entries(attributes)) element.setAttribute(key, value);
    return element;
  }
  function closePopup(restoreFocus = false) {
    const previous = activeMember;
    activeMember = null;
    popup.hidden = true;
    for (const pin of pins.querySelectorAll('.map-pin')) {
      pin.classList.remove('is-selected');
      pin.setAttribute('aria-expanded', 'false');
    }
    if (restoreFocus && previous) pins.querySelector(`[data-member="${previous.id}"]`)?.focus();
  }
  function positionPopup() {
    if (!activeMember) return;
    const placement = placements.find(p => p.member.id === activeMember.id);
    if (!placement) { closePopup(); return; }
    const width = popup.offsetWidth;
    const height = popup.offsetHeight;
    const left = Math.max(10, Math.min(canvas.clientWidth - width - 10, placement.px - width / 2));
    let top = placement.py - height - 24;
    if (top < 10) top = placement.py + 26;
    top = Math.max(10, Math.min(canvas.clientHeight - height - 10, top));
    popup.style.left = `${left}px`;
    popup.style.top = `${top}px`;
  }
  function openPopup(member, keyboard) {
    activeMember = member;
    popup.replaceChildren();
    popup.setAttribute('aria-label', member.name);
    const close = document.createElement('button');
    close.type = 'button';
    close.className = 'popup-close';
    close.setAttribute('aria-label', 'Close member profile');
    close.textContent = '×';
    close.addEventListener('click', () => closePopup(true));
    const image = document.createElement('img');
    image.src = member.image;
    image.alt = member.name;
    image.width = 76;
    image.height = 76;
    const name = document.createElement('a');
    name.href = member.profile;
    name.className = 'popup-name';
    name.textContent = member.name;
    const institution = document.createElement('p');
    institution.textContent = member.institution;
    const city = document.createElement('p');
    city.className = 'popup-city';
    city.textContent = `${member.city}, ${member.country}`;
    const tag = document.createElement('span');
    tag.className = 'founder-tag';
    tag.textContent = member.tag;
    popup.append(close, image, name, institution, city, tag);
    const colocated = locations.find(location => location.id === member.location).members;
    if (colocated.length > 1) {
      const label = document.createElement('label');
      label.className = 'popup-colocated-label';
      label.htmlFor = 'colocated-member';
      label.textContent = `${colocated.length} members at this location`;
      const picker = document.createElement('select');
      picker.id = 'colocated-member';
      for (const person of colocated) {
        const option = document.createElement('option');
        option.value = person.id;
        option.textContent = person.name;
        picker.append(option);
      }
      picker.value = member.id;
      picker.addEventListener('change', () => {
        openPopup(members.find(person => person.id === picker.value), false);
        popup.querySelector('select')?.focus();
      });
      popup.append(label, picker);
    }
    popup.hidden = false;
    for (const pin of pins.querySelectorAll('.map-pin')) {
      const active = pin.dataset.member === member.id;
      pin.classList.toggle('is-selected', active);
      pin.setAttribute('aria-expanded', String(active));
    }
    positionPopup();
    if (keyboard) close.focus();
  }
  function draw() {
    const rect = svg.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const height = view.width * rect.height / rect.width;
    view.y += (view.height - height) / 2;
    view.height = height;
    svg.setAttribute('viewBox', `${view.x} ${view.y} ${view.width} ${view.height}`);
    const scale = rect.width / view.width;
    placements = [];
    pins.replaceChildren();
    for (const member of members) {
      const x = (member.longitude + 180) * 3;
      const y = (85 - member.latitude) * 3;
      if (x < view.x || x > view.x + view.width || y < view.y || y > view.y + view.height) continue;
      placements.push({member,x,y,px:(x-view.x)*scale,py:(y-view.y)*scale});
      const active = activeMember?.id === member.id;
      // Every pin tip sits at the exact institutional coordinate, including overlaps.
      const pin = node('g', {
        transform:`translate(${x} ${y}) scale(${1/scale})`,
        class:`map-pin${active?' is-selected':''}`,role:'button',tabindex:'0',
        'aria-label':`${member.name} — ${member.institution}, ${member.city}`,
        'aria-expanded':String(active),'aria-controls':'member-popup','aria-haspopup':'dialog',
        'data-member':member.id,'data-longitude':member.longitude,'data-latitude':member.latitude
      });
      const tooltip = node('title', {});
      tooltip.textContent = `${member.name} · ${member.city}`;
      pin.append(tooltip,node('path',{
        d:'M0 0 C-3 -5 -12 -12 -12 -20 A12 12 0 1 1 12 -20 C12 -12 3 -5 0 0Z',class:'map-pin-shape'
      }),node('circle',{cx:0,cy:-23,r:3,fill:'#fff','aria-hidden':'true'}),node('path',{
        d:'M-5 -15 Q-5 -19 0 -19 Q5 -19 5 -15 Z',fill:'#fff','aria-hidden':'true'
      }));
      const colocated = locations.find(location => location.id === member.location).members;
      if (colocated.length > 1 && colocated.at(-1).id === member.id) {
        pin.append(node('circle',{cx:11,cy:-31,r:8,fill:'#333f36',stroke:'#fff','stroke-width':1,'aria-hidden':'true'}));
        const count = node('text',{x:11,y:-31,'text-anchor':'middle','dominant-baseline':'central','aria-hidden':'true'});
        count.textContent = colocated.length;
        pin.append(count);
      }
      pin.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openPopup(member, true); }
      });
      pins.append(pin);
    }
    document.querySelector('#map-zoom-in').disabled = view.width <= 3;
    document.querySelector('#map-zoom-out').disabled = view.width >= world.width;
    positionPopup();
  }
  function setCamera(width, centerX, centerY) {
    const rect = svg.getBoundingClientRect();
    width = Math.max(3,Math.min(world.width,width));
    const height = width * rect.height / rect.width;
    view = {x:centerX-width/2,y:centerY-height/2,width,height};
    draw();
  }
  function zoomAt(factor, px, py) {
    const rect = svg.getBoundingClientRect();
    px ??= rect.width/2;
    py ??= rect.height/2;
    const x = view.x + px/rect.width*view.width;
    const y = view.y + py/rect.height*view.height;
    const width = Math.max(3,Math.min(world.width,view.width*factor));
    const height = width*rect.height/rect.width;
    view = {x:x-px/rect.width*width,y:y-py/rect.height*height,width,height};
    draw();
  }
  function reset() {
    closePopup();
    menu.value = 'overview';
    // Desktop fits the member locations with less polar space. Phones start closer
    // to the largest concentration, and the map can be dragged to every region.
    const rect = svg.getBoundingClientRect();
    const phone = rect.width < 600;
    setCamera(phone ? Math.min(310,350*rect.width/rect.height) : 920,phone ? 270 : 580,215);
  }
  menu.addEventListener('change', () => {
    closePopup();
    if (menu.value === 'overview') { reset(); return; }
    if (menu.value === 'all') {
      const rect = svg.getBoundingClientRect();
      const width = Math.min(1080,Math.max(920,350*rect.width/rect.height));
      setCamera(width,580,215);
      return;
    }
    const location = locations.find(item => item.id === menu.value);
    setCamera(svg.getBoundingClientRect().width < 600 ? 24 : 45,location.x,location.y);
  });
  document.querySelector('#map-zoom-in').addEventListener('click', () => zoomAt(.65));
  document.querySelector('#map-zoom-out').addEventListener('click', () => zoomAt(1/.65));
  document.querySelector('#map-reset').addEventListener('click', reset);
  svg.addEventListener('wheel', event => {
    event.preventDefault();
    const rect = svg.getBoundingClientRect();
    const delta = event.deltaY*(event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? rect.height : 1);
    zoomAt(Math.exp(Math.max(-100,Math.min(100,delta))*.003),event.clientX-rect.left,event.clientY-rect.top);
  },{passive:false});
  svg.addEventListener('dblclick', event => {
    event.preventDefault();
    const rect = svg.getBoundingClientRect();
    zoomAt(.5,event.clientX-rect.left,event.clientY-rect.top);
  });
  // Consume the compatibility click after pointerup. A popup may cover the tap
  // position, and that same gesture must never click its biography link.
  let suppressCompatibilityClick = false;
  canvas.addEventListener('pointerdown', () => { suppressCompatibilityClick=false; },true);
  canvas.addEventListener('click', event => {
    if (suppressCompatibilityClick && event.detail !== 0) {
      event.preventDefault();
      event.stopPropagation();
      suppressCompatibilityClick=false;
    }
  },true);
  const pointers = new Map();
  let gesture = null;
  let moved = false;
  let clickedMember = null;
  function beginGesture() {
    const points = [...pointers.values()];
    const rect = svg.getBoundingClientRect();
    const mid = points.length > 1 ? {x:(points[0].x+points[1].x)/2,y:(points[0].y+points[1].y)/2} : points[0];
    gesture = {view:{...view},mid,distance:points.length>1?Math.hypot(points[0].x-points[1].x,points[0].y-points[1].y):0,
      worldX:view.x+(mid.x-rect.left)/rect.width*view.width,worldY:view.y+(mid.y-rect.top)/rect.height*view.height};
  }
  svg.addEventListener('pointerdown', event => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    event.preventDefault();
    if (!pointers.size) {
      moved=false;
      clickedMember=event.target.closest('.map-pin')?.dataset.member || null;
    } else { moved=true; clickedMember=null; }
    pointers.set(event.pointerId,{x:event.clientX,y:event.clientY});
    svg.setPointerCapture(event.pointerId);
    beginGesture();
  });
  svg.addEventListener('pointermove', event => {
    if (!pointers.has(event.pointerId)) return;
    pointers.set(event.pointerId,{x:event.clientX,y:event.clientY});
    const points=[...pointers.values()];
    const rect=svg.getBoundingClientRect();
    if (points.length > 1) {
      moved=true;
      closePopup();
      const mid={x:(points[0].x+points[1].x)/2,y:(points[0].y+points[1].y)/2};
      const distance=Math.hypot(points[0].x-points[1].x,points[0].y-points[1].y);
      const width=Math.max(3,Math.min(1080,gesture.view.width*gesture.distance/Math.max(1,distance)));
      const height=width*rect.height/rect.width;
      view={x:gesture.worldX-(mid.x-rect.left)/rect.width*width,y:gesture.worldY-(mid.y-rect.top)/rect.height*height,width,height};
    } else {
      const dx=points[0].x-gesture.mid.x,dy=points[0].y-gesture.mid.y;
      if (!moved && Math.hypot(dx,dy)<4) return;
      if (!moved) closePopup();
      moved=true;
      view={...gesture.view,x:gesture.view.x-dx*gesture.view.width/rect.width,y:gesture.view.y-dy*gesture.view.height/rect.height};
    }
    canvas.classList.add('is-dragging');
    draw();
  });
  function endPointer(event) {
    if (!pointers.has(event.pointerId)) return;
    pointers.delete(event.pointerId);
    if (svg.hasPointerCapture(event.pointerId)) svg.releasePointerCapture(event.pointerId);
    if (pointers.size) { beginGesture(); return; }
    canvas.classList.remove('is-dragging');
    suppressCompatibilityClick=true;
    if (!moved && event.type !== 'pointercancel') {
      if (clickedMember) openPopup(members.find(member=>member.id===clickedMember),false);
      else closePopup();
    }
    gesture=null;
  }
  svg.addEventListener('pointerup',endPointer);
  svg.addEventListener('pointercancel',endPointer);
  svg.addEventListener('keydown', event => {
    if (['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.key)) {
      event.preventDefault();
      closePopup();
      const rect=svg.getBoundingClientRect();
      const dx=event.key==='ArrowLeft'?-70:event.key==='ArrowRight'?70:0;
      const dy=event.key==='ArrowUp'?-70:event.key==='ArrowDown'?70:0;
      view.x+=dx*view.width/rect.width;view.y+=dy*view.height/rect.height;draw();
    } else if (event.key==='+' || event.key==='=') {event.preventDefault();zoomAt(.65);}
    else if (event.key==='-') {event.preventDefault();zoomAt(1/.65);}
  });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && activeMember) closePopup(true); });
  new ResizeObserver(draw).observe(svg);
  reset();
})();
