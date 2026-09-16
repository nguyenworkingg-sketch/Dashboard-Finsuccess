(()=>{
'use strict';
const VERSION='2026-09-16-master-plantpicker-fix';
const $=id=>document.getElementById(id);
const f=(x,d=1)=>x==null||!isFinite(x)?'—':(+x).toFixed(d);
const pc=x=>x==null||!isFinite(x)?'—':(x*100).toFixed(1)+'%';
const ix=x=>x==null||!isFinite(x)?'—':(+x).toFixed(2)+'x';
const yy=x=>x==null||!isFinite(x)?'—':((x-1)*100).toFixed(0)+'%';
const cl=x=>x>=1.05?'xanh':x>=.95?'xam':x>=.8?'vang':'do';
const opt=y=>({responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'bottom'}},scales:{x:{grid:{display:false}},y:{title:{display:true,text:y},grid:{color:'#eef0f4'}}}});
const dedupe=(arr,keyfn)=>{const m=new Map();for(const x of arr)m.set(keyfn(x),x);return [...m.values()]};
function injectMasterNav(){
  if(document.querySelector('.reeMasterNav'))return;
  const st=document.createElement('style');st.textContent=`
  .reeMasterNav{position:sticky;top:0;z-index:99999;background:#fff;border-bottom:1px solid #e5e7ef;padding:9px 18px;display:flex;gap:8px;align-items:center;font-family:Inter,system-ui,sans-serif;box-shadow:0 3px 14px rgba(32,42,131,.06)}
  .reeMasterBrand{font-weight:950;color:#202a83;margin-right:auto}.reeMasterBrand b{color:#f4b82d}.reeMasterNav a{text-decoration:none;padding:8px 13px;border:1px solid #e5e7ef;border-radius:999px;color:#41465a;font-size:12px;font-weight:800}.reeMasterNav a.active{background:#202a83;color:#fff;border-color:#202a83}
  .plant-picker{position:relative;min-width:280px;z-index:120}.plant-picker input{width:100%;padding:11px 40px 11px 13px;border:1px solid #dfe3eb;border-radius:12px;background:#fff;font:inherit;color:#202430;outline:none}.plant-picker input:focus{border-color:#3340a0;box-shadow:0 0 0 3px rgba(51,64,160,.10)}
  .plant-picker .pp-arrow{position:absolute;right:13px;top:11px;color:#697386;pointer-events:none;font-size:14px}.plant-picker .pp-list{display:none;position:absolute;left:0;right:0;top:calc(100% + 6px);max-height:330px;overflow-y:auto;overscroll-behavior:contain;background:#fff;border:1px solid #dfe3eb;border-radius:12px;box-shadow:0 14px 38px rgba(22,31,62,.16);padding:6px;z-index:9999}.plant-picker.open .pp-list{display:block}
  .plant-picker .pp-item{width:100%;text-align:left;border:0;background:#fff;color:#2f3548;border-radius:8px;padding:9px 10px;cursor:pointer;font:inherit;font-size:13px;line-height:1.35}.plant-picker .pp-item:hover,.plant-picker .pp-item.active{background:#eef1ff;color:#202a83;font-weight:800}.plant-picker .pp-empty{padding:12px;color:#7b8090;font-size:12px}.plant-data-note{margin:12px 0 0;padding:12px 14px;border-radius:12px;background:#fff7e8;border:1px solid #f1dfb5;color:#6e5217;font-size:12px;line-height:1.55}
  @media(max-width:640px){.reeMasterNav{padding:8px;overflow:auto}.reeMasterBrand{display:none}.reeMasterNav a{white-space:nowrap;flex:1;text-align:center}.plant-picker{min-width:220px;width:100%}.plant-picker .pp-list{max-height:260px}}
  `;document.head.appendChild(st);
  const nav=document.createElement('div');nav.className='reeMasterNav';nav.innerHTML='<div class="reeMasterBrand">Fin<b>Success</b> · REE</div><a href="./" class="active">Thủy điện</a><a href="me.html">M&amp;E</a><a href="office.html">Văn phòng cho thuê</a>';document.body.insertBefore(nav,document.body.firstChild);
}
function cleanLegacy(){
  const cards=[...document.querySelectorAll('.kpi')];for(const c of cards){const t=c.querySelector('.ten')?.textContent||'';if(t.includes('Tác động LNST thủy điện Q3'))c.innerHTML='<div class="ten">Giá CGM tháng 7/2026</div><div class="so">1.250 đ/kWh</div><div class="diengiai">Giá điện là biến có thể bù một phần tác động từ sản lượng; cần đọc cùng thủy văn</div>';if(t.includes('Tác động LNST thủy điện FY26'))c.innerHTML='<div class="ten">Dữ liệu EVN thực tế</div><div class="so">Tới 31/08</div><div class="diengiai">Tháng 9 và Q4 là ước tính/chuẩn hóa, không phải actual</div>'}
  const e=$('earnings');if(e)e.innerHTML='<div class="luoi ba"><div class="the"><h3>Q3/26 — tín hiệu sản lượng</h3><div class="nhanxet">Chỉ số thủy văn danh mục hiện khoảng <b>0,84x so cùng kỳ</b>, cho thấy nền nước Q3 yếu hơn tại phần lớn exposure miền Trung/Tây Nguyên. Đây là chỉ báo khả năng phát điện, <b>không phải dự báo lợi nhuận</b>.</div></div><div class="the"><h3>Giá điện đang là biến bù</h3><div class="nhanxet">Giá CGM tháng 7/2026 khoảng <b>1.250 đồng/kWh</b>. Khi sản lượng giảm nhưng giá tăng, doanh thu/lợi nhuận có thể được bù một phần; cần ghép theo từng tháng.</div></div><div class="the"><h3>Ba biến cần theo dõi</h3><div class="nhanxet"><b>(1) Sản lượng điện thực tế, (2) CGM/CAN + Qc, (3) thủy văn Q4.</b> Chỉ khi ba biến cùng xác nhận mới nên nâng/hạ kỳ vọng KQKD thủy điện.</div></div></div><div class="note warn" style="margin-top:16px"><b>Đã bỏ ước tính LNST cơ học:</b> quan hệ giữa lưu lượng nước, sản lượng và lợi nhuận không tuyến tính vì còn phụ thuộc hợp đồng, điều độ và giá điện.</div>';
  const m=document.querySelector('.meta');if(m&&m.textContent.includes('THỦY ĐIỆN'))m.innerHTML='<b>REE — THỦY ĐIỆN</b><br>Cập nhật: 16/09/2026<br>FinSuccess | Dashboard nội bộ';
}
function err(msg){console.error(msg);document.querySelectorAll('.chartbox').forEach((el,i)=>{if(i<2)el.innerHTML='<div style="padding:28px;color:#c94848;font-weight:700">'+msg+'</div>'})}
try{
 injectMasterNav();cleanLegacy();
 if(typeof Chart==='undefined')throw new Error('Chart.js chưa tải được');
 if(typeof P==='undefined'||typeof O==='undefined'||typeof M==='undefined'||typeof R==='undefined')throw new Error('Thiếu dữ liệu dashboard');
 const Md=dedupe(M,x=>x[0]+'|'+x[1]);
 const Rd=dedupe(R,x=>x[0]+'|'+x[2]);
 if(!Md.length||!Rd.length)throw new Error('Dữ liệu hồ chưa nạp được');

 const portC=$('portfolioChart'),q3C=$('q3Chart'),expo=$('exposureCards'),weak=$('weakCards'),pt=$('plantTable');
 const rs=$('reservoirSelect'),rf=$('reservoirFullChart'),rq=$('reservoirFlowChart'),mf=$('monthFilter'),rg=$('regionFilter'),rt=$('reservoirTable');
 const ps=$('plantSelect'),pq=$('plantFlowChart'),pfu=$('plantFullChart'),pmt=$('plantMonthTable');

 if(portC)new Chart(portC,{type:'line',data:{labels:O.map(x=>x[0]),datasets:[{label:'Lượng nước về hồ so cùng kỳ',data:O.map(x=>x[1]),borderColor:'#202a83',backgroundColor:'#202a83',tension:.25},{label:'Mức đầy hồ so cùng kỳ',data:O.map(x=>x[2]),borderColor:'#f4b82d',backgroundColor:'#f4b82d',tension:.25}]},options:opt('Lần')});
 const top=[...P].sort((a,b)=>b.econ_mw-a.econ_mw).slice(0,12);
 if(q3C)new Chart(q3C,{type:'bar',data:{labels:top.map(x=>x.plant),datasets:[{label:'Chỉ số thủy văn Q3/26',data:top.map(x=>x.q3_water),backgroundColor:'#3340a0'}]},options:{...opt('Lần so cùng kỳ'),indexAxis:'y',plugins:{legend:{display:false}}}});
 const ex=[...P].sort((a,b)=>b.econ_mw-a.econ_mw).slice(0,6);
 if(expo)expo.innerHTML=ex.map(x=>`<div style="margin:12px 0"><div class="split"><b>${x.plant}</b><span>${f(x.econ_mw)} MW quy đổi</span></div><div class="nho">${x.company} · REE ${pc(x.ownership)} · hồ tham chiếu: ${x.mapping}</div><div class="bar"><i style="width:${Math.min(100,x.econ_mw/ex[0].econ_mw*100)}%"></i></div></div>`).join('');
 const wk=[...P].sort((a,b)=>a.q3_water-b.q3_water).slice(0,6);
 if(weak)weak.innerHTML=wk.map(x=>`<div style="margin:12px 0"><div class="split"><b>${x.plant}</b><span class="pill ${cl(x.q3_water)}">${ix(x.q3_water)}</span></div><div class="nho">${x.mapping} · độ phù hợp ${x.quality}/5 · ${f(x.econ_mw)} MW quy đổi</div></div>`).join('');
 if(pt)pt.innerHTML='<tr><th>Nhà máy</th><th>Công ty</th><th>Tỷ lệ kinh tế REE</th><th>MW quy đổi</th><th>Hồ tham chiếu</th><th>Độ phù hợp</th><th>T7</th><th>T8</th><th>T9 ước tính</th><th>Q3/26</th><th>FY26</th></tr>'+[...P].sort((a,b)=>b.econ_mw-a.econ_mw).map(x=>`<tr><td>${x.plant}</td><td>${x.company}</td><td>${pc(x.ownership)}</td><td>${f(x.econ_mw)}</td><td>${x.mapping}</td><td>${x.quality}/5</td><td>${ix(x.jul)}</td><td>${ix(x.aug)}</td><td>${ix(x.sep_est)}</td><td><span class="pill ${cl(x.q3_water)}">${ix(x.q3_water)}</span></td><td>${ix(x.fy_water)}</td></tr>`).join('');

 // R schema: [ym, region, reservoir, Htl, Hdbt, Hc, fullness, Qve, Qx, Qxt, Qxm, QveLY, QveIdx, coverage]
 const names=[...new Set(Rd.map(x=>x[2]))].sort((a,b)=>a.localeCompare(b,'vi'));
 if(rs){rs.innerHTML=names.map(x=>`<option>${x}</option>`).join('');if(names.includes('Thượng Kon Tum'))rs.value='Thượng Kon Tum'}
 let A,B;
 function rr(){
  if(!rs||!rf||!rq)return;
  const d=Rd.filter(x=>x[2]===rs.value).sort((a,b)=>a[0].localeCompare(b[0]));const l=d.map(x=>'T'+(+x[0].slice(5))+'/26');
  if(A)A.destroy();if(B)B.destroy();
  A=new Chart(rf,{type:'line',data:{labels:l,datasets:[{label:'Mức đầy hồ 2026',data:d.map(x=>x[6]==null?null:x[6]*100),borderColor:'#202a83',backgroundColor:'#202a83',tension:.25}]},options:opt('%')});
  B=new Chart(rq,{type:'line',data:{labels:l,datasets:[{label:'Lượng nước về hồ 2026',data:d.map(x=>x[7]),borderColor:'#202a83',backgroundColor:'#202a83',tension:.25},{label:'Lượng nước về hồ cùng kỳ 2025',data:d.map(x=>x[11]),borderColor:'#f4b82d',backgroundColor:'#f4b82d',tension:.25},{label:'Lượng nước qua tua-bin 2026',data:d.map(x=>x[10]),borderColor:'#198754',backgroundColor:'#198754',tension:.25}]},options:opt('m³/s')});
 }
 if(rs){rs.onchange=rr;rr()}
 const mos=[...new Set(Rd.map(x=>x[0]))].sort(),regs=[...new Set(Rd.map(x=>x[1]))].sort((a,b)=>a.localeCompare(b,'vi'));
 if(mf)mf.innerHTML='<option value="all">Tất cả</option>'+mos.map(x=>`<option>${x}</option>`).join('');
 if(rg)rg.innerHTML='<option value="all">Tất cả</option>'+regs.map(x=>`<option>${x}</option>`).join('');
 function tbl(){
  if(!rt||!mf||!rg)return;const d=Rd.filter(x=>(mf.value==='all'||x[0]===mf.value)&&(rg.value==='all'||x[1]===rg.value));
  rt.innerHTML='<tr><th>Tháng</th><th>Vùng</th><th>Hồ</th><th>Mực nước thực tế</th><th>MN dâng bình thường</th><th>Mực nước chết</th><th>Mức đầy</th><th>Nước về hồ</th><th>Tổng xả</th><th>Xả tràn</th><th>Nước qua tua-bin</th><th>Nước về hồ cùng kỳ</th><th>So cùng kỳ</th><th>Độ phủ</th></tr>'+d.map(x=>`<tr><td>${x[0]}</td><td>${x[1]}</td><td>${x[2]}</td><td>${f(x[3],2)}</td><td>${f(x[4],2)}</td><td>${f(x[5],2)}</td><td>${pc(x[6])}</td><td>${f(x[7])}</td><td>${f(x[8])}</td><td>${f(x[9])}</td><td>${f(x[10])}</td><td>${f(x[11])}</td><td>${x[12]==null?'—':`<span class="pill ${cl(x[12])}">${yy(x[12])}</span>`}</td><td>${pc(x[13])}</td></tr>`).join('')
 }
 if(mf)mf.onchange=tbl;if(rg)rg.onchange=tbl;tbl();

 // M schema: [ym, plant, basket, Htl, Hdbt, Hc, fullness, Qve, Qxm, coverage, fullnessLY, QveLY, QveIdx, fullnessIdx]
 const dataPlantNames=new Set(Md.map(x=>x[1]));
 const pnames=[];for(const x of P.map(x=>x.plant))if(!pnames.includes(x))pnames.push(x);for(const x of [...dataPlantNames].sort((a,b)=>a.localeCompare(b,'vi')))if(!pnames.includes(x))pnames.push(x);
 const fillNative=(sel)=>{if(!ps)return;ps.innerHTML=pnames.map(x=>`<option value="${x}">${x}</option>`).join('');if(sel&&pnames.includes(sel))ps.value=sel;else if(pnames.length)ps.value=pnames[0]};
 fillNative(pnames.includes('Thượng Kon Tum')?'Thượng Kon Tum':pnames[0]);
 let C,D;
 const flowBox=pq&&pq.parentElement,fullBox=pfu&&pfu.parentElement;
 function clearMissing(){document.querySelectorAll('.plant-data-note').forEach(x=>x.remove());if(pq)pq.style.display='';if(pfu)pfu.style.display=''}
 function showMissing(name){
   clearMissing();if(C){C.destroy();C=null}if(D){D.destroy();D=null}if(pq)pq.style.display='none';if(pfu)pfu.style.display='none';
   const meta=P.find(x=>x.plant===name);const txt=`<div class="plant-data-note"><b>${name}</b> vẫn thuộc danh mục REE nhưng hiện chưa có chuỗi dữ liệu hồ theo tháng trực tiếp trong bộ M. ${meta?`Hồ tham chiếu hiện dùng: <b>${meta.mapping}</b> · độ phù hợp ${meta.quality}/5.`:''} Không loại nhà máy này khỏi danh mục; chỉ không vẽ chart để tránh tạo dữ liệu giả.</div>`;
   if(flowBox)flowBox.insertAdjacentHTML('beforeend',txt);if(fullBox)fullBox.insertAdjacentHTML('beforeend',txt);
   if(pmt)pmt.innerHTML='<tr><th>Trạng thái dữ liệu</th></tr><tr><td>Chưa có monthly data trực tiếp cho nhà máy này trong bộ dữ liệu hiện tại.</td></tr>';
 }
 function pp(){
  if(!ps||!pq||!pfu||!pmt)return;const d=Md.filter(x=>x[1]===ps.value).sort((a,b)=>a[0].localeCompare(b[0]));
  if(!d.length){showMissing(ps.value);return}clearMissing();
  const l=d.map(x=>'T'+(+x[0].slice(5))+'/26');if(C)C.destroy();if(D)D.destroy();
  C=new Chart(pq,{type:'bar',data:{labels:l,datasets:[{label:'Lượng nước về hồ 2026',data:d.map(x=>x[7]),backgroundColor:'#3340a0'},{label:'Lượng nước về hồ cùng kỳ 2025',data:d.map(x=>x[11]),backgroundColor:'#f4b82d'}]},options:opt('m³/s')});
  D=new Chart(pfu,{type:'line',data:{labels:l,datasets:[{label:'Mức đầy hồ 2026',data:d.map(x=>x[6]==null?null:x[6]*100),borderColor:'#202a83',backgroundColor:'#202a83',tension:.25},{label:'Mức đầy hồ cùng kỳ 2025',data:d.map(x=>x[10]==null?null:x[10]*100),borderColor:'#f4b82d',backgroundColor:'#f4b82d',tension:.25}]},options:opt('%')});
  pmt.innerHTML='<tr><th>Tháng</th><th>Hồ tham chiếu</th><th>Mực nước thực tế</th><th>MN dâng bình thường</th><th>Mực nước chết</th><th>Mức đầy</th><th>Nước về hồ</th><th>Nước qua tua-bin</th><th>Nước về hồ cùng kỳ</th><th>So cùng kỳ</th><th>Độ phủ</th></tr>'+d.map(x=>`<tr><td>${x[0]}</td><td>${x[2]}</td><td>${f(x[3],2)}</td><td>${f(x[4],2)}</td><td>${f(x[5],2)}</td><td>${pc(x[6])}</td><td>${f(x[7])}</td><td>${f(x[8])}</td><td>${f(x[11])}</td><td>${x[12]==null?'—':`<span class="pill ${cl(x[12])}">${yy(x[12])}</span>`}</td><td>${pc(x[9])}</td></tr>`).join('')
 }
 function installPicker(){
  if(!ps)return;const host=ps.parentElement;ps.style.display='none';
  [...host.querySelectorAll('input[type="search"]')].forEach(x=>x.remove());
  const wrap=document.createElement('div');wrap.className='plant-picker';
  const input=document.createElement('input');input.type='text';input.autocomplete='off';input.placeholder='Tìm hoặc chọn nhà máy…';input.value=ps.value;
  const arrow=document.createElement('span');arrow.className='pp-arrow';arrow.textContent='▾';
  const list=document.createElement('div');list.className='pp-list';
  wrap.append(input,arrow,list);host.appendChild(wrap);
  function esc(s){return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')}
  function render(q=''){
    const s=q.trim().toLocaleLowerCase('vi');const arr=pnames.filter(x=>x.toLocaleLowerCase('vi').includes(s));
    list.innerHTML=arr.length?arr.map(name=>`<button type="button" class="pp-item${name===ps.value?' active':''}" data-name="${esc(name)}">${esc(name)}</button>`).join(''):'<div class="pp-empty">Không tìm thấy nhà máy</div>';
    list.querySelectorAll('.pp-item').forEach(btn=>btn.onclick=()=>{const name=btn.textContent;ps.value=name;input.value=name;wrap.classList.remove('open');render('');pp()});
  }
  input.addEventListener('focus',()=>{wrap.classList.add('open');render(input.value===ps.value?'':input.value)});
  input.addEventListener('click',()=>{wrap.classList.add('open');render(input.value===ps.value?'':input.value)});
  input.addEventListener('input',()=>{wrap.classList.add('open');render(input.value)});
  input.addEventListener('keydown',e=>{if(e.key==='Escape'){wrap.classList.remove('open');input.value=ps.value}if(e.key==='Enter'){const first=list.querySelector('.pp-item');if(first)first.click()}});
  document.addEventListener('click',e=>{if(!wrap.contains(e.target)){wrap.classList.remove('open');input.value=ps.value}});
  render('');
 }
 if(ps){ps.onchange=pp;pp();installPicker()}
 console.log('REE hydro dashboard '+VERSION,{plantsInP:P.length,plantsInMonthly:dataPlantNames.size,pickerPlants:pnames.length,plantMonthly:Md.length,reservoirMonthly:Rd.length,defaultPlant:ps&&ps.value});
}catch(e){err('Lỗi tải dữ liệu: '+e.message)}
})();