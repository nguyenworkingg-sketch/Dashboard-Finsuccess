(()=>{
'use strict';
const $=id=>document.getElementById(id);
const f=(x,d=1)=>x==null||!isFinite(x)?'—':(+x).toFixed(d);
const pc=x=>x==null||!isFinite(x)?'—':(x*100).toFixed(1)+'%';
const ix=x=>x==null||!isFinite(x)?'—':(+x).toFixed(2)+'x';
const yy=x=>x==null||!isFinite(x)?'—':((x-1)*100).toFixed(0)+'%';
const cl=x=>x>=1.05?'xanh':x>=.95?'xam':x>=.8?'vang':'do';
const opt=y=>({responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'bottom'}},scales:{x:{grid:{display:false}},y:{title:{display:true,text:y},grid:{color:'#eef0f4'}}}});
function showError(msg){console.error(msg);document.querySelectorAll('.chartbox').forEach((el,i)=>{if(i<2)el.innerHTML='<div style="padding:28px;color:#c94848;font-weight:700">'+msg+'</div>';});}
function dedupe(arr,keyfn){const m=new Map();for(const x of arr)m.set(keyfn(x),x);return [...m.values()];}
try{
 if(typeof Chart==='undefined') throw new Error('Chart.js chưa tải được');
 if(typeof P==='undefined'||typeof O==='undefined'||typeof M==='undefined'||typeof R==='undefined') throw new Error('Thiếu dữ liệu dashboard');
 const Md=dedupe(M,x=>x[0]+'|'+x[1]);
 const Rd=dedupe(R,x=>x[0]+'|'+x[2]);
 if(!Md.length||!Rd.length) throw new Error('Dữ liệu hồ chưa nạp được');

 const portC=$('portfolioChart'),q3C=$('q3Chart'),expo=$('exposureCards'),weak=$('weakCards'),pt=$('plantTable');
 const rs=$('reservoirSelect'),rf=$('reservoirFullChart'),rq=$('reservoirFlowChart'),mf=$('monthFilter'),rg=$('regionFilter'),rt=$('reservoirTable');
 const ps=$('plantSelect'),pq=$('plantFlowChart'),pfu=$('plantFullChart'),pmt=$('plantMonthTable'),imp=$('impactChart');

 new Chart(portC,{type:'line',data:{labels:O.map(x=>x[0]),datasets:[{label:'Nước về hồ so cùng kỳ',data:O.map(x=>x[1]),borderColor:'#202a83',backgroundColor:'#202a83',tension:.25},{label:'Mức đầy hồ so cùng kỳ',data:O.map(x=>x[2]),borderColor:'#f4b82d',backgroundColor:'#f4b82d',tension:.25}]},options:opt('Lần')});
 const top=[...P].sort((a,b)=>b.econ_mw-a.econ_mw).slice(0,12);
 new Chart(q3C,{type:'bar',data:{labels:top.map(x=>x.plant),datasets:[{data:top.map(x=>x.q3_water),backgroundColor:'#3340a0'}]},options:{...opt('Lần'),indexAxis:'y',plugins:{legend:{display:false}}}});

 const ex=[...P].sort((a,b)=>b.econ_mw-a.econ_mw).slice(0,6);
 expo.innerHTML=ex.map(x=>`<div style="margin:12px 0"><div class="split"><b>${x.plant}</b><span>${f(x.econ_mw)} MW quy đổi</span></div><div class="nho">${x.company} · REE ${pc(x.ownership)} · hồ tham chiếu: ${x.mapping}</div><div class="bar"><i style="width:${Math.min(100,x.econ_mw/ex[0].econ_mw*100)}%"></i></div></div>`).join('');
 const wk=[...P].sort((a,b)=>a.q3_water-b.q3_water).slice(0,6);
 weak.innerHTML=wk.map(x=>`<div style="margin:12px 0"><div class="split"><b>${x.plant}</b><span class="pill ${cl(x.q3_water)}">${ix(x.q3_water)}</span></div><div class="nho">${x.mapping} · độ phù hợp ${x.quality}/5 · ${f(x.econ_mw)} MW quy đổi</div></div>`).join('');
 pt.innerHTML='<tr><th>Nhà máy</th><th>Công ty</th><th>Tỷ lệ KT REE</th><th>MW quy đổi</th><th>Hồ tham chiếu</th><th>Độ phù hợp</th><th>T7</th><th>T8</th><th>T9 ước tính</th><th>Q3/26</th><th>FY26</th></tr>'+[...P].sort((a,b)=>b.econ_mw-a.econ_mw).map(x=>`<tr><td>${x.plant}</td><td>${x.company}</td><td>${pc(x.ownership)}</td><td>${f(x.econ_mw)}</td><td>${x.mapping}</td><td>${x.quality}/5</td><td>${ix(x.jul)}</td><td>${ix(x.aug)}</td><td>${ix(x.sep_est)}</td><td><span class="pill ${cl(x.q3_water)}">${ix(x.q3_water)}</span></td><td>${ix(x.fy_water)}</td></tr>`).join('');

 const names=[...new Set(Rd.map(x=>x[2]))].sort((a,b)=>a.localeCompare(b,'vi'));
 rs.innerHTML=names.map(x=>`<option>${x}</option>`).join('');
 if(names.includes('Thượng Kon Tum'))rs.value='Thượng Kon Tum';
 let A,B;
 function rr(){const d=Rd.filter(x=>x[2]===rs.value).sort((a,b)=>a[0].localeCompare(b[0])),l=d.map(x=>'T'+(+x[0].slice(5))+'/26');if(A)A.destroy();if(B)B.destroy();A=new Chart(rf,{type:'line',data:{labels:l,datasets:[{label:'Mức đầy hồ 2026',data:d.map(x=>x[6]*100),borderColor:'#202a83',backgroundColor:'#202a83',tension:.25}]},options:opt('%')});B=new Chart(rq,{type:'line',data:{labels:l,datasets:[{label:'Nước về hồ 2026',data:d.map(x=>x[7]),borderColor:'#202a83',backgroundColor:'#202a83',tension:.25},{label:'Nước về hồ 2025',data:d.map(x=>x[11]),borderColor:'#f4b82d',backgroundColor:'#f4b82d',tension:.25},{label:'Nước qua máy 2026',data:d.map(x=>x[10]),borderColor:'#198754',backgroundColor:'#198754',tension:.25}]},options:opt('m³/s')});}
 rs.onchange=rr;rr();

 const mos=[...new Set(Rd.map(x=>x[0]))].sort(),regs=[...new Set(Rd.map(x=>x[1]))].sort((a,b)=>a.localeCompare(b,'vi'));
 mf.innerHTML='<option value="all">Tất cả</option>'+mos.map(x=>`<option>${x}</option>`).join('');
 rg.innerHTML='<option value="all">Tất cả</option>'+regs.map(x=>`<option>${x}</option>`).join('');
 function tbl(){const d=Rd.filter(x=>(mf.value==='all'||x[0]===mf.value)&&(rg.value==='all'||x[1]===rg.value));rt.innerHTML='<tr><th>Tháng</th><th>Vùng</th><th>Hồ</th><th>Htl</th><th>MNDBT</th><th>MNC</th><th>Mức đầy</th><th>Qve</th><th>Qx</th><th>Qxt</th><th>Qxm</th><th>Qve cùng kỳ</th><th>Qve YoY</th><th>Độ phủ</th></tr>'+d.map(x=>`<tr><td>${x[0]}</td><td>${x[1]}</td><td>${x[2]}</td><td>${f(x[3],2)}</td><td>${f(x[4],2)}</td><td>${f(x[5],2)}</td><td>${pc(x[6])}</td><td>${f(x[7])}</td><td>${f(x[8])}</td><td>${f(x[9])}</td><td>${f(x[10])}</td><td>${f(x[11])}</td><td>${x[12]==null?'—':`<span class="pill ${cl(x[12])}">${yy(x[12])}</span>`}</td><td>${pc(x[13])}</td></tr>`).join('');}
 mf.onchange=tbl;rg.onchange=tbl;tbl();

 const dataPlantNames=new Set(Md.map(x=>x[1]));
 const pnames=P.map(x=>x.plant).filter(x=>dataPlantNames.has(x));
 for(const x of [...dataPlantNames].sort((a,b)=>a.localeCompare(b,'vi')))if(!pnames.includes(x))pnames.push(x);
 ps.innerHTML=pnames.map(x=>`<option>${x}</option>`).join('');
 if(pnames.includes('Thượng Kon Tum'))ps.value='Thượng Kon Tum';
 let C,D;
 function pp(){const d=Md.filter(x=>x[1]===ps.value).sort((a,b)=>a[0].localeCompare(b[0])),l=d.map(x=>'T'+(+x[0].slice(5))+'/26');if(C)C.destroy();if(D)D.destroy();C=new Chart(pq,{type:'bar',data:{labels:l,datasets:[{label:'Nước về hồ 2026',data:d.map(x=>x[7]),backgroundColor:'#3340a0'},{label:'Nước về hồ cùng kỳ 2025',data:d.map(x=>x[11]),backgroundColor:'#f4b82d'}]},options:opt('m³/s')});D=new Chart(pfu,{type:'line',data:{labels:l,datasets:[{label:'Mức đầy hồ 2026',data:d.map(x=>x[6]*100),borderColor:'#202a83',backgroundColor:'#202a83',tension:.25},{label:'Mức đầy hồ cùng kỳ 2025',data:d.map(x=>x[10]==null?null:x[10]*100),borderColor:'#f4b82d',backgroundColor:'#f4b82d',tension:.25}]},options:opt('%')});pmt.innerHTML='<tr><th>Tháng</th><th>Hồ tham chiếu</th><th>Htl</th><th>MNDBT</th><th>MNC</th><th>Mức đầy</th><th>Qve</th><th>Qxm</th><th>Qve cùng kỳ</th><th>Qve YoY</th><th>Độ phủ</th></tr>'+d.map(x=>`<tr><td>${x[0]}</td><td>${x[2]}</td><td>${f(x[3],2)}</td><td>${f(x[4],2)}</td><td>${f(x[5],2)}</td><td>${pc(x[6])}</td><td>${f(x[7])}</td><td>${f(x[8])}</td><td>${f(x[11])}</td><td>${x[12]==null?'—':`<span class="pill ${cl(x[12])}">${yy(x[12])}</span>`}</td><td>${pc(x[9])}</td></tr>`).join('');}
 ps.onchange=pp;pp();

 const im=[...P].sort((a,b)=>Math.abs(b.q3_impact)-Math.abs(a.q3_impact)).slice(0,14);
 new Chart(imp,{type:'bar',data:{labels:im.map(x=>x.plant),datasets:[{data:im.map(x=>x.q3_impact),backgroundColor:im.map(x=>x.q3_impact>=0?'#198754':'#c94848')}]},options:{...opt('Tỷ đồng'),plugins:{legend:{display:false}}}});
 console.log('REE hydro dashboard loaded',{plants:P.length,plantMonthlyRaw:M.length,plantMonthlyUnique:Md.length,reservoirMonthlyRaw:R.length,reservoirMonthlyUnique:Rd.length});
}catch(e){showError('Lỗi tải dữ liệu: '+e.message);}
})();