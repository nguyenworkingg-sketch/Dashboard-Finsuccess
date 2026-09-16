(()=>{
'use strict';
const BLUE='#202a83',BLUE2='#3340a0',YELLOW='#f4b82d',GREEN='#198754';
const opts=y=>({responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'bottom'}},scales:{x:{grid:{display:false}},y:{title:{display:true,text:y},grid:{color:'#eef0f4'}}}});
const rowsFor=name=>(window.R||[]).filter(x=>x[2]===name).sort((a,b)=>a[0].localeCompare(b[0]));
const full25=(ym,res)=>{const v=window.REE_FULLNESS_2025?.[ym+'|'+res];return v==null?null:v*100};
function parseMap(s){return (s||'').split('+').map(x=>x.trim()).map(z=>{const m=z.match(/^([0-9.]+)%\s+(.+)$/);return m?{w:+m[1]/100,res:m[2].trim()}:null}).filter(Boolean)}
function plantFull25(meta,ym){const parts=parseMap(meta?.mapping);let n=0,d=0;for(const p of parts){const v=window.REE_FULLNESS_2025?.[ym+'|'+p.res];if(v!=null&&Number.isFinite(+v)){n+=(+v)*p.w;d+=p.w}}return d?n/d*100:null}
function redrawReservoir(){
 const sel=document.getElementById('reservoirSelect'),fc=document.getElementById('reservoirFullChart'),qc=document.getElementById('reservoirFlowChart');
 if(!sel||!fc||!qc||typeof Chart==='undefined'||!window.R)return;
 const d=rowsFor(sel.value),labels=d.map(x=>'T'+(+x[0].slice(5))+'/26');if(!d.length)return;
 Chart.getChart(fc)?.destroy();
 new Chart(fc,{type:'line',data:{labels,datasets:[
  {label:'Mức đầy hồ cùng kỳ 2025',data:d.map(x=>full25(x[0],x[2])),borderColor:YELLOW,backgroundColor:YELLOW,tension:.25},
  {label:'Mức đầy hồ 2026',data:d.map(x=>x[6]==null?null:x[6]*100),borderColor:BLUE,backgroundColor:BLUE,tension:.25}
 ]},options:opts('%')});
 Chart.getChart(qc)?.destroy();
 new Chart(qc,{data:{labels,datasets:[
  {type:'bar',label:'Lượng nước về hồ cùng kỳ 2025',data:d.map(x=>x[11]),backgroundColor:YELLOW,borderColor:YELLOW,order:1},
  {type:'bar',label:'Lượng nước về hồ 2026',data:d.map(x=>x[7]),backgroundColor:BLUE2,borderColor:BLUE2,order:2},
  {type:'line',label:'Lượng nước qua tua-bin 2026',data:d.map(x=>x[10]),borderColor:GREEN,backgroundColor:GREEN,tension:.25,fill:false,pointRadius:3,pointHoverRadius:4,order:0}
 ]},options:opts('m³/s')});
}
function redrawPlant(){
 const sel=document.getElementById('plantSelect'),fc=document.getElementById('plantFullChart'),qc=document.getElementById('plantFlowChart');
 if(!sel||!fc||!qc||typeof Chart==='undefined'||!window.M)return;
 const name=sel.value,d=(window.M||[]).filter(x=>x[1]===name).sort((a,b)=>a[0].localeCompare(b[0]));if(!d.length)return;
 const meta=(window.P||[]).find(x=>x.plant===name),labels=d.map(x=>'T'+(+x[0].slice(5))+'/26');
 Chart.getChart(qc)?.destroy();
 new Chart(qc,{data:{labels,datasets:[
  {type:'bar',label:'Lượng nước về hồ cùng kỳ 2025',data:d.map(x=>x[11]),backgroundColor:YELLOW,borderColor:YELLOW,order:1},
  {type:'bar',label:'Lượng nước về hồ 2026',data:d.map(x=>x[7]),backgroundColor:BLUE2,borderColor:BLUE2,order:2},
  {type:'line',label:'Lượng nước qua tua-bin 2026',data:d.map(x=>x[8]),borderColor:GREEN,backgroundColor:GREEN,tension:.25,fill:false,pointRadius:3,pointHoverRadius:4,order:0}
 ]},options:opts('m³/s')});
 Chart.getChart(fc)?.destroy();
 new Chart(fc,{type:'line',data:{labels,datasets:[
  {label:'Mức đầy hồ cùng kỳ 2025',data:d.map(x=>plantFull25(meta,x[0])),borderColor:YELLOW,backgroundColor:YELLOW,tension:.25},
  {label:'Mức đầy hồ 2026',data:d.map(x=>x[6]==null?null:x[6]*100),borderColor:BLUE,backgroundColor:BLUE,tension:.25}
 ]},options:opts('%')});
}
function redrawAll(){redrawReservoir();redrawPlant()}
function boot(){
 setTimeout(redrawAll,80);setTimeout(redrawAll,350);
 document.getElementById('reservoirSelect')?.addEventListener('change',()=>setTimeout(redrawReservoir,80));
 document.getElementById('plantSelect')?.addEventListener('change',()=>setTimeout(redrawPlant,80));
 document.addEventListener('click',e=>{if(e.target.closest?.('.pp-item'))setTimeout(redrawPlant,120)},true);
 let lastP=document.getElementById('plantSelect')?.value||'',lastR=document.getElementById('reservoirSelect')?.value||'';
 setInterval(()=>{const p=document.getElementById('plantSelect')?.value||'',r=document.getElementById('reservoirSelect')?.value||'';if(p&&p!==lastP){lastP=p;setTimeout(redrawPlant,60)}if(r&&r!==lastR){lastR=r;setTimeout(redrawReservoir,60)}},150);
}
if(document.readyState==='complete')boot();else window.addEventListener('load',boot,{once:true});
})();