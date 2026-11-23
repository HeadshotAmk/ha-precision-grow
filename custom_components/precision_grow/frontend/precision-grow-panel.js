var L=globalThis,I=L.ShadowRoot&&(L.ShadyCSS===void 0||L.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,W=Symbol(),rt=new WeakMap,k=class{constructor(e,t,s){if(this._$cssResult$=!0,s!==W)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o,t=this.t;if(I&&e===void 0){let s=t!==void 0&&t.length===1;s&&(e=rt.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),s&&rt.set(t,e))}return e}toString(){return this.cssText}},nt=o=>new k(typeof o=="string"?o:o+"",void 0,W),C=(o,...e)=>{let t=o.length===1?o[0]:e.reduce((s,i,n)=>s+(r=>{if(r._$cssResult$===!0)return r.cssText;if(typeof r=="number")return r;throw Error("Value passed to 'css' function must be a 'css' function result: "+r+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+o[n+1],o[0]);return new k(t,o,W)},ot=(o,e)=>{if(I)o.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(let t of e){let s=document.createElement("style"),i=L.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=t.cssText,o.appendChild(s)}},G=I?o=>o:o=>o instanceof CSSStyleSheet?(e=>{let t="";for(let s of e.cssRules)t+=s.cssText;return nt(t)})(o):o;var{is:kt,defineProperty:Ct,getOwnPropertyDescriptor:Rt,getOwnPropertyNames:Pt,getOwnPropertySymbols:Tt,getPrototypeOf:Ht}=Object,z=globalThis,at=z.trustedTypes,Mt=at?at.emptyScript:"",Dt=z.reactiveElementPolyfillSupport,R=(o,e)=>o,K={toAttribute(o,e){switch(e){case Boolean:o=o?Mt:null;break;case Object:case Array:o=o==null?o:JSON.stringify(o)}return o},fromAttribute(o,e){let t=o;switch(e){case Boolean:t=o!==null;break;case Number:t=o===null?null:Number(o);break;case Object:case Array:try{t=JSON.parse(o)}catch{t=null}}return t}},ht=(o,e)=>!kt(o,e),lt={attribute:!0,type:String,converter:K,reflect:!1,useDefault:!1,hasChanged:ht};Symbol.metadata??=Symbol("metadata"),z.litPropertyMetadata??=new WeakMap;var v=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=lt){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){let s=Symbol(),i=this.getPropertyDescriptor(e,s,t);i!==void 0&&Ct(this.prototype,e,i)}}static getPropertyDescriptor(e,t,s){let{get:i,set:n}=Rt(this.prototype,e)??{get(){return this[t]},set(r){this[t]=r}};return{get:i,set(r){let l=i?.call(this);n?.call(this,r),this.requestUpdate(e,l,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??lt}static _$Ei(){if(this.hasOwnProperty(R("elementProperties")))return;let e=Ht(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(R("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(R("properties"))){let t=this.properties,s=[...Pt(t),...Tt(t)];for(let i of s)this.createProperty(i,t[i])}let e=this[Symbol.metadata];if(e!==null){let t=litPropertyMetadata.get(e);if(t!==void 0)for(let[s,i]of t)this.elementProperties.set(s,i)}this._$Eh=new Map;for(let[t,s]of this.elementProperties){let i=this._$Eu(t,s);i!==void 0&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let t=[];if(Array.isArray(e)){let s=new Set(e.flat(1/0).reverse());for(let i of s)t.unshift(G(i))}else e!==void 0&&t.push(G(e));return t}static _$Eu(e,t){let s=t.attribute;return s===!1?void 0:typeof s=="string"?s:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){let e=new Map,t=this.constructor.elementProperties;for(let s of t.keys())this.hasOwnProperty(s)&&(e.set(s,this[s]),delete this[s]);e.size>0&&(this._$Ep=e)}createRenderRoot(){let e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return ot(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,s){this._$AK(e,s)}_$ET(e,t){let s=this.constructor.elementProperties.get(e),i=this.constructor._$Eu(e,s);if(i!==void 0&&s.reflect===!0){let n=(s.converter?.toAttribute!==void 0?s.converter:K).toAttribute(t,s.type);this._$Em=e,n==null?this.removeAttribute(i):this.setAttribute(i,n),this._$Em=null}}_$AK(e,t){let s=this.constructor,i=s._$Eh.get(e);if(i!==void 0&&this._$Em!==i){let n=s.getPropertyOptions(i),r=typeof n.converter=="function"?{fromAttribute:n.converter}:n.converter?.fromAttribute!==void 0?n.converter:K;this._$Em=i;let l=r.fromAttribute(t,n.type);this[i]=l??this._$Ej?.get(i)??l,this._$Em=null}}requestUpdate(e,t,s,i=!1,n){if(e!==void 0){let r=this.constructor;if(i===!1&&(n=this[e]),s??=r.getPropertyOptions(e),!((s.hasChanged??ht)(n,t)||s.useDefault&&s.reflect&&n===this._$Ej?.get(e)&&!this.hasAttribute(r._$Eu(e,s))))return;this.C(e,t,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,t,{useDefault:s,reflect:i,wrapped:n},r){s&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,r??t??this[e]),n!==!0||r!==void 0)||(this._$AL.has(e)||(this.hasUpdated||s||(t=void 0),this._$AL.set(e,t)),i===!0&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[i,n]of this._$Ep)this[i]=n;this._$Ep=void 0}let s=this.constructor.elementProperties;if(s.size>0)for(let[i,n]of s){let{wrapped:r}=n,l=this[i];r!==!0||this._$AL.has(i)||l===void 0||this.C(i,void 0,n,l)}}let e=!1,t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(s=>s.hostUpdate?.()),this.update(t)):this._$EM()}catch(s){throw e=!1,this._$EM(),s}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(e){}firstUpdated(e){}};v.elementStyles=[],v.shadowRootOptions={mode:"open"},v[R("elementProperties")]=new Map,v[R("finalized")]=new Map,Dt?.({ReactiveElement:v}),(z.reactiveElementVersions??=[]).push("2.1.2");var tt=globalThis,ct=o=>o,B=tt.trustedTypes,dt=B?B.createPolicy("lit-html",{createHTML:o=>o}):void 0,vt="$lit$",f=`lit$${Math.random().toFixed(9).slice(2)}$`,ft="?"+f,Ut=`<${ft}>`,x=document,T=()=>x.createComment(""),H=o=>o===null||typeof o!="object"&&typeof o!="function",et=Array.isArray,Ot=o=>et(o)||typeof o?.[Symbol.iterator]=="function",q=`[ 	
\f\r]`,P=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,pt=/-->/g,ut=/>/g,y=RegExp(`>|${q}(?:([^\\s"'>=/]+)(${q}*=${q}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),gt=/'/g,_t=/"/g,$t=/^(?:script|style|textarea|title)$/i,st=o=>(e,...t)=>({_$litType$:o,strings:e,values:t}),d=st(1),F=st(2),Gt=st(3),w=Symbol.for("lit-noChange"),h=Symbol.for("lit-nothing"),mt=new WeakMap,b=x.createTreeWalker(x,129);function yt(o,e){if(!et(o)||!o.hasOwnProperty("raw"))throw Error("invalid template strings array");return dt!==void 0?dt.createHTML(e):e}var Nt=(o,e)=>{let t=o.length-1,s=[],i,n=e===2?"<svg>":e===3?"<math>":"",r=P;for(let l=0;l<t;l++){let a=o[l],p,u,c=-1,g=0;for(;g<a.length&&(r.lastIndex=g,u=r.exec(a),u!==null);)g=r.lastIndex,r===P?u[1]==="!--"?r=pt:u[1]!==void 0?r=ut:u[2]!==void 0?($t.test(u[2])&&(i=RegExp("</"+u[2],"g")),r=y):u[3]!==void 0&&(r=y):r===y?u[0]===">"?(r=i??P,c=-1):u[1]===void 0?c=-2:(c=r.lastIndex-u[2].length,p=u[1],r=u[3]===void 0?y:u[3]==='"'?_t:gt):r===_t||r===gt?r=y:r===pt||r===ut?r=P:(r=y,i=void 0);let _=r===y&&o[l+1].startsWith("/>")?" ":"";n+=r===P?a+Ut:c>=0?(s.push(p),a.slice(0,c)+vt+a.slice(c)+f+_):a+f+(c===-2?l:_)}return[yt(o,n+(o[t]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),s]},M=class o{constructor({strings:e,_$litType$:t},s){let i;this.parts=[];let n=0,r=0,l=e.length-1,a=this.parts,[p,u]=Nt(e,t);if(this.el=o.createElement(p,s),b.currentNode=this.el.content,t===2||t===3){let c=this.el.content.firstChild;c.replaceWith(...c.childNodes)}for(;(i=b.nextNode())!==null&&a.length<l;){if(i.nodeType===1){if(i.hasAttributes())for(let c of i.getAttributeNames())if(c.endsWith(vt)){let g=u[r++],_=i.getAttribute(c).split(f),$=/([.?@])?(.*)/.exec(g);a.push({type:1,index:n,name:$[2],strings:_,ctor:$[1]==="."?J:$[1]==="?"?Z:$[1]==="@"?X:E}),i.removeAttribute(c)}else c.startsWith(f)&&(a.push({type:6,index:n}),i.removeAttribute(c));if($t.test(i.tagName)){let c=i.textContent.split(f),g=c.length-1;if(g>0){i.textContent=B?B.emptyScript:"";for(let _=0;_<g;_++)i.append(c[_],T()),b.nextNode(),a.push({type:2,index:++n});i.append(c[g],T())}}}else if(i.nodeType===8)if(i.data===ft)a.push({type:2,index:n});else{let c=-1;for(;(c=i.data.indexOf(f,c+1))!==-1;)a.push({type:7,index:n}),c+=f.length-1}n++}}static createElement(e,t){let s=x.createElement("template");return s.innerHTML=e,s}};function S(o,e,t=o,s){if(e===w)return e;let i=s!==void 0?t._$Co?.[s]:t._$Cl,n=H(e)?void 0:e._$litDirective$;return i?.constructor!==n&&(i?._$AO?.(!1),n===void 0?i=void 0:(i=new n(o),i._$AT(o,t,s)),s!==void 0?(t._$Co??=[])[s]=i:t._$Cl=i),i!==void 0&&(e=S(o,i._$AS(o,e.values),i,s)),e}var Y=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){let{el:{content:t},parts:s}=this._$AD,i=(e?.creationScope??x).importNode(t,!0);b.currentNode=i;let n=b.nextNode(),r=0,l=0,a=s[0];for(;a!==void 0;){if(r===a.index){let p;a.type===2?p=new D(n,n.nextSibling,this,e):a.type===1?p=new a.ctor(n,a.name,a.strings,this,e):a.type===6&&(p=new Q(n,this,e)),this._$AV.push(p),a=s[++l]}r!==a?.index&&(n=b.nextNode(),r++)}return b.currentNode=x,i}p(e){let t=0;for(let s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(e,s,t),t+=s.strings.length-2):s._$AI(e[t])),t++}},D=class o{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,s,i){this.type=2,this._$AH=h,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode,t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=S(this,e,t),H(e)?e===h||e==null||e===""?(this._$AH!==h&&this._$AR(),this._$AH=h):e!==this._$AH&&e!==w&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):Ot(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==h&&H(this._$AH)?this._$AA.nextSibling.data=e:this.T(x.createTextNode(e)),this._$AH=e}$(e){let{values:t,_$litType$:s}=e,i=typeof s=="number"?this._$AC(e):(s.el===void 0&&(s.el=M.createElement(yt(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(t);else{let n=new Y(i,this),r=n.u(this.options);n.p(t),this.T(r),this._$AH=n}}_$AC(e){let t=mt.get(e.strings);return t===void 0&&mt.set(e.strings,t=new M(e)),t}k(e){et(this._$AH)||(this._$AH=[],this._$AR());let t=this._$AH,s,i=0;for(let n of e)i===t.length?t.push(s=new o(this.O(T()),this.O(T()),this,this.options)):s=t[i],s._$AI(n),i++;i<t.length&&(this._$AR(s&&s._$AB.nextSibling,i),t.length=i)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){let s=ct(e).nextSibling;ct(e).remove(),e=s}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}},E=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,s,i,n){this.type=1,this._$AH=h,this._$AN=void 0,this.element=e,this.name=t,this._$AM=i,this.options=n,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=h}_$AI(e,t=this,s,i){let n=this.strings,r=!1;if(n===void 0)e=S(this,e,t,0),r=!H(e)||e!==this._$AH&&e!==w,r&&(this._$AH=e);else{let l=e,a,p;for(e=n[0],a=0;a<n.length-1;a++)p=S(this,l[s+a],t,a),p===w&&(p=this._$AH[a]),r||=!H(p)||p!==this._$AH[a],p===h?e=h:e!==h&&(e+=(p??"")+n[a+1]),this._$AH[a]=p}r&&!i&&this.j(e)}j(e){e===h?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}},J=class extends E{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===h?void 0:e}},Z=class extends E{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==h)}},X=class extends E{constructor(e,t,s,i,n){super(e,t,s,i,n),this.type=5}_$AI(e,t=this){if((e=S(this,e,t,0)??h)===w)return;let s=this._$AH,i=e===h&&s!==h||e.capture!==s.capture||e.once!==s.once||e.passive!==s.passive,n=e!==h&&(s===h||i);i&&this.element.removeEventListener(this.name,this,s),n&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}},Q=class{constructor(e,t,s){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(e){S(this,e)}};var Lt=tt.litHtmlPolyfillSupport;Lt?.(M,D),(tt.litHtmlVersions??=[]).push("3.3.3");var bt=(o,e,t)=>{let s=t?.renderBefore??e,i=s._$litPart$;if(i===void 0){let n=t?.renderBefore??null;s._$litPart$=i=new D(e.insertBefore(T(),n),n,void 0,t??{})}return i._$AI(o),i};var it=globalThis,m=class extends v{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=bt(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return w}};m._$litElement$=!0,m.finalized=!0,it.litElementHydrateSupport?.({LitElement:m});var It=it.litElementPolyfillSupport;It?.({LitElement:m});(it.litElementVersions??=[]).push("4.2.2");var j=600,A=56,V=4,xt=4,U=class extends m{constructor(){super(...arguments);this.series=[];this.start=0;this.end=0;this.noData="No data";this.lang="en";this._hover=null}_x(t){let s=Math.max(1,this.end-this.start);return V+(t-this.start)/s*(j-V-xt)}_range(t){let s=1/0,i=-1/0;for(let[,r]of t.points)r<s&&(s=r),r>i&&(i=r);if(t.band&&(s=Math.min(s,t.band[0]),i=Math.max(i,t.band[1])),!isFinite(s))return[0,1];if(i-s<1e-6)return[s-1,i+1];let n=(i-s)*.08;return[s-n,i+n]}_valueAt(t,s){let i=null;for(let[n,r]of t.points){if(n>s)break;i=r}return i}_onMove(t){let s=t.currentTarget.getBoundingClientRect(),i=(t.clientX-s.left)/s.width;this._hover=this.start+Math.min(1,Math.max(0,i))*(this.end-this.start)}_lane(t,s){let[i,n]=this._range(t),r=u=>A-4-(u-i)/(n-i)*(A-8),l=s*A,a="";t.points.forEach(([u,c],g)=>{let _=this._x(u).toFixed(1),$=(l+r(c)).toFixed(1);if(g===0)a+=`M${_},${$}`;else{let Et=(l+r(t.points[g-1][1])).toFixed(1);a+=`L${_},${Et}L${_},${$}`}}),t.points.length&&(a+=`L${this._x(this.end).toFixed(1)},${(l+r(t.points[t.points.length-1][1])).toFixed(1)}`);let p=t.band?F`<rect class="band" x=${V} width=${j-V-xt}
          y=${l+r(t.band[1])} height=${Math.max(0,r(t.band[0])-r(t.band[1]))}></rect>`:h;return F`
      <line class="sep" x1="0" x2=${j} y1=${l+A} y2=${l+A}></line>
      ${p}
      <path d=${a} stroke=${t.color} class="line"></path>`}render(){let t=this.series.filter(r=>r.points.length);if(!t.length)return d`<div class="empty">${this.noData}</div>`;let s=t.length*A,i=this._hover!==null?this._x(this._hover):null,n=r=>r.decimals??1;return d`
      <div class="wrap">
        <div class="labels">
          ${t.map(r=>{let l=this._hover!==null?this._valueAt(r,this._hover):r.points[r.points.length-1][1];return d`<div class="label" style="height:${A}px">
              <span class="dot" style="background:${r.color}"></span>
              <span class="name">${r.label}</span>
              <span class="val">${l===null?"\u2013":l.toLocaleString(this.lang,{minimumFractionDigits:n(r),maximumFractionDigits:n(r)})} ${r.unit}</span>
            </div>`})}
        </div>
        <svg viewBox="0 0 ${j} ${s}" preserveAspectRatio="none" style="height:${s}px"
          @pointermove=${this._onMove} @pointerleave=${()=>this._hover=null}>
          ${t.map((r,l)=>this._lane(r,l))}
          ${i!==null?F`<line class="hover" x1=${i} x2=${i} y1="0" y2=${s}></line>`:h}
        </svg>
      </div>
      <div class="axis">
        <span>${this._time(this.start)}</span>
        <span>${this._hover!==null?this._time(this._hover):""}</span>
        <span>${this._time(this.end)}</span>
      </div>`}_time(t){return new Date(t).toLocaleTimeString(this.lang,{hour:"2-digit",minute:"2-digit"})}};U.properties={series:{attribute:!1},start:{type:Number},end:{type:Number},noData:{type:String,attribute:"no-data"},lang:{type:String},_hover:{state:!0}},U.styles=C`
    .wrap { display: flex; gap: 8px; }
    .labels { flex: 0 0 auto; min-width: 120px; }
    .label { display: flex; flex-direction: column; justify-content: center; font-size: 12px;
      color: var(--secondary-text-color); position: relative; padding-left: 12px; }
    .label .val { font-size: 15px; color: var(--primary-text-color); font-variant-numeric: tabular-nums; }
    .dot { position: absolute; left: 0; top: 50%; width: 6px; height: 6px; border-radius: 50%;
      transform: translateY(-50%); }
    svg { flex: 1 1 auto; width: 100%; touch-action: none; display: block; }
    .line { fill: none; stroke-width: 2; vector-effect: non-scaling-stroke; }
    .band { fill: var(--success-color, #43a047); opacity: 0.12; }
    .sep { stroke: var(--divider-color); stroke-width: 1; vector-effect: non-scaling-stroke; }
    .hover { stroke: var(--secondary-text-color); stroke-width: 1; stroke-dasharray: 3 3;
      vector-effect: non-scaling-stroke; }
    .axis { display: flex; justify-content: space-between; font-size: 11px;
      color: var(--secondary-text-color); padding-left: 128px; margin-top: 2px; }
    .empty { color: var(--secondary-text-color); font-size: 13px; padding: 16px 0; }
  `;customElements.get("pg-chart")||customElements.define("pg-chart",U);var wt={en:{loading:"Loading\u2026",no_grow:"No grow configured. Add one under Settings \u2192 Devices & services \u2192 Precision Grow.",error:"Could not load grows",day:"Day",day_in_phase:"day in phase",climate:"Climate",light:"Light",irrigation:"Irrigation",reservoir:"Reservoir",temperature:"Temperature",humidity:"Humidity",vpd:"VPD",lvpd:"Leaf VPD",dli:"DLI",brightness:"Brightness",remaining:"remaining",weight:"Pot weight",dryback:"Dryback",shots_today:"Shots today",p_phase:"Day phase",water_temp:"Water temp",level:"Level",liters:"Volume",target:"target",chart_climate:"Climate 24 h",chart_dryback:"Pot weight 24 h",alerts:"Alerts",no_alerts:"No alerts",irrigation_locked:"Irrigation locked",irrigation_enabled:"Irrigation enabled",no_data:"No data",phases:{clone:"Clone",veg:"Veg",stretch:"Stretch",bulk:"Bulk",ripen:"Ripen",drying:"Drying"}},de:{loading:"Lade\u2026",no_grow:"Kein Grow eingerichtet. Unter Einstellungen \u2192 Ger\xE4te & Dienste \u2192 Precision Grow hinzuf\xFCgen.",error:"Grows konnten nicht geladen werden",day:"Tag",day_in_phase:"Tag in der Phase",climate:"Klima",light:"Licht",irrigation:"Bew\xE4sserung",reservoir:"Tank",temperature:"Temperatur",humidity:"Luftfeuchte",vpd:"VPD",lvpd:"Blatt-VPD",dli:"DLI",brightness:"Helligkeit",remaining:"\xFCbrig",weight:"Topfgewicht",dryback:"Dryback",shots_today:"Shots heute",p_phase:"Tagesphase",water_temp:"Wassertemp.",level:"F\xFCllstand",liters:"Menge",target:"Ziel",chart_climate:"Klima 24 h",chart_dryback:"Topfgewicht 24 h",alerts:"Warnungen",no_alerts:"Keine Warnungen",irrigation_locked:"Bew\xE4sserung gesperrt",irrigation_enabled:"Bew\xE4sserung aktiv",no_data:"Keine Daten",phases:{clone:"Steckling",veg:"Wachstum",stretch:"Stretch",bulk:"Bl\xFCte",ripen:"Reife",drying:"Trocknung"}}};function At(o){return(o||"en").split("-")[0]==="de"?wt.de:wt.en}var zt=300*1e3,Bt=24,St="precision_grow_panel_grow",O={temp:"var(--pg-temp, #e57373)",rh:"var(--pg-rh, #4fc3f7)",vpd:"var(--pg-vpd, #81c784)",weight:"var(--pg-weight, #ba68c8)",dryback:"var(--pg-dryback, #ffb74d)"},N=class extends m{constructor(){super(...arguments);this.narrow=!1;this._grows=null;this._selected=localStorage.getItem(St);this._error=null;this._history={};this._historyRange=[0,0]}connectedCallback(){super.connectedCallback(),this._timer=window.setInterval(()=>this._refresh(),zt)}disconnectedCallback(){super.disconnectedCallback(),this._timer&&window.clearInterval(this._timer)}firstUpdated(){this._refresh()}get _t(){return At(this.hass?.locale?.language??this.hass?.language)}get _grow(){if(this._grows?.length)return this._grows.find(t=>t.entry_id===this._selected)??this._grows[0]}async _refresh(){if(this.hass){try{let t=await this.hass.callWS({type:"precision_grow/grows"});this._grows=t.grows,this._error=null}catch(t){this._error=`${this._t.error}: ${t?.message??t}`;return}await this._loadHistory()}}async _loadHistory(){let t=this._grow;if(!t)return;let s=["temperature","humidity","vpd","weight","dryback_pct"].map(r=>t.entities[r]).filter(Boolean);if(!s.length)return;let i=Date.now(),n=i-Bt*3600*1e3;try{this._history=await this.hass.callWS({type:"history/history_during_period",start_time:new Date(n).toISOString(),end_time:new Date(i).toISOString(),entity_ids:s,minimal_response:!0,no_attributes:!0,significant_changes_only:!1}),this._historyRange=[n,i]}catch{this._history={}}}_select(t){this._selected=t.target.value,localStorage.setItem(St,this._selected),this._loadHistory()}_state(t){let s=this._grow?.entities[t];return s?this.hass.states[s]:void 0}_num(t){let s=this._state(t);if(!s)return null;let i=parseFloat(s.state);return isFinite(i)?i:null}_fmt(t,s=1){let i=this._state(t);if(!i||i.state==="unknown"||i.state==="unavailable")return"\u2013";let n=parseFloat(i.state),r=i.attributes.unit_of_measurement??"";if(!isFinite(n))return i.state;let l=this.hass.locale?.language??this.hass.language,a=n.toLocaleString(l,{maximumFractionDigits:s});return r?`${a} ${r}`:a}_status(t){return this._state(t)?.state}_range(t,s){return!Array.isArray(t)||t[0]==null||t[1]==null?"":`${this._t.target} ${t[0]}\u2013${t[1]} ${s}`}_moreInfo(t){let s=this._grow?.entities[t];s&&this.dispatchEvent(new CustomEvent("hass-more-info",{detail:{entityId:s},bubbles:!0,composed:!0}))}_points(t){let s=this._grow?.entities[t],i=s?this._history[s]:void 0;if(!i)return[];let n=[];for(let l of i){let a=parseFloat(l.s);isFinite(a)&&n.push([l.lu*1e3,a])}let r=this._num(t);return n.length&&r!==null&&n.push([Date.now(),r]),n}_band(t){let s=this._grow?.targets[t];return Array.isArray(s)?[s[0],s[1]]:null}_tile(t,s,i={}){return this._grow?.entities[t]?d`
      <button class="tile ${i.status??""}" @click=${()=>this._moreInfo(t)}>
        <span class="tlabel">${s}</span>
        <span class="tval">${this._fmt(t,i.decimals)}</span>
        ${i.sub?d`<span class="tsub">${i.sub}</span>`:h}
      </button>`:h}_header(t){let s=this._t;return d`
      <div class="toolbar">
        <ha-menu-button .hass=${this.hass} .narrow=${this.narrow}></ha-menu-button>
        <div class="title">Precision Grow</div>
        ${this._grows&&this._grows.length>1?d`<select @change=${this._select} .value=${t?.entry_id??""}>
              ${this._grows.map(i=>d`<option value=${i.entry_id}
                ?selected=${i.entry_id===t?.entry_id}>${i.title}</option>`)}
            </select>`:t?d`<div class="growname">${t.title}</div>`:h}
      </div>
      ${t?d`
        <div class="summary">
          <span class="phase">${s.phases[t.phase]??t.phase}</span>
          ${this._num("day_total")!==null?d`<span>${s.day} ${this._num("day_total")}</span>`:h}
          ${this._num("day_in_phase")!==null?d`<span>${this._num("day_in_phase")}. ${s.day_in_phase}</span>`:h}
          ${this._alertChip()}
        </div>`:h}`}_alertChip(){let t=this._state("alert_level");if(!t)return h;let s=t.attributes.count??0;return d`<button class="chip ${t.state}" @click=${()=>this._moreInfo("alert_level")}>
      ${s?`${this._t.alerts}: ${s}`:this._t.no_alerts}</button>`}_alerts(){let t=this._state("alert_level")?.attributes.items;return t?.length?d`<div class="card alerts">
      <h2>${this._t.alerts}</h2>
      ${t.map(s=>d`<div class="alert ${s.severity}">${s.message}</div>`)}
    </div>`:h}_irrigationSwitch(){let t=this._grow?.entities.irrigation_enabled,s=t?this.hass.states[t]:void 0;if(!t||!s)return h;let i=this._state("irrigation_locked")?.state==="on";return d`<div class="row">
      <span>${this._t.irrigation_enabled}</span>
      ${i?d`<span class="badge critical">${this._t.irrigation_locked}</span>`:h}
      <ha-switch .checked=${s.state==="on"}
        @change=${()=>this.hass.callService("switch","toggle",{entity_id:t})}></ha-switch>
    </div>`}render(){let t=this._t;if(this._error)return d`${this._header(void 0)}<div class="msg">${this._error}</div>`;if(this._grows===null)return d`${this._header(void 0)}<div class="msg">${t.loading}</div>`;let s=this._grow;if(!s)return d`${this._header(void 0)}<div class="msg">${t.no_grow}</div>`;let i=s.targets,n=[{label:t.temperature,unit:"\xB0C",color:O.temp,points:this._points("temperature"),band:this._band("temp_day")},{label:t.humidity,unit:"%",color:O.rh,points:this._points("humidity"),band:this._band("rh"),decimals:0},{label:t.vpd,unit:"kPa",color:O.vpd,points:this._points("vpd"),band:this._band("vpd"),decimals:2}],r=[{label:t.weight,unit:"g",color:O.weight,points:this._points("weight"),decimals:0},{label:t.dryback,unit:"%",color:O.dryback,points:this._points("dryback_pct"),band:this._band("dryback_p3")}],l=this._num("light_elapsed_pct"),[a]=this._historyRange,p=Date.now(),u=Math.min(...[...n,...r].map(_=>_.points[0]?.[0]??1/0)),c=isFinite(u)?Math.max(a,u):a,g=this.hass.locale?.language??this.hass.language;return d`
      ${this._header(s)}
      <div class="content">
        ${this._alerts()}

        <div class="card">
          <h2>${t.climate}</h2>
          <div class="tiles">
            ${this._tile("temperature",t.temperature,{sub:this._range(i.temp_day,"\xB0C")})}
            ${this._tile("humidity",t.humidity,{decimals:0,sub:this._range(i.rh,"%")})}
            ${this._tile("vpd",t.vpd,{decimals:2,sub:this._range(i.vpd,"kPa"),status:this._status("vpd_status")})}
            ${this._tile("lvpd",t.lvpd,{decimals:2})}
          </div>
          <h3>${t.chart_climate}</h3>
          <pg-chart .series=${n} .start=${c} .end=${p} .lang=${g} no-data=${t.no_data}></pg-chart>
        </div>

        <div class="card">
          <h2>${t.light}</h2>
          <div class="tiles">
            ${this._tile("brightness_pct",t.brightness,{decimals:0,sub:s.brightness_target!=null?`${t.target} ${s.brightness_target} %`:""})}
            ${this._tile("dli",t.dli,{sub:this._range(s.dli_target,"mol/m\xB2/d"),status:this._status("dli_status")})}
            ${this._tile("light_remaining",t.remaining,{decimals:1})}
          </div>
          ${l!==null?d`<div class="progress"><div style="width:${Math.min(100,l)}%"></div></div>`:h}
        </div>

        <div class="card">
          <h2>${t.irrigation}</h2>
          <div class="tiles">
            ${this._tile("weight",t.weight,{decimals:0})}
            ${this._tile("dryback_pct",t.dryback,{sub:this._range(i.dryback_p3,"%"),status:this._status("dryback_status")})}
            ${this._tile("p_phase",t.p_phase)}
            ${this._tile("irrigation_shots_today",t.shots_today,{decimals:0})}
          </div>
          ${this._irrigationSwitch()}
          <h3>${t.chart_dryback}</h3>
          <pg-chart .series=${r} .start=${c} .end=${p} .lang=${g} no-data=${t.no_data}></pg-chart>
        </div>

        <div class="card">
          <h2>${t.reservoir}</h2>
          <div class="tiles">
            ${this._tile("reservoir_pct",t.level,{decimals:0,status:this._reservoirStatus()})}
            ${this._tile("reservoir_liters",t.liters,{decimals:1})}
            ${this._tile("water_temp",t.water_temp)}
          </div>
        </div>
      </div>`}_reservoirStatus(){let t=this._status("reservoir_status");if(t==="critical")return"critical";if(t==="low"||t==="warning")return"warning"}};N.properties={hass:{attribute:!1},narrow:{type:Boolean},_grows:{state:!0},_selected:{state:!0},_error:{state:!0},_history:{state:!0},_historyRange:{state:!0}},N.styles=C`
    :host { display: block; background: var(--primary-background-color); min-height: 100vh;
      color: var(--primary-text-color); font-family: var(--paper-font-body1_-_font-family, inherit); }
    .toolbar { display: flex; align-items: center; height: var(--header-height, 56px); padding: 0 12px;
      background: var(--app-header-background-color, var(--primary-color));
      color: var(--app-header-text-color, var(--text-primary-color)); gap: 8px;
      border-bottom: var(--app-header-border-bottom, none); }
    .title { font-size: 20px; flex: 1; }
    .growname { font-size: 14px; opacity: 0.85; }
    select { font: inherit; background: transparent; color: inherit; border: 1px solid currentColor;
      border-radius: 6px; padding: 4px 8px; }
    select option { color: var(--primary-text-color); background: var(--card-background-color); }
    .summary { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; padding: 12px 16px 0;
      color: var(--secondary-text-color); font-size: 14px; }
    .phase { color: var(--primary-text-color); font-weight: 500; font-size: 16px; }
    .content { display: grid; gap: 16px; padding: 16px;
      grid-template-columns: repeat(auto-fill, minmax(min(100%, 420px), 1fr)); align-items: start; }
    .card { background: var(--card-background-color); border-radius: var(--ha-card-border-radius, 12px);
      box-shadow: var(--ha-card-box-shadow, none); border: 1px solid var(--divider-color);
      padding: 16px; }
    h2 { margin: 0 0 12px; font-size: 16px; font-weight: 500; }
    h3 { margin: 16px 0 6px; font-size: 13px; font-weight: 500; color: var(--secondary-text-color); }
    .tiles { display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 8px; }
    .tile { all: unset; cursor: pointer; display: flex; flex-direction: column; gap: 2px; padding: 10px 12px;
      border-radius: 8px; background: var(--secondary-background-color);
      border-left: 3px solid transparent; }
    .tile:focus-visible { outline: 2px solid var(--primary-color); }
    .tile.optimal { border-left-color: var(--success-color, #43a047); }
    .tile.high, .tile.low, .tile.warning { border-left-color: var(--warning-color, #ffa000); }
    .tile.critical { border-left-color: var(--error-color, #db4437); }
    .tlabel { font-size: 12px; color: var(--secondary-text-color); }
    .tval { font-size: 20px; font-variant-numeric: tabular-nums; }
    .tsub { font-size: 11px; color: var(--secondary-text-color); }
    .progress { height: 6px; border-radius: 3px; background: var(--secondary-background-color);
      margin-top: 12px; overflow: hidden; }
    .progress div { height: 100%; background: var(--warning-color, #ffa000); }
    .row { display: flex; align-items: center; gap: 8px; margin-top: 12px; }
    .row span:first-child { flex: 1; }
    .badge, .chip { font-size: 12px; padding: 2px 8px; border-radius: 10px;
      background: var(--secondary-background-color); }
    .chip { all: unset; cursor: pointer; font-size: 12px; padding: 2px 10px; border-radius: 10px;
      background: var(--secondary-background-color); color: var(--primary-text-color); }
    .chip.warning, .badge.warning { background: var(--warning-color, #ffa000); color: #000; }
    .chip.critical, .badge.critical { background: var(--error-color, #db4437); color: #fff; }
    .alerts { grid-column: 1 / -1; }
    .alert { padding: 6px 10px; border-radius: 6px; margin-top: 6px; font-size: 14px;
      border-left: 3px solid var(--info-color, #039be5); background: var(--secondary-background-color); }
    .alert.warning { border-left-color: var(--warning-color, #ffa000); }
    .alert.critical { border-left-color: var(--error-color, #db4437); }
    .msg { padding: 24px 16px; color: var(--secondary-text-color); }
  `;customElements.get("precision-grow-panel")||customElements.define("precision-grow-panel",N);
