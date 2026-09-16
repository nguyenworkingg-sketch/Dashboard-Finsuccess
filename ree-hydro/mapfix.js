(()=>{
'use strict';
// Rebuild monthly plant series directly from P.mapping + reservoir data R.
// This makes P the single source of truth for plant-to-reservoir mapping.
if(typeof P==='undefined'||typeof R==='undefined'||typeof M==='undefined')return;
const parseMapping=s=>(s||'').split('+').map(x=>x.trim()).map(part=>{const m=part.match(/^([0-9.]+)%\s+(.+)$/);return m?{w:+m[1]/100,res:m[2].trim()}:null}).filter(Boolean);
const months=[...new Set(R.map(x=>x[0]))].sort();
const rBy=new Map();for(const row of R)rBy.set(row[0]+'|'+row[2],row);
const weighted=(rows,weights,idx)=>{let num=0,den=0;for(let i=0;i<rows.length;i++){const v=rows[i]?.[idx],w=weights[i];if(v!=null&&Number.isFinite(+v)){num+=(+v)*w;den+=w}}return den?num/den:null};
const rebuilt=[];
for(const meta of P){
  const parts=parseMapping(meta.mapping);if(!parts.length)continue;
  for(const ym of months){
    const rows=parts.map(p=>rBy.get(ym+'|'+p.res));const weights=parts.map(p=>p.w);
    const available=rows.reduce((s,r,i)=>s+(r?weights[i]:0),0);if(!available)continue;
    // Normalize available weights so partial missing-reservoir months remain usable.
    const wn=weights.map((w,i)=>rows[i]?w/available:0);
    // R schema: [ym,region,res,Htl,Hdbt,Hc,fullness,Qve,Qx,Qxt,Qxm,QveLY,QveIdx,coverage]
    const Htl=weighted(rows,wn,3),Hdbt=weighted(rows,wn,4),Hc=weighted(rows,wn,5),full=weighted(rows,wn,6),Qve=weighted(rows,wn,7),Qxm=weighted(rows,wn,10),QveLY=weighted(rows,wn,11),coverage=weighted(rows,wn,13);
    let fullLY=null,fullIdx=null;
    // R currently does not carry direct historical fullness in a dedicated field; leave null rather than fabricate.
    const qveIdx=(Qve!=null&&QveLY!=null&&QveLY!==0)?Qve/QveLY:null;
    rebuilt.push([ym,meta.plant,meta.mapping,Htl,Hdbt,Hc,full,Qve,Qxm,coverage,fullLY,QveLY,qveIdx,fullIdx]);
  }
}
M.length=0;M.push(...rebuilt);
window.__REE_MAPPING_AUDIT={plants:P.length,rebuiltRows:rebuilt.length,direct:P.filter(x=>/^100%\s+/.test(x.mapping)).map(x=>x.plant),missing:P.filter(x=>!rebuilt.some(r=>r[1]===x.plant)).map(x=>({plant:x.plant,mapping:x.mapping}))};
console.log('REE mapping rebuilt from P + R',window.__REE_MAPPING_AUDIT);
})();
