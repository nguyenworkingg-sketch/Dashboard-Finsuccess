(()=>{
'use strict';
const VERSION='2026-09-16-master';
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
  const st=document.createElement('style');st.textContent=`.reeMasterNav{position:sticky;top:0;z-index:99999;background:#fff;border-bottom:1px solid #e5e7ef;padding:9px 18px;display:flex;gap:8px;align-items:center;font-family:Inter,system-ui,sans-serif;box-shadow:0 3px 14px rgba(32,42,131,.06)}.reeMasterBrand{font-weight:950;color:#202a83;margin-right:auto}.reeMasterBrand b{color:#f4b82d}.reeMasterNav a{text-decoration:none;padding:8px 13px;border:1px solid #e5e7ef;border-radius:999px;color:#41465a;font-size:12px;font-weight:800}.reeMasterNav a.active{background:#202a83;color:#fff;border-color:#202a83}@media(max-width:640px){.reeMasterNav{padding:8px;overflow:auto}.reeMasterBrand{display:none}.reeMasterNav a{white-space:nowrap;flex:1;text-align:center}}`;document.head.appendChild(st);
  const nav=document.createElement('div');nav.className='reeMasterNav';nav.innerHTML='<div class="reeMasterBrand">Fin<b>Success</b> · REE</div><a href="./" class="active">Thủy điện</a><a href="me.html">M&amp;E</a><a href="office.html">Văn phòng cho thuê</a>';document.body.insertBefore(nav,document.body.firstChild);
}
function err(msg){console.error(msg);document.querySelectorAll('.chartbox').forEach((el,i)=>{if(i<2)el.innerHTML='<div style="padding:28px;color:#c94848;font-weight:700">'+msg+'</div>'})}
try{
 injectMasterNav();
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

 // R schema thực tế:
 // [ym, region, reservoir, Htl, Hdbt, Hc, fullness, Qve, Qx, Qxt, Qxm, QveLY, QveIdx, coverage]
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

 // M schema thực tế:
 // [ym, plant, basket, Htl, Hdbt, Hc, fullness, Qve, Qxm, coverage, fullnessLY, QveLY, QveIdx, fullnessIdx]
 const dataPlantNames=new Set(Md.map(x=>x[1]));
 const pnames=P.map(x=>x.plant).filter(x=>dataPlantNames.has(x));for(const x of [...dataPlantNames].sort((a,b)=>a.localeCompare(b,'vi')))if(!pnames.includes(x))pnames.push(x);
 const fill=(list,sel)=>{if(!ps)return;ps.innerHTML=list.map(x=>`<option value="${x}">${x}</option>`).join('');if(sel&&list.includes(sel))ps.value=sel;else if(list.length)ps.selectedIndex=0};fill(pnames,'Thượng Kon Tum');
 let C,D;
 function pp(){
  if(!ps||!pq||!pfu||!pmt)return;const d=Md.filter(x=>x[1]===ps.value).sort((a,b)=>a[0].localeCompare(b[0]));const l=d.map(x=>'T'+(+x[0].slice(5))+'/26');
  if(C)C.destroy();if(D)D.destroy();
  C=new Chart(pq,{type:'bar',data:{labels:l,datasets:[{label:'Lượng nước về hồ 2026',data:d.map(x=>x[7]),backgroundColor:'#3340a0'},{label:'Lượng nước về hồ cùng kỳ 2025',data:d.map(x=>x[11]),backgroundColor:'#f4b82d'}]},options:opt('m³/s')});
  D=new Chart(pfu,{type:'line',data:{labels:l,datasets:[{label:'Mức đầy hồ 2026',data:d.map(x=>x[6]==null?null:x[6]*100),borderColor:'#202a83',backgroundColor:'#202a83',tension:.25},{label:'Mức đầy hồ cùng kỳ 2025',data:d.map(x=>x[10]==null?null:x[10]*100),borderColor:'#f4b82d',backgroundColor:'#f4b82d',tension:.25}]},options:opt('%')});
  pmt.innerHTML='<tr><th>Tháng</th><th>Hồ tham chiếu</th><th>Mực nước thực tế</th><th>MN dâng bình thường</th><th>Mực nước chết</th><th>Mức đầy</th><th>Nước về hồ</th><th>Nước qua tua-bin</th><th>Nước về hồ cùng kỳ</th><th>So cùng kỳ</th><th>Độ phủ</th></tr>'+d.map(x=>`<tr><td>${x[0]}</td><td>${x[2]}</td><td>${f(x[3],2)}</td><td>${f(x[4],2)}</td><td>${f(x[5],2)}</td><td>${pc(x[6])}</td><td>${f(x[7])}</td><td>${f(x[8])}</td><td>${f(x[11])}</td><td>${x[12]==null?'—':`<span class="pill ${cl(x[12])}">${yy(x[12])}</span>`}</td><td>${pc(x[9])}</td></tr>`).join('')
 }
 if(ps){ps.onchange=pp;pp();const box=ps.closest('.filter')||ps.parentElement;if(box){const search=document.createElement('input');search.type='search';search.placeholder='Tìm nhà máy…';search.style.cssText='padding:9px 12px;border:1px solid #e5e7ef;border-radius:10px;min-width:190px;font:inherit';box.insertBefore(search,ps);search.oninput=()=>{const q=search.value.trim().toLocaleLowerCase('vi'),list=pnames.filter(x=>x.toLocaleLowerCase('vi').includes(q));fill(list,list[0]);if(list.length)pp()}}}
 const impact=$('impactChart');if(impact&&impact.parentElement)impact.parentElement.innerHTML='<div class="note warn"><b>Đã bỏ ước tính LNST cơ học:</b> thủy văn được dùng như chỉ báo sản lượng. KQKD cần đọc cùng giá CGM/CAN, Qc, điều độ và sản lượng thực tế theo tháng.</div>';
 console.log('REE hydro dashboard '+VERSION,{plants:P.length,plantMonthly:Md.length,reservoirMonthly:Rd.length,defaultPlant:ps&&ps.value});
}catch(e){err('Lỗi tải dữ liệu: '+e.message)}
})();