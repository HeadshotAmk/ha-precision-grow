var K=globalThis,q=K.ShadowRoot&&(K.ShadyCSS===void 0||K.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,rt=Symbol(),yt=new WeakMap,M=class{constructor(t,s,r){if(this._$cssResult$=!0,r!==rt)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=s}get styleSheet(){let t=this.o,s=this.t;if(q&&t===void 0){let r=s!==void 0&&s.length===1;r&&(t=yt.get(s)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),r&&yt.set(s,t))}return t}toString(){return this.cssText}},xt=e=>new M(typeof e=="string"?e:e+"",void 0,rt),k=(e,...t)=>{let s=e.length===1?e[0]:t.reduce((r,i,n)=>r+(a=>{if(a._$cssResult$===!0)return a.cssText;if(typeof a=="number")return a;throw Error("Value passed to 'css' function must be a 'css' function result: "+a+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+e[n+1],e[0]);return new M(s,e,rt)},wt=(e,t)=>{if(q)e.adoptedStyleSheets=t.map(s=>s instanceof CSSStyleSheet?s:s.styleSheet);else for(let s of t){let r=document.createElement("style"),i=K.litNonce;i!==void 0&&r.setAttribute("nonce",i),r.textContent=s.cssText,e.appendChild(r)}},it=q?e=>e:e=>e instanceof CSSStyleSheet?(t=>{let s="";for(let r of t.cssRules)s+=r.cssText;return xt(s)})(e):e;var{is:ee,defineProperty:se,getOwnPropertyDescriptor:re,getOwnPropertyNames:ie,getOwnPropertySymbols:ne,getPrototypeOf:ae}=Object,Y=globalThis,kt=Y.trustedTypes,oe=kt?kt.emptyScript:"",le=Y.reactiveElementPolyfillSupport,O=(e,t)=>e,nt={toAttribute(e,t){switch(t){case Boolean:e=e?oe:null;break;case Object:case Array:e=e==null?e:JSON.stringify(e)}return e},fromAttribute(e,t){let s=e;switch(t){case Boolean:s=e!==null;break;case Number:s=e===null?null:Number(e);break;case Object:case Array:try{s=JSON.parse(e)}catch{s=null}}return s}},Et=(e,t)=>!ee(e,t),St={attribute:!0,type:String,converter:nt,reflect:!1,useDefault:!1,hasChanged:Et};Symbol.metadata??=Symbol("metadata"),Y.litPropertyMetadata??=new WeakMap;var y=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,s=St){if(s.state&&(s.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((s=Object.create(s)).wrapped=!0),this.elementProperties.set(t,s),!s.noAccessor){let r=Symbol(),i=this.getPropertyDescriptor(t,r,s);i!==void 0&&se(this.prototype,t,i)}}static getPropertyDescriptor(t,s,r){let{get:i,set:n}=re(this.prototype,t)??{get(){return this[s]},set(a){this[s]=a}};return{get:i,set(a){let d=i?.call(this);n?.call(this,a),this.requestUpdate(t,d,r)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??St}static _$Ei(){if(this.hasOwnProperty(O("elementProperties")))return;let t=ae(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(O("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(O("properties"))){let s=this.properties,r=[...ie(s),...ne(s)];for(let i of r)this.createProperty(i,s[i])}let t=this[Symbol.metadata];if(t!==null){let s=litPropertyMetadata.get(t);if(s!==void 0)for(let[r,i]of s)this.elementProperties.set(r,i)}this._$Eh=new Map;for(let[s,r]of this.elementProperties){let i=this._$Eu(s,r);i!==void 0&&this._$Eh.set(i,s)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let s=[];if(Array.isArray(t)){let r=new Set(t.flat(1/0).reverse());for(let i of r)s.unshift(it(i))}else t!==void 0&&s.push(it(t));return s}static _$Eu(t,s){let r=s.attribute;return r===!1?void 0:typeof r=="string"?r:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,s=this.constructor.elementProperties;for(let r of s.keys())this.hasOwnProperty(r)&&(t.set(r,this[r]),delete this[r]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return wt(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,s,r){this._$AK(t,r)}_$ET(t,s){let r=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,r);if(i!==void 0&&r.reflect===!0){let n=(r.converter?.toAttribute!==void 0?r.converter:nt).toAttribute(s,r.type);this._$Em=t,n==null?this.removeAttribute(i):this.setAttribute(i,n),this._$Em=null}}_$AK(t,s){let r=this.constructor,i=r._$Eh.get(t);if(i!==void 0&&this._$Em!==i){let n=r.getPropertyOptions(i),a=typeof n.converter=="function"?{fromAttribute:n.converter}:n.converter?.fromAttribute!==void 0?n.converter:nt;this._$Em=i;let d=a.fromAttribute(s,n.type);this[i]=d??this._$Ej?.get(i)??d,this._$Em=null}}requestUpdate(t,s,r,i=!1,n){if(t!==void 0){let a=this.constructor;if(i===!1&&(n=this[t]),r??=a.getPropertyOptions(t),!((r.hasChanged??Et)(n,s)||r.useDefault&&r.reflect&&n===this._$Ej?.get(t)&&!this.hasAttribute(a._$Eu(t,r))))return;this.C(t,s,r)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,s,{useDefault:r,reflect:i,wrapped:n},a){r&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,a??s??this[t]),n!==!0||a!==void 0)||(this._$AL.has(t)||(this.hasUpdated||r||(s=void 0),this._$AL.set(t,s)),i===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(s){Promise.reject(s)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[i,n]of this._$Ep)this[i]=n;this._$Ep=void 0}let r=this.constructor.elementProperties;if(r.size>0)for(let[i,n]of r){let{wrapped:a}=n,d=this[i];a!==!0||this._$AL.has(i)||d===void 0||this.C(i,void 0,n,d)}}let t=!1,s=this._$AL;try{t=this.shouldUpdate(s),t?(this.willUpdate(s),this._$EO?.forEach(r=>r.hostUpdate?.()),this.update(s)):this._$EM()}catch(r){throw t=!1,this._$EM(),r}t&&this._$AE(s)}willUpdate(t){}_$AE(t){this._$EO?.forEach(s=>s.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(s=>this._$ET(s,this[s])),this._$EM()}updated(t){}firstUpdated(t){}};y.elementStyles=[],y.shadowRootOptions={mode:"open"},y[O("elementProperties")]=new Map,y[O("finalized")]=new Map,le?.({ReactiveElement:y}),(Y.reactiveElementVersions??=[]).push("2.1.2");var ht=globalThis,At=e=>e,Z=ht.trustedTypes,Tt=Z?Z.createPolicy("lit-html",{createHTML:e=>e}):void 0,zt="$lit$",x=`lit$${Math.random().toFixed(9).slice(2)}$`,Ht="?"+x,de=`<${Ht}>`,A=document,I=()=>A.createComment(""),F=e=>e===null||typeof e!="object"&&typeof e!="function",ut=Array.isArray,ce=e=>ut(e)||typeof e?.[Symbol.iterator]=="function",at=`[ 	
\f\r]`,N=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Ct=/-->/g,Rt=/>/g,S=RegExp(`>|${at}(?:([^\\s"'>=/]+)(${at}*=${at}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Pt=/'/g,Dt=/"/g,Mt=/^(?:script|style|textarea|title)$/i,mt=e=>(t,...s)=>({_$litType$:e,strings:t,values:s}),l=mt(1),J=mt(2),Fe=mt(3),T=Symbol.for("lit-noChange"),c=Symbol.for("lit-nothing"),Lt=new WeakMap,E=A.createTreeWalker(A,129);function Ot(e,t){if(!ut(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return Tt!==void 0?Tt.createHTML(t):t}var pe=(e,t)=>{let s=e.length-1,r=[],i,n=t===2?"<svg>":t===3?"<math>":"",a=N;for(let d=0;d<s;d++){let o=e[d],p,h,u=-1,g=0;for(;g<o.length&&(a.lastIndex=g,h=a.exec(o),h!==null);)g=a.lastIndex,a===N?h[1]==="!--"?a=Ct:h[1]!==void 0?a=Rt:h[2]!==void 0?(Mt.test(h[2])&&(i=RegExp("</"+h[2],"g")),a=S):h[3]!==void 0&&(a=S):a===S?h[0]===">"?(a=i??N,u=-1):h[1]===void 0?u=-2:(u=a.lastIndex-h[2].length,p=h[1],a=h[3]===void 0?S:h[3]==='"'?Dt:Pt):a===Dt||a===Pt?a=S:a===Ct||a===Rt?a=N:(a=S,i=void 0);let f=a===S&&e[d+1].startsWith("/>")?" ":"";n+=a===N?o+de:u>=0?(r.push(p),o.slice(0,u)+zt+o.slice(u)+x+f):o+x+(u===-2?d:f)}return[Ot(e,n+(e[s]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),r]},U=class e{constructor({strings:t,_$litType$:s},r){let i;this.parts=[];let n=0,a=0,d=t.length-1,o=this.parts,[p,h]=pe(t,s);if(this.el=e.createElement(p,r),E.currentNode=this.el.content,s===2||s===3){let u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(i=E.nextNode())!==null&&o.length<d;){if(i.nodeType===1){if(i.hasAttributes())for(let u of i.getAttributeNames())if(u.endsWith(zt)){let g=h[a++],f=i.getAttribute(u).split(x),w=/([.?@])?(.*)/.exec(g);o.push({type:1,index:n,name:w[2],strings:f,ctor:w[1]==="."?lt:w[1]==="?"?dt:w[1]==="@"?ct:L}),i.removeAttribute(u)}else u.startsWith(x)&&(o.push({type:6,index:n}),i.removeAttribute(u));if(Mt.test(i.tagName)){let u=i.textContent.split(x),g=u.length-1;if(g>0){i.textContent=Z?Z.emptyScript:"";for(let f=0;f<g;f++)i.append(u[f],I()),E.nextNode(),o.push({type:2,index:++n});i.append(u[g],I())}}}else if(i.nodeType===8)if(i.data===Ht)o.push({type:2,index:n});else{let u=-1;for(;(u=i.data.indexOf(x,u+1))!==-1;)o.push({type:7,index:n}),u+=x.length-1}n++}}static createElement(t,s){let r=A.createElement("template");return r.innerHTML=t,r}};function D(e,t,s=e,r){if(t===T)return t;let i=r!==void 0?s._$Co?.[r]:s._$Cl,n=F(t)?void 0:t._$litDirective$;return i?.constructor!==n&&(i?._$AO?.(!1),n===void 0?i=void 0:(i=new n(e),i._$AT(e,s,r)),r!==void 0?(s._$Co??=[])[r]=i:s._$Cl=i),i!==void 0&&(t=D(e,i._$AS(e,t.values),i,r)),t}var ot=class{constructor(t,s){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=s}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:s},parts:r}=this._$AD,i=(t?.creationScope??A).importNode(s,!0);E.currentNode=i;let n=E.nextNode(),a=0,d=0,o=r[0];for(;o!==void 0;){if(a===o.index){let p;o.type===2?p=new V(n,n.nextSibling,this,t):o.type===1?p=new o.ctor(n,o.name,o.strings,this,t):o.type===6&&(p=new pt(n,this,t)),this._$AV.push(p),o=r[++d]}a!==o?.index&&(n=E.nextNode(),a++)}return E.currentNode=A,i}p(t){let s=0;for(let r of this._$AV)r!==void 0&&(r.strings!==void 0?(r._$AI(t,r,s),s+=r.strings.length-2):r._$AI(t[s])),s++}},V=class e{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,s,r,i){this.type=2,this._$AH=c,this._$AN=void 0,this._$AA=t,this._$AB=s,this._$AM=r,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,s=this._$AM;return s!==void 0&&t?.nodeType===11&&(t=s.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,s=this){t=D(this,t,s),F(t)?t===c||t==null||t===""?(this._$AH!==c&&this._$AR(),this._$AH=c):t!==this._$AH&&t!==T&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):ce(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==c&&F(this._$AH)?this._$AA.nextSibling.data=t:this.T(A.createTextNode(t)),this._$AH=t}$(t){let{values:s,_$litType$:r}=t,i=typeof r=="number"?this._$AC(t):(r.el===void 0&&(r.el=U.createElement(Ot(r.h,r.h[0]),this.options)),r);if(this._$AH?._$AD===i)this._$AH.p(s);else{let n=new ot(i,this),a=n.u(this.options);n.p(s),this.T(a),this._$AH=n}}_$AC(t){let s=Lt.get(t.strings);return s===void 0&&Lt.set(t.strings,s=new U(t)),s}k(t){ut(this._$AH)||(this._$AH=[],this._$AR());let s=this._$AH,r,i=0;for(let n of t)i===s.length?s.push(r=new e(this.O(I()),this.O(I()),this,this.options)):r=s[i],r._$AI(n),i++;i<s.length&&(this._$AR(r&&r._$AB.nextSibling,i),s.length=i)}_$AR(t=this._$AA.nextSibling,s){for(this._$AP?.(!1,!0,s);t!==this._$AB;){let r=At(t).nextSibling;At(t).remove(),t=r}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},L=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,s,r,i,n){this.type=1,this._$AH=c,this._$AN=void 0,this.element=t,this.name=s,this._$AM=i,this.options=n,r.length>2||r[0]!==""||r[1]!==""?(this._$AH=Array(r.length-1).fill(new String),this.strings=r):this._$AH=c}_$AI(t,s=this,r,i){let n=this.strings,a=!1;if(n===void 0)t=D(this,t,s,0),a=!F(t)||t!==this._$AH&&t!==T,a&&(this._$AH=t);else{let d=t,o,p;for(t=n[0],o=0;o<n.length-1;o++)p=D(this,d[r+o],s,o),p===T&&(p=this._$AH[o]),a||=!F(p)||p!==this._$AH[o],p===c?t=c:t!==c&&(t+=(p??"")+n[o+1]),this._$AH[o]=p}a&&!i&&this.j(t)}j(t){t===c?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},lt=class extends L{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===c?void 0:t}},dt=class extends L{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==c)}},ct=class extends L{constructor(t,s,r,i,n){super(t,s,r,i,n),this.type=5}_$AI(t,s=this){if((t=D(this,t,s,0)??c)===T)return;let r=this._$AH,i=t===c&&r!==c||t.capture!==r.capture||t.once!==r.once||t.passive!==r.passive,n=t!==c&&(r===c||i);i&&this.element.removeEventListener(this.name,this,r),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},pt=class{constructor(t,s,r){this.element=t,this.type=6,this._$AN=void 0,this._$AM=s,this.options=r}get _$AU(){return this._$AM._$AU}_$AI(t){D(this,t)}};var he=ht.litHtmlPolyfillSupport;he?.(U,V),(ht.litHtmlVersions??=[]).push("3.3.3");var Nt=(e,t,s)=>{let r=s?.renderBefore??t,i=r._$litPart$;if(i===void 0){let n=s?.renderBefore??null;r._$litPart$=i=new V(t.insertBefore(I(),n),n,void 0,s??{})}return i._$AI(e),i};var gt=globalThis,v=class extends y{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let s=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Nt(s,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return T}};v._$litElement$=!0,v.finalized=!0,gt.litElementHydrateSupport?.({LitElement:v});var ue=gt.litElementPolyfillSupport;ue?.({LitElement:v});(gt.litElementVersions??=[]).push("4.2.2");var X=600,C=56,Q=4,It=4,B=class extends v{constructor(){super(...arguments);this.series=[];this.start=0;this.end=0;this.noData="No data";this.lang="en";this._hover=null}_x(s){let r=Math.max(1,this.end-this.start);return Q+(s-this.start)/r*(X-Q-It)}_range(s){let r=1/0,i=-1/0;for(let[,a]of s.points)a<r&&(r=a),a>i&&(i=a);if(s.band&&(r=Math.min(r,s.band[0]),i=Math.max(i,s.band[1])),!isFinite(r))return[0,1];if(i-r<1e-6)return[r-1,i+1];let n=(i-r)*.08;return[r-n,i+n]}_valueAt(s,r){let i=null;for(let[n,a]of s.points){if(n>r)break;i=a}return i}_onMove(s){let r=s.currentTarget.getBoundingClientRect(),i=(s.clientX-r.left)/r.width;this._hover=this.start+Math.min(1,Math.max(0,i))*(this.end-this.start)}_lane(s,r){let[i,n]=this._range(s),a=h=>C-4-(h-i)/(n-i)*(C-8),d=r*C,o="";s.points.forEach(([h,u],g)=>{let f=this._x(h).toFixed(1),w=(d+a(u)).toFixed(1);if(g===0)o+=`M${f},${w}`;else{let te=(d+a(s.points[g-1][1])).toFixed(1);o+=`L${f},${te}L${f},${w}`}}),s.points.length&&(o+=`L${this._x(this.end).toFixed(1)},${(d+a(s.points[s.points.length-1][1])).toFixed(1)}`);let p=s.band?J`<rect class="band" x=${Q} width=${X-Q-It}
          y=${d+a(s.band[1])} height=${Math.max(0,a(s.band[0])-a(s.band[1]))}></rect>`:c;return J`
      <line class="sep" x1="0" x2=${X} y1=${d+C} y2=${d+C}></line>
      ${p}
      <path d=${o} stroke=${s.color} class="line"></path>`}render(){let s=this.series.filter(a=>a.points.length);if(!s.length)return l`<div class="empty">${this.noData}</div>`;let r=s.length*C,i=this._hover!==null?this._x(this._hover):null,n=a=>a.decimals??1;return l`
      <div class="wrap">
        <div class="labels">
          ${s.map(a=>{let d=this._hover!==null?this._valueAt(a,this._hover):a.points[a.points.length-1][1];return l`<div class="label" style="height:${C}px">
              <span class="dot" style="background:${a.color}"></span>
              <span class="name">${a.label}</span>
              <span class="val">${d===null?"\u2013":d.toLocaleString(this.lang,{minimumFractionDigits:n(a),maximumFractionDigits:n(a)})} ${a.unit}</span>
            </div>`})}
        </div>
        <svg viewBox="0 0 ${X} ${r}" preserveAspectRatio="none" style="height:${r}px"
          @pointermove=${this._onMove} @pointerleave=${()=>this._hover=null}>
          ${s.map((a,d)=>this._lane(a,d))}
          ${i!==null?J`<line class="hover" x1=${i} x2=${i} y1="0" y2=${r}></line>`:c}
        </svg>
      </div>
      <div class="axis">
        <span>${this._time(this.start)}</span>
        <span>${this._hover!==null?this._time(this._hover):""}</span>
        <span>${this._time(this.end)}</span>
      </div>`}_time(s){let r=new Date(s);return this.end-this.start>36*3600*1e3?r.toLocaleDateString(this.lang,{day:"2-digit",month:"2-digit"}):r.toLocaleTimeString(this.lang,{hour:"2-digit",minute:"2-digit"})}};B.properties={series:{attribute:!1},start:{type:Number},end:{type:Number},noData:{type:String,attribute:"no-data"},lang:{type:String},_hover:{state:!0}},B.styles=k`
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
  `;customElements.get("pg-chart")||customElements.define("pg-chart",B);var tt=class{constructor(t,s,r,i,n){this.hass=t;this.grow=s;this.t=r;this.history=i;this.host=n}get lang(){return this.hass.locale?.language??this.hass.language}state(t){let s=this.grow.entities[t];return s?this.hass.states[s]:void 0}has(t){return!!this.state(t)}num(t){let s=this.state(t);if(!s)return null;let r=parseFloat(s.state);return isFinite(r)?r:null}number(t,s=1){return t.toLocaleString(this.lang,{maximumFractionDigits:s})}fmt(t,s=1){let r=this.state(t);if(!r||r.state==="unknown"||r.state==="unavailable")return"\u2013";let i=parseFloat(r.state),n=r.attributes.unit_of_measurement??"";if(!isFinite(i))return r.state;let a=this.number(i,s);return n?`${a} ${n}`:a}status(t){return this.state(t)?.state}range(t,s){return!Array.isArray(t)||t[0]==null||t[1]==null?"":`${this.t.target} ${t[0]}\u2013${t[1]} ${s}`}band(t){let s=this.grow.targets[t];return Array.isArray(s)?[s[0],s[1]]:null}date(t){if(!t)return"\u2013";let s=new Date(t.length===10?`${t}T00:00:00`:t);return isNaN(s.getTime())?t:s.toLocaleDateString(this.lang,{day:"2-digit",month:"2-digit",year:"numeric"})}moreInfo(t){let s=this.grow.entities[t]??t;this.host.dispatchEvent(new CustomEvent("hass-more-info",{detail:{entityId:s},bubbles:!0,composed:!0}))}toast(t){this.host.dispatchEvent(new CustomEvent("hass-notification",{detail:{message:t},bubbles:!0,composed:!0}))}async service(t,s){try{return await this.hass.callService("precision_grow",t,{entry_id:this.grow.entry_id,...s}),this.toast(this.t.saved),!0}catch(r){return this.toast(`${this.t.save_failed}: ${r?.message??r}`),!1}}points(t,s=!0){let r=this.grow.entities[t],i=r?this.history[r]:void 0;if(!i)return[];let n=[];for(let d of i){let o=parseFloat(d.s);isFinite(o)&&n.push([d.lu*1e3,o])}let a=this.num(t);return s&&n.length&&a!==null&&n.push([Date.now(),a]),n}tile(t,s,r={}){return this.grow.entities[t]?l`
      <button class="tile ${r.status??""}" @click=${()=>this.moreInfo(t)}>
        <span class="tlabel">${s}</span>
        <span class="tval">${r.value??this.fmt(t,r.decimals)}</span>
        ${r.sub?l`<span class="tsub">${r.sub}</span>`:c}
      </button>`:c}};async function et(e,t,s,r,i={}){try{return await e.hass.callService(t,s,{entity_id:r,...i}),e.toast(e.t.saved),!0}catch(n){return e.toast(`${e.t.save_failed}: ${n?.message??n}`),!1}}function Ft(e,t,s){return l`<div class="field">
    <label>${e}${t}</label>
    ${s?l`<div class="hint">${s}</div>`:c}
  </div>`}function m(e,t,s,r={}){let i=e.grow.entities[t],n=i?e.hass.states[i]:void 0;if(!i||!n)return c;let a=n.attributes,d=a.unit_of_measurement?` (${a.unit_of_measurement})`:"",o=p=>{let h=p.target,u=b(h.value);if(u===void 0||!h.checkValidity()){h.value=n.state;return}et(e,"number","set_value",i,{value:u})};return Ft(`${s}${d}`,l`<input type="number" inputmode="decimal"
    min=${a.min??""} max=${a.max??""} step=${a.step??"any"}
    .value=${n.state==="unknown"||n.state==="unavailable"?"":n.state}
    @change=${o}>`,r.hint)}function Ut(e,t,s,r={}){let i=e.grow.entities[t],n=i?e.hass.states[i]:void 0;if(!i||!n)return c;let a=d=>{let o=d.target.value;/^\d{2}:\d{2}$/.test(o)&&et(e,"time","set_value",i,{time:`${o}:00`})};return Ft(s,l`<input type="time" .value=${n.state.slice(0,5)} @change=${a}>`,r.hint)}function _(e,t,s,r,i=!1){let n=e.grow.entities[t];if(!n)return c;let a=()=>et(e,"button","press",n);return r?l`<pg-confirm-button label=${s} confirm-label=${r} ?disabled=${i}
      @confirmed=${a}></pg-confirm-button>`:l`<button class="action" ?disabled=${i} @click=${a}>${s}</button>`}function Vt(e,t,s,r,i){let n=e.grow.entities[t],a=n?e.hass.states[n]:void 0;if(!n||!a)return c;let d=a.state,o=a.attributes.options??[];return l`<div class="field">
    <label>${s}
      <select class="input" @change=${p=>d=p.target.value}>
        ${o.map(p=>l`<option value=${p} ?selected=${p===a.state}>${r[p]??p}</option>`)}
      </select>
    </label>
    <pg-confirm-button label=${e.t.apply} confirm-label=${i}
      @confirmed=${()=>d!==a.state&&et(e,"select","select_option",n,{option:d})}></pg-confirm-button>
  </div>`}function R(e){let t={};return new FormData(e).forEach((s,r)=>{let i=String(s).trim();i!==""&&(t[r]=i)}),t}function b(e){if(e===void 0)return;let t=parseFloat(e.replace(",","."));return isFinite(t)?t:void 0}var me={loading:"Loading\u2026",no_grow:"No grow configured. Add one under Settings \u2192 Devices & services \u2192 Precision Grow.",error:"Could not load grows",saved:"Saved",save_failed:"Saving failed",save:"Save",day:"Day",day_in_phase:"day in phase",tabs:{overview:"Overview",nutrients:"Nutrients",energy:"Energy & cost",log:"Grow log",settings:"Settings"},climate:"Climate",light:"Light",irrigation:"Irrigation",reservoir:"Reservoir",temperature:"Temperature",humidity:"Humidity",vpd:"VPD",lvpd:"Leaf VPD",dli:"DLI",brightness:"Brightness",remaining:"remaining",weight:"Pot weight",dryback:"Dryback",shots_today:"Shots today",p_phase:"Day phase",water_temp:"Water temp",level:"Level",liters:"Volume",target:"target",chart_climate:"Climate 24 h",chart_dryback:"Pot weight 24 h",alerts:"Alerts",no_alerts:"No alerts",irrigation_locked:"Irrigation locked",irrigation_enabled:"Irrigation enabled",no_data:"No data",feed:"Feed",ec:"EC",ph:"pH",recommendation:"Recommendation",last_runoff:"Last runoff",target_ec:"Target EC",log_runoff:"Log runoff",runoff_ec:"Runoff EC (mS/cm)",runoff_ph:"Runoff pH",volume_ml:"Volume (mL)",ppm:"PPM",note:"Note",chart_feed:"Feed EC / pH 7 days",trend:"Trend",ec_vs_feed:"Runoff vs. feed",recommendations:{increase_ec:"Increase EC",keep_ec:"Keep EC",reduce_ec:"Reduce EC",flush:"Flush",check_roots:"Check roots"},trends:{substrate_ec_falling:"substrate EC falling",balanced:"balanced",ec_stacking:"EC stacking",normal:"normal",check_rootzone:"check root zone",stable:"stable"},cost_today:"Per day",cost_total:"Energy cost",kwh_total:"Energy",cost_per_gram:"Cost per gram",extras:"Extra costs",kwh_per_device:"Energy per device",chart_cost:"Energy cost 30 days",log_cost:"Log extra cost",amount:"Amount (\u20AC)",recent_costs:"Recent extra costs",harvest:"Harvest",wet_g:"Wet weight (g)",dry_g:"Dry weight (g)",extra_cost:"Extra cost (\u20AC)",drying_loss:"Drying loss",settings_light:"Light",lights_on:"Lights on",photoperiod:"Photoperiod veg",flower_photoperiod:"Photoperiod flower",ppfd_calibration:"PPFD estimate (without PAR sensor)",ppfd_at_full:"PPFD at 100 %",ppfd_ref_distance:"Distance at that measurement",light_distance:"Current lamp distance",ppfd_manual:"PPFD manual",ppfd_hint:"Measure PPFD once at 100 % brightness and note the distance; the panel estimates PPFD from brightness and distance.",settings_phase:"Phase",phase:"Phase",apply:"Apply",confirm_phase:"Really change phase?",advance_phase:"Next phase",confirm_advance:"Really next phase?",flower_switch:"12/12 switch",flower_switch_due:"12/12 switch is due",confirm_flower:"Switch to 12/12",confirm_flower_q:"Really switch to 12/12?",postpone_flower:"Postpone",postpone_days:"Postpone by",settings_calibration:"Calibration",cal_reservoir:"Reservoir",cal_res_hint:"Press 'Empty' with an empty tank and 'Full' with a full tank. The current distance is stored.",res_empty:"Empty",res_full:"Full",measured_now:"Measured now",stored:"Stored",cal_pot:"Pot weight",cal_pot_hint:"Field capacity: press right after a full irrigation once runoff stops. Dry weight: press with dry substrate (or empty pot with substrate).",cal_fc:"Field capacity",cal_dry:"Dry weight",reset_dryback:"Reset dryback",leaf_offset:"Leaf temperature offset",leaf_hint:"Leaf minus air temperature (IR thermometer), used for leaf VPD.",settings_safety:"Irrigation safety",max_shot_seconds:"Max shot duration",max_shots_per_day:"Max shots per day",max_daily_runtime:"Max pump runtime per day",max_saturation:"Max saturation",safety_hint:"Hard limits enforced by the integration, independent of automations. 0 = unlimited where allowed.",settings_grow:"Grow data",container_size:"Container size",tank_volume:"Reservoir volume",power_price:"Power price",settings_tools:"Tools",test_setup:"Test setup",confirm_test_setup:"Really test? Devices switch on briefly",test_pump:"Test pump",confirm_test_pump:"Really run the pump?",no_pump:"No pump assigned",test_result:"Last test",export_csv:"Export CSV",archive_grow:"Archive grow",confirm_archive:"Really archive?",mute_alerts:"Mute alerts (1 h)",phase_timeline:"Phase timeline",next_event:"Next training step",flower_day:"Flower day",in_days:"in {n} days",today:"today",diary:"Diary",diary_today:"Today's entry",comment:"Comment",image:"Image (path or URL)",no_entries:"No diary entries yet",since:"since",training:{lollipopping:"Lollipopping",defoliation_1:"Defoliation 1",defoliation_2:"Defoliation 2",flush:"Flush",harvest_check:"Harvest check"},phases:{clone:"Clone",veg:"Veg",stretch:"Stretch",bulk:"Bulk",ripen:"Ripen",drying:"Drying"},alert_text:{vpd_high:"VPD too high",vpd_low:"VPD too low",dli_high:"DLI too high",dli_low:"DLI too low",co2_high:"CO\u2082 too high",co2_low:"CO\u2082 too low",dryback_high:"Dryback too high",dryback_low:"Dryback too low",reservoir_low:"Reservoir low",reservoir_critical:"Reservoir critically low",irrigation_locked:"Irrigation locked ({reasons})",flower_switch_due:"12/12 flower switch due",phase_switch_due:"Phase switch due: {phase} \u2192 {to}"},lock_reasons:{kill_switch:"switched off",daily_shot_cap:"daily shot limit",daily_runtime_cap:"daily runtime limit",pot_saturated:"pot saturated",substrate_saturated:"substrate saturated",reservoir_critical:"reservoir empty"}},ge={loading:"Lade\u2026",no_grow:"Kein Grow eingerichtet. Unter Einstellungen \u2192 Ger\xE4te & Dienste \u2192 Precision Grow hinzuf\xFCgen.",error:"Grows konnten nicht geladen werden",saved:"Gespeichert",save_failed:"Speichern fehlgeschlagen",save:"Speichern",day:"Tag",day_in_phase:"Tag in der Phase",tabs:{overview:"\xDCbersicht",nutrients:"N\xE4hrstoffe",energy:"Energie & Kosten",log:"Grow-Log",settings:"Einstellungen"},climate:"Klima",light:"Licht",irrigation:"Bew\xE4sserung",reservoir:"Tank",temperature:"Temperatur",humidity:"Luftfeuchte",vpd:"VPD",lvpd:"Blatt-VPD",dli:"DLI",brightness:"Helligkeit",remaining:"\xFCbrig",weight:"Topfgewicht",dryback:"Dryback",shots_today:"Shots heute",p_phase:"Tagesphase",water_temp:"Wassertemp.",level:"F\xFCllstand",liters:"Menge",target:"Ziel",chart_climate:"Klima 24 h",chart_dryback:"Topfgewicht 24 h",alerts:"Warnungen",no_alerts:"Keine Warnungen",irrigation_locked:"Bew\xE4sserung gesperrt",irrigation_enabled:"Bew\xE4sserung aktiv",no_data:"Keine Daten",feed:"N\xE4hrl\xF6sung",ec:"EC",ph:"pH",recommendation:"Empfehlung",last_runoff:"Letzter Runoff",target_ec:"Ziel-EC",log_runoff:"Runoff erfassen",runoff_ec:"Runoff-EC (mS/cm)",runoff_ph:"Runoff-pH",volume_ml:"Menge (mL)",ppm:"PPM",note:"Notiz",chart_feed:"EC / pH N\xE4hrl\xF6sung 7 Tage",trend:"Trend",ec_vs_feed:"Runoff vs. N\xE4hrl\xF6sung",recommendations:{increase_ec:"EC erh\xF6hen",keep_ec:"EC beibehalten",reduce_ec:"EC senken",flush:"Sp\xFClen",check_roots:"Wurzeln pr\xFCfen"},trends:{substrate_ec_falling:"Substrat-EC f\xE4llt",balanced:"ausgeglichen",ec_stacking:"EC staut sich",normal:"normal",check_rootzone:"Wurzelzone pr\xFCfen",stable:"stabil"},cost_today:"Pro Tag",cost_total:"Stromkosten",kwh_total:"Energie",cost_per_gram:"Kosten pro Gramm",extras:"Sonstige Kosten",kwh_per_device:"Energie pro Ger\xE4t",chart_cost:"Stromkosten 30 Tage",log_cost:"Kosten erfassen",amount:"Betrag (\u20AC)",recent_costs:"Letzte Kosten",harvest:"Ernte",wet_g:"Nassgewicht (g)",dry_g:"Trockengewicht (g)",extra_cost:"Zusatzkosten (\u20AC)",drying_loss:"Trocknungsverlust",settings_light:"Licht",lights_on:"Licht an",photoperiod:"Photoperiode Wachstum",flower_photoperiod:"Photoperiode Bl\xFCte",ppfd_calibration:"PPFD-Sch\xE4tzung (ohne PAR-Sensor)",ppfd_at_full:"PPFD bei 100 %",ppfd_ref_distance:"Abstand bei dieser Messung",light_distance:"Aktueller Lampenabstand",ppfd_manual:"PPFD manuell",ppfd_hint:"Einmal PPFD bei 100 % Helligkeit messen und den Abstand notieren; daraus sch\xE4tzt die Integration PPFD aus Helligkeit und Abstand.",settings_phase:"Phase",phase:"Phase",apply:"\xDCbernehmen",confirm_phase:"Phase wirklich \xE4ndern?",advance_phase:"N\xE4chste Phase",confirm_advance:"Wirklich n\xE4chste Phase?",flower_switch:"Umstellung 12/12",flower_switch_due:"Umstellung auf 12/12 ist f\xE4llig",confirm_flower:"Auf 12/12 umstellen",confirm_flower_q:"Wirklich auf 12/12?",postpone_flower:"Verschieben",postpone_days:"Verschieben um",settings_calibration:"Kalibrieren",cal_reservoir:"Tank",cal_res_hint:"\u201ELeer\u201C bei leerem Tank dr\xFCcken, \u201EVoll\u201C bei vollem Tank. Gespeichert wird der gerade gemessene Abstand.",res_empty:"Leer",res_full:"Voll",measured_now:"Jetzt gemessen",stored:"Gespeichert",cal_pot:"Topfgewicht",cal_pot_hint:"Feldkapazit\xE4t: direkt nach einer vollen Bew\xE4sserung dr\xFCcken, sobald kein Drain mehr kommt. Trockengewicht: bei trockenem Substrat dr\xFCcken.",cal_fc:"Feldkapazit\xE4t",cal_dry:"Trockengewicht",reset_dryback:"Dryback zur\xFCcksetzen",leaf_offset:"Blatttemperatur-Offset",leaf_hint:"Blatt- minus Lufttemperatur (IR-Thermometer), f\xFCr den Blatt-VPD.",settings_safety:"Bew\xE4sserung \u2013 Sicherheit",max_shot_seconds:"Max. Shot-Dauer",max_shots_per_day:"Max. Shots pro Tag",max_daily_runtime:"Max. Pumpenlaufzeit pro Tag",max_saturation:"Max. S\xE4ttigung",safety_hint:"Harte Grenzen der Integration, unabh\xE4ngig von Automationen. 0 = unbegrenzt, wo erlaubt.",settings_grow:"Grow-Daten",container_size:"Topfgr\xF6\xDFe",tank_volume:"Tankvolumen",power_price:"Strompreis",settings_tools:"Werkzeuge",test_setup:"Setup testen",confirm_test_setup:"Wirklich testen? Ger\xE4te schalten kurz",test_pump:"Pumpe testen",confirm_test_pump:"Pumpe wirklich starten?",no_pump:"Keine Pumpe zugeordnet",test_result:"Letzter Test",export_csv:"CSV exportieren",archive_grow:"Grow archivieren",confirm_archive:"Wirklich archivieren?",mute_alerts:"Warnungen stumm (1 h)",phase_timeline:"Phasenverlauf",next_event:"N\xE4chster Trainingsschritt",flower_day:"Bl\xFCtetag",in_days:"in {n} Tagen",today:"heute",diary:"Tagebuch",diary_today:"Eintrag f\xFCr heute",comment:"Kommentar",image:"Bild (Pfad oder URL)",no_entries:"Noch keine Tagebucheintr\xE4ge",since:"seit",training:{lollipopping:"Lollipopping",defoliation_1:"Entlauben 1",defoliation_2:"Entlauben 2",flush:"Sp\xFClen",harvest_check:"Erntecheck"},phases:{clone:"Steckling",veg:"Wachstum",stretch:"Stretch",bulk:"Bl\xFCte",ripen:"Reife",drying:"Trocknung"},alert_text:{vpd_high:"VPD zu hoch",vpd_low:"VPD zu niedrig",dli_high:"DLI zu hoch",dli_low:"DLI zu niedrig",co2_high:"CO\u2082 zu hoch",co2_low:"CO\u2082 zu niedrig",dryback_high:"Dryback zu hoch",dryback_low:"Dryback zu niedrig",reservoir_low:"Tank fast leer",reservoir_critical:"Tank leer",irrigation_locked:"Bew\xE4sserung gesperrt ({reasons})",flower_switch_due:"Umstellung auf 12/12 f\xE4llig",phase_switch_due:"Phasenwechsel f\xE4llig: {phase} \u2192 {to}"},lock_reasons:{kill_switch:"ausgeschaltet",daily_shot_cap:"Tageslimit Shots",daily_runtime_cap:"Tageslimit Laufzeit",pot_saturated:"Topf ges\xE4ttigt",substrate_saturated:"Substrat ges\xE4ttigt",reservoir_critical:"Tank leer"}};function Bt(e){return(e||"en").split("-")[0]==="de"?ge:me}function _t(e,t){return e.replace(/\{(\w+)\}/g,(s,r)=>String(t[r]??""))}function Wt(e,t){let s=t.key?e.alert_text[t.key]:void 0;if(!s)return t.message;let r=t.params??{};return _t(s,{reasons:(r.reasons??[]).map(i=>e.lock_reasons[i]??i).join(", "),phase:e.phases[r.phase]??r.phase??"",to:r.to?e.phases[r.to]??r.to:"\u2013"})}var $={temp:"var(--pg-temp, #e57373)",rh:"var(--pg-rh, #4fc3f7)",vpd:"var(--pg-vpd, #81c784)",weight:"var(--pg-weight, #ba68c8)",dryback:"var(--pg-dryback, #ffb74d)",ec:"var(--pg-ec, #9575cd)",ph:"var(--pg-ph, #4db6ac)",cost:"var(--pg-cost, #ffb74d)"};function z(e,t){let s=Date.now(),r=s-t*3600*1e3,i=Math.min(...e.map(n=>n.points[0]?.[0]??1/0));return[isFinite(i)?Math.max(r,i):r,s]}function P(e){return async t=>{t.preventDefault();let s=t.target,r=s.querySelector("button[type=submit]");r&&(r.disabled=!0);try{await e(s)&&s.reset()}finally{r&&(r.disabled=!1)}}}var ft={keys:["energy_cost_eur"],hours:720};function _e(e){let t=e.state("energy_total_kwh")?.attributes??{},s=Object.entries(t).filter(([i,n])=>i.includes(".")&&typeof n=="number").map(([i,n])=>({id:i,name:e.hass.states[i]?.attributes.friendly_name??i,kwh:n})).sort((i,n)=>n.kwh-i.kwh);if(!s.length)return l`<p class="muted">${e.t.no_data}</p>`;let r=s[0].kwh||1;return l`<div class="bars">
    ${s.map(i=>l`
      <button class="bar" @click=${()=>e.moreInfo(i.id)}>
        <span class="bname">${i.name}</span>
        <span class="btrack"><span style="width:${i.kwh/r*100}%"></span></span>
        <span class="bval">${e.number(i.kwh,2)} kWh</span>
      </button>`)}
  </div>`}function fe(e){let t=e.state("extra_costs_total")?.attributes.entries??[];return t.length?l`<h3>${e.t.recent_costs}</h3>
    <ul class="list">
      ${[...t].reverse().slice(0,8).map(s=>l`
        <li><span>${e.date(s.date)}</span><span class="grow">${s.note||"\u2013"}</span>
          <span>${e.number(s.amount,2)} €</span></li>`)}
    </ul>`:c}function ve(e){let t=e.state("cost_per_gram")?.attributes??{};return t.dry_g==null?c:l`<div class="tiles">
    <div class="tile static"><span class="tlabel">${e.t.wet_g}</span><span class="tval">${e.number(t.wet_g,0)} g</span></div>
    <div class="tile static"><span class="tlabel">${e.t.dry_g}</span><span class="tval">${e.number(t.dry_g,0)} g</span></div>
    ${t.drying_loss_pct!=null?l`<div class="tile static"><span class="tlabel">${e.t.drying_loss}</span>
      <span class="tval">${e.number(t.drying_loss_pct,1)} %</span></div>`:c}
  </div>`}function Gt(e){let t=e.t,s=[{label:t.cost_total,unit:"\u20AC",color:$.cost,points:e.points("energy_cost_eur"),decimals:2}],[r,i]=z(s,ft.hours),n=P(async d=>{let o=R(d),p=b(o.amount);return p===void 0?!1:e.service("add_extra_cost",{amount:p,note:o.note??""})}),a=P(async d=>{let o=R(d),p=b(o.wet_g),h=b(o.dry_g);return p===void 0||h===void 0?!1:e.service("set_harvest",{wet_g:p,dry_g:h,extra_cost:b(o.extra_cost)??0})});return l`
    <div class="card">
      <h2>${t.tabs.energy}</h2>
      <div class="tiles">
        ${e.tile("daily_cost_eur",t.cost_today,{decimals:2})}
        ${e.tile("energy_cost_eur",t.cost_total,{decimals:2})}
        ${e.tile("energy_total_kwh",t.kwh_total,{decimals:1})}
        ${e.tile("extra_costs_total",t.extras,{decimals:2})}
        ${e.tile("cost_per_gram",t.cost_per_gram,{decimals:2})}
      </div>
      <h3>${t.chart_cost}</h3>
      <pg-chart .series=${s} .start=${r} .end=${i} .lang=${e.lang} no-data=${t.no_data}></pg-chart>
    </div>

    <div class="card">
      <h2>${t.kwh_per_device}</h2>
      ${_e(e)}
    </div>

    <div class="card">
      <h2>${t.log_cost}</h2>
      <form @submit=${n}>
        <label>${t.amount}<input name="amount" inputmode="decimal" required pattern="-?[0-9]+([.,][0-9]+)?"></label>
        <label class="wide">${t.note}<input name="note" maxlength="200"></label>
        <button type="submit">${t.save}</button>
      </form>
      ${fe(e)}
    </div>

    <div class="card">
      <h2>${t.harvest}</h2>
      ${ve(e)}
      <form @submit=${a}>
        <label>${t.wet_g}<input name="wet_g" inputmode="decimal" required pattern="[0-9]+([.,][0-9]+)?"></label>
        <label>${t.dry_g}<input name="dry_g" inputmode="decimal" required pattern="[0-9]+([.,][0-9]+)?"></label>
        <label>${t.extra_cost}<input name="extra_cost" inputmode="decimal" pattern="[0-9]+([.,][0-9]+)?"></label>
        <button type="submit">${t.save}</button>
      </form>
    </div>`}var jt=86400*1e3,Kt={clone:"#90caf9",veg:"#81c784",stretch:"#fff176",bulk:"#ffb74d",ripen:"#e57373",drying:"#a1887f"};function W(e){return new Date(`${e}T00:00:00`).getTime()}function be(e){let t=e.grow.phase_timeline??[];if(!t.length)return c;let s=e.grow.start_date&&e.grow.start_date<t[0].date?e.grow.start_date:t[0].date,r=W(s),i=Math.max(Date.now(),r+jt),n=i-r,a=[];W(t[0].date)>r&&a.push({phase:null,from:r,to:W(t[0].date)}),t.forEach((o,p)=>{let h=p+1<t.length?W(t[p+1].date):i;a.push({phase:o.phase,from:W(o.date),to:h})});let d=o=>Math.max(1,Math.round(o/jt));return l`
    <div class="timeline">
      ${a.map(o=>l`<div class="seg" title=${o.phase?e.t.phases[o.phase]??o.phase:"?"}
        style="flex:${(o.to-o.from)/n};background:${o.phase?Kt[o.phase]??"#bdbdbd":"var(--divider-color)"}"></div>`)}
    </div>
    <ul class="list">
      ${a.filter(o=>o.phase).map(o=>l`<li>
        <span class="swatch" style="background:${Kt[o.phase]??"#bdbdbd"}"></span>
        <span class="grow">${e.t.phases[o.phase]??o.phase}</span>
        <span>${e.t.since} ${e.date(new Date(o.from).toISOString())}</span>
        <span>${d(o.to-o.from)} d</span></li>`)}
    </ul>`}function $e(e){let t=e.state("next_training_event");if(!t||t.state==="unknown"||t.state==="unavailable")return c;let s=t.attributes.in_days,r=s==null?"":s<=0?e.t.today:_t(e.t.in_days,{n:s});return e.tile("next_training_event",e.t.next_event,{value:e.t.training[t.state]??t.state,sub:r})}function ye(e,t){if(!t)return"";let s=[];return t.phase&&s.push(e.t.phases[t.phase]??String(t.phase)),t.day_total!=null&&s.push(`${e.t.day} ${t.day_total}`),typeof t.temp=="number"&&s.push(`${e.number(t.temp,1)} \xB0C`),typeof t.humidity=="number"&&s.push(`${e.number(t.humidity,0)} %`),typeof t.vpd=="number"&&s.push(`VPD ${e.number(t.vpd,2)}`),typeof t.dryback_pct=="number"&&s.push(`${e.t.dryback} ${e.number(t.dryback_pct,1)} %`),s.join(" \xB7 ")}function xe(e){let t=e.state("diary_count")?.attributes.entries??[];return t.length?l`<div class="diary">
    ${t.map(s=>l`<div class="entry">
      ${s.thumb?l`<img src=${s.thumb} alt="" loading="lazy">`:l`<div class="noimg"></div>`}
      <div>
        <div class="edate">${e.date(s.date)}</div>
        ${s.comment?l`<div>${s.comment}</div>`:c}
        <div class="muted small">${ye(e,s.snapshot)}</div>
      </div>
    </div>`)}
  </div>`:l`<p class="muted">${e.t.no_entries}</p>`}function qt(e){let t=e.t,s=P(async r=>{let i=R(r);return!i.comment&&!i.image?!1:e.service("add_diary_entry",{comment:i.comment??"",image:i.image??""})});return l`
    <div class="card">
      <h2>${t.phase_timeline}</h2>
      ${be(e)}
      <div class="tiles" style="margin-top:12px">
        ${$e(e)}
        ${e.tile("flower_day",e.t.flower_day,{decimals:0})}
      </div>
    </div>

    <div class="card">
      <h2>${t.diary_today}</h2>
      <form @submit=${s}>
        <label class="wide">${t.comment}<textarea name="comment" rows="3" maxlength="1000"></textarea></label>
        <label class="wide">${t.image}<input name="image" maxlength="500" placeholder="/media/..."></label>
        <button type="submit">${t.save}</button>
      </form>
    </div>

    <div class="card wide">
      <h2>${t.diary}</h2>
      ${xe(e)}
    </div>`}var vt={keys:["ec","ph"],hours:168},we={keep_ec:"optimal",increase_ec:"warning",reduce_ec:"warning",flush:"critical",check_roots:"critical"};function ke(e){let t=e.t,s=e.state("nutrient_recommendation"),r=s?.attributes??{};if(!s||r.runoff_ec==null)return l`<p class="muted">${t.no_data}</p>`;let i=s.state;return l`
    <div class="tiles">
      ${e.tile("nutrient_recommendation",t.recommendation,{value:t.recommendations[i]??i,status:we[i],sub:e.date(r.ts)})}
      <div class="tile static"><span class="tlabel">${t.runoff_ec}</span>
        <span class="tval">${e.number(r.runoff_ec,2)}</span>
        <span class="tsub">${t.target_ec} ${e.number(r.target_ec,2)}</span></div>
      <div class="tile static"><span class="tlabel">${t.runoff_ph}</span>
        <span class="tval">${e.number(r.runoff_ph,2)}</span>
        <span class="tsub">${t.trend}: ${t.trends[r.ph_trend]??r.ph_trend??"\u2013"}</span></div>
      <div class="tile static"><span class="tlabel">${t.ec_vs_feed}</span>
        <span class="tval small">${t.trends[r.ec_trend]??r.ec_trend??"\u2013"}</span></div>
    </div>
    ${r.note?l`<p class="muted">${t.note}: ${r.note}</p>`:c}`}function Yt(e){let t=e.t,s=[{label:t.ec,unit:"mS/cm",color:$.ec,points:e.points("ec"),decimals:2},{label:t.ph,unit:"",color:$.ph,points:e.points("ph"),decimals:2}],[r,i]=z(s,vt.hours),n=P(async a=>{let d=R(a),o=b(d.runoff_ec),p=b(d.runoff_ph);if(o===void 0||p===void 0)return!1;let h={runoff_ec:o,runoff_ph:p,note:d.note??""},u=b(d.volume_ml),g=b(d.ppm);return u!==void 0&&(h.volume_ml=u),g!==void 0&&(h.ppm=g),e.service("log_runoff",h)});return l`
    <div class="card">
      <h2>${t.feed}</h2>
      <div class="tiles">
        ${e.tile("ec",t.ec,{decimals:2})}
        ${e.tile("ph",t.ph,{decimals:2})}
      </div>
      <h3>${t.chart_feed}</h3>
      <pg-chart .series=${s} .start=${r} .end=${i} .lang=${e.lang} no-data=${t.no_data}></pg-chart>
    </div>

    <div class="card">
      <h2>${t.last_runoff}</h2>
      ${ke(e)}
    </div>

    <div class="card">
      <h2>${t.log_runoff}</h2>
      <form @submit=${n}>
        <label>${t.runoff_ec}<input name="runoff_ec" inputmode="decimal" required pattern="[0-9]+([.,][0-9]+)?"></label>
        <label>${t.runoff_ph}<input name="runoff_ph" inputmode="decimal" required pattern="[0-9]+([.,][0-9]+)?"></label>
        <label>${t.volume_ml}<input name="volume_ml" inputmode="decimal" pattern="[0-9]+([.,][0-9]+)?"></label>
        <label>${t.ppm}<input name="ppm" inputmode="decimal" pattern="[0-9]+([.,][0-9]+)?"></label>
        <label class="wide">${t.note}<input name="note" maxlength="200"></label>
        <button type="submit">${t.save}</button>
      </form>
    </div>`}var bt={keys:["temperature","humidity","vpd","weight","dryback_pct"],hours:24};function Se(e){let t=e.status("reservoir_status");if(t==="critical")return"critical";if(t==="low"||t==="warning")return"warning"}function Ee(e){let t=e.grow.entities.irrigation_enabled,s=t?e.hass.states[t]:void 0;if(!t||!s)return c;let r=e.state("irrigation_locked")?.state==="on";return l`<div class="row">
    <span>${e.t.irrigation_enabled}</span>
    ${r?l`<span class="badge critical">${e.t.irrigation_locked}</span>`:c}
    <ha-switch .checked=${s.state==="on"}
      @change=${()=>e.hass.callService("switch","toggle",{entity_id:t})}></ha-switch>
  </div>`}function Zt(e){let t=e.t,s=e.grow.targets,r=[{label:t.temperature,unit:"\xB0C",color:$.temp,points:e.points("temperature"),band:e.band("temp_day")},{label:t.humidity,unit:"%",color:$.rh,points:e.points("humidity"),band:e.band("rh"),decimals:0},{label:t.vpd,unit:"kPa",color:$.vpd,points:e.points("vpd"),band:e.band("vpd"),decimals:2}],i=[{label:t.weight,unit:"g",color:$.weight,points:e.points("weight"),decimals:0},{label:t.dryback,unit:"%",color:$.dryback,points:e.points("dryback_pct"),band:e.band("dryback_p3")}],[n,a]=z([...r,...i],bt.hours),d=e.num("light_elapsed_pct");return l`
    <div class="card">
      <h2>${t.climate}</h2>
      <div class="tiles">
        ${e.tile("temperature",t.temperature,{sub:e.range(s.temp_day,"\xB0C")})}
        ${e.tile("humidity",t.humidity,{decimals:0,sub:e.range(s.rh,"%")})}
        ${e.tile("vpd",t.vpd,{decimals:2,sub:e.range(s.vpd,"kPa"),status:e.status("vpd_status")})}
        ${e.tile("lvpd",t.lvpd,{decimals:2})}
      </div>
      <h3>${t.chart_climate}</h3>
      <pg-chart .series=${r} .start=${n} .end=${a} .lang=${e.lang} no-data=${t.no_data}></pg-chart>
    </div>

    <div class="card">
      <h2>${t.light}</h2>
      <div class="tiles">
        ${e.tile("brightness_pct",t.brightness,{decimals:0,sub:e.grow.brightness_target!=null?`${t.target} ${e.grow.brightness_target} %`:""})}
        ${e.tile("dli",t.dli,{sub:e.range(e.grow.dli_target,"mol/m\xB2/d"),status:e.status("dli_status")})}
        ${e.tile("light_remaining",t.remaining,{decimals:1})}
      </div>
      ${d!==null?l`<div class="progress"><div style="width:${Math.min(100,d)}%"></div></div>`:c}
    </div>

    <div class="card">
      <h2>${t.irrigation}</h2>
      <div class="tiles">
        ${e.tile("weight",t.weight,{decimals:0})}
        ${e.tile("dryback_pct",t.dryback,{sub:e.range(s.dryback_p3,"%"),status:e.status("dryback_status")})}
        ${e.tile("p_phase",t.p_phase)}
        ${e.tile("irrigation_shots_today",t.shots_today,{decimals:0})}
      </div>
      ${Ee(e)}
      <h3>${t.chart_dryback}</h3>
      <pg-chart .series=${i} .start=${n} .end=${a} .lang=${e.lang} no-data=${t.no_data}></pg-chart>
    </div>

    <div class="card">
      <h2>${t.reservoir}</h2>
      <div class="tiles">
        ${e.tile("reservoir_pct",t.level,{decimals:0,status:Se(e)})}
        ${e.tile("reservoir_liters",t.liters,{decimals:1})}
        ${e.tile("water_temp",t.water_temp)}
      </div>
    </div>`}var Ae=5e3,G=class extends v{constructor(){super(...arguments);this.label="";this.confirmLabel="";this.disabled=!1;this._armed=!1}disconnectedCallback(){super.disconnectedCallback(),this._timer&&window.clearTimeout(this._timer)}_click(){if(!this.disabled){if(!this._armed){this._armed=!0,this._timer=window.setTimeout(()=>this._armed=!1,Ae);return}this._timer&&window.clearTimeout(this._timer),this._armed=!1,this.dispatchEvent(new CustomEvent("confirmed",{bubbles:!0,composed:!0}))}}render(){return l`<button class=${this._armed?"armed":""} ?disabled=${this.disabled}
      @click=${this._click}>${this._armed?this.confirmLabel:this.label}</button>`}};G.properties={label:{type:String},confirmLabel:{type:String,attribute:"confirm-label"},disabled:{type:Boolean},_armed:{state:!0}},G.styles=k`
    button { font: inherit; cursor: pointer; padding: 8px 14px; border-radius: 6px;
      border: 1px solid var(--divider-color); background: var(--secondary-background-color);
      color: var(--primary-text-color); }
    button.armed { background: var(--error-color, #db4437); border-color: var(--error-color, #db4437); color: #fff; }
    button:disabled { opacity: 0.5; cursor: default; }
  `;customElements.get("pg-confirm-button")||customElements.define("pg-confirm-button",G);function H(e,t,s=0){let r=e.grow.sources?.[t],i=r?e.hass.states[r]:void 0;if(!i)return"\u2013";let n=parseFloat(i.state);if(!isFinite(n))return i.state;let a=i.attributes.unit_of_measurement??"";return`${e.number(n,s)} ${a}`.trim()}function st(e,t,s,r=0){let i=e.grow.calibration?.[t];return i==null?"\u2013":`${e.number(i,r)} ${s}`}function Te(e){let t=e.t;return l`<div class="card">
    <h2>${t.settings_light}</h2>
    <div class="fields">
      ${Ut(e,"lights_on",t.lights_on)}
      ${m(e,"photoperiod_hours",t.photoperiod)}
      ${m(e,"flower_photoperiod",t.flower_photoperiod)}
    </div>
    <h3>${t.ppfd_calibration}</h3>
    <p class="muted">${t.ppfd_hint}</p>
    <div class="fields">
      ${m(e,"ppfd_at_full",t.ppfd_at_full)}
      ${m(e,"ppfd_ref_distance",t.ppfd_ref_distance)}
      ${m(e,"light_distance",t.light_distance)}
      ${m(e,"ppfd_manual",t.ppfd_manual)}
    </div>
  </div>`}function Ce(e){let t=e.t,s=e.state("flower_switch_due")?.state==="on";return l`<div class="card">
    <h2>${t.settings_phase}</h2>
    ${Vt(e,"phase_select",t.phase,t.phases,t.confirm_phase)}
    <div class="actions">${_(e,"advance_phase",t.advance_phase,t.confirm_advance)}</div>
    <h3>${t.flower_switch}</h3>
    ${s?l`<div class="alert info">${t.flower_switch_due}</div>`:c}
    <div class="actions">
      ${_(e,"confirm_flower",t.confirm_flower,t.confirm_flower_q)}
      ${_(e,"postpone_flower",t.postpone_flower)}
    </div>
    <div class="fields">${m(e,"flower_postpone_days",t.postpone_days)}</div>
  </div>`}function Re(e){let t=e.t,s=!!e.grow.sources?.sensor_reservoir,r=!!e.grow.sources?.sensor_weight;return l`<div class="card">
    <h2>${t.settings_calibration}</h2>
    ${s?l`
      <h3>${t.cal_reservoir}</h3>
      <p class="muted">${t.cal_res_hint}</p>
      <div class="kv">
        <span>${t.measured_now}</span><b>${H(e,"sensor_reservoir")}</b>
        <span>${t.stored} ${t.res_empty}</span><b>${st(e,"res_dist_empty","mm")}</b>
        <span>${t.stored} ${t.res_full}</span><b>${st(e,"res_dist_full","mm")}</b>
      </div>
      <div class="actions">
        ${_(e,"cal_res_empty",t.res_empty,`${t.res_empty}: ${H(e,"sensor_reservoir")}?`)}
        ${_(e,"cal_res_full",t.res_full,`${t.res_full}: ${H(e,"sensor_reservoir")}?`)}
      </div>`:c}
    ${r?l`
      <h3>${t.cal_pot}</h3>
      <p class="muted">${t.cal_pot_hint}</p>
      <div class="kv">
        <span>${t.measured_now}</span><b>${H(e,"sensor_weight")}</b>
        <span>${t.stored} ${t.cal_fc}</span><b>${st(e,"field_capacity","g")}</b>
        <span>${t.stored} ${t.cal_dry}</span><b>${st(e,"dry_weight","g")}</b>
      </div>
      <div class="actions">
        ${_(e,"cal_fc",t.cal_fc,`${t.cal_fc}: ${H(e,"sensor_weight")}?`)}
        ${_(e,"cal_dry",t.cal_dry,`${t.cal_dry}: ${H(e,"sensor_weight")}?`)}
        ${_(e,"reset_dryback",t.reset_dryback,`${t.reset_dryback}?`)}
      </div>`:c}
    <div class="fields">${m(e,"leaf_offset",t.leaf_offset,{hint:t.leaf_hint})}</div>
  </div>`}function Pe(e){let t=e.t;return l`<div class="card">
    <h2>${t.settings_safety}</h2>
    <p class="muted">${t.safety_hint}</p>
    <div class="fields">
      ${m(e,"max_shot_seconds",t.max_shot_seconds)}
      ${m(e,"max_shots_per_day",t.max_shots_per_day)}
      ${m(e,"max_daily_runtime_min",t.max_daily_runtime)}
      ${m(e,"max_saturation_pct",t.max_saturation)}
    </div>
  </div>`}function De(e){let t=e.t;return l`<div class="card">
    <h2>${t.settings_grow}</h2>
    <div class="fields">
      ${m(e,"container_size_ml",t.container_size)}
      ${m(e,"tank_volume_l",t.tank_volume)}
      ${m(e,"power_price",t.power_price)}
    </div>
  </div>`}function Le(e){let t=e.t,s=!!e.grow.sources?.device_pump,r=e.state("test_status");return l`<div class="card">
    <h2>${t.settings_tools}</h2>
    ${r&&r.state!=="unknown"?l`<div class="kv">
      <span>${t.test_result}</span><b>${r.state}</b></div>`:c}
    <div class="actions">
      ${_(e,"test_setup",t.test_setup,t.confirm_test_setup)}
      ${_(e,"test_pump",t.test_pump,t.confirm_test_pump,!s)}
      ${s?c:l`<span class="muted">${t.no_pump}</span>`}
    </div>
    <div class="actions">
      ${_(e,"export_csv",t.export_csv)}
      ${_(e,"mute_alerts",t.mute_alerts)}
      ${_(e,"archive_grow",t.archive_grow,t.confirm_archive)}
    </div>
  </div>`}function Jt(e){return l`${Te(e)}${Ce(e)}${Re(e)}${Pe(e)}${De(e)}${Le(e)}`}var ze=300*1e3,Xt="precision_grow_panel_grow",$t="precision_grow_panel_tab",Qt=["overview","nutrients","energy","log","settings"],He={overview:bt,nutrients:vt,energy:ft,log:null,settings:null},j=class extends v{constructor(){super(...arguments);this.narrow=!1;this._grows=null;this._selected=localStorage.getItem(Xt);this._tab=Qt.includes(localStorage.getItem($t)??"")?localStorage.getItem($t):"overview";this._error=null;this._history={}}connectedCallback(){super.connectedCallback(),this._timer=window.setInterval(()=>this._refresh(),ze)}disconnectedCallback(){super.disconnectedCallback(),this._timer&&window.clearInterval(this._timer)}firstUpdated(){this._refresh()}get _t(){return Bt(this.hass?.locale?.language??this.hass?.language)}get _grow(){if(this._grows?.length)return this._grows.find(s=>s.entry_id===this._selected)??this._grows[0]}async _refresh(){if(this.hass){try{let s=await this.hass.callWS({type:"precision_grow/grows"});this._grows=s.grows,this._error=null}catch(s){this._error=`${this._t.error}: ${s?.message??s}`;return}await this._loadHistory()}}async _loadHistory(){let s=this._grow,r=He[this._tab];if(!s||!r)return;let i=r.keys.map(d=>s.entities[d]).filter(Boolean);if(!i.length){this._history={};return}let n=Date.now(),a=n-r.hours*3600*1e3;try{this._history=await this.hass.callWS({type:"history/history_during_period",start_time:new Date(a).toISOString(),end_time:new Date(n).toISOString(),entity_ids:i,minimal_response:!0,no_attributes:!0,significant_changes_only:!1})}catch{this._history={}}}_select(s){this._selected=s.target.value,localStorage.setItem(Xt,this._selected),this._refresh()}_setTab(s){s!==this._tab&&(this._tab=s,localStorage.setItem($t,s),this._history={},this._refresh())}_header(s,r){let i=this._t;return l`
      <div class="toolbar">
        <ha-menu-button .hass=${this.hass} .narrow=${this.narrow}></ha-menu-button>
        <div class="title">Precision Grow</div>
        ${this._grows&&this._grows.length>1?l`<select @change=${this._select} aria-label="Grow">
              ${this._grows.map(n=>l`<option value=${n.entry_id}
                ?selected=${n.entry_id===s?.entry_id}>${n.title}</option>`)}
            </select>`:s?l`<div class="growname">${s.title}</div>`:c}
      </div>
      ${s&&r?l`
        <div class="tabs" role="tablist">
          ${Qt.map(n=>l`<button role="tab" aria-selected=${n===this._tab}
            class=${n===this._tab?"active":""} @click=${()=>this._setTab(n)}>${i.tabs[n]}</button>`)}
        </div>
        <div class="summary">
          <span class="phase">${i.phases[s.phase]??s.phase}</span>
          ${r.num("day_total")!==null?l`<span>${i.day} ${r.num("day_total")}</span>`:c}
          ${r.num("day_in_phase")!==null?l`<span>${r.num("day_in_phase")}. ${i.day_in_phase}</span>`:c}
          ${this._alertChip(r)}
        </div>`:c}`}_alertChip(s){let r=s.state("alert_level");if(!r)return c;let i=r.attributes.count??0;return l`<button class="chip ${r.state}" @click=${()=>s.moreInfo("alert_level")}>
      ${i?`${this._t.alerts}: ${i}`:this._t.no_alerts}</button>`}_alerts(s){let r=s.state("alert_level")?.attributes.items;return r?.length?l`<div class="card wide">
      <h2>${this._t.alerts}</h2>
      ${r.map(i=>l`<div class="alert ${i.severity}">${Wt(this._t,i)}</div>`)}
    </div>`:c}_body(s){switch(this._tab){case"nutrients":return Yt(s);case"energy":return Gt(s);case"log":return qt(s);case"settings":return Jt(s);default:return l`${this._alerts(s)}${Zt(s)}`}}render(){let s=this._t;if(this._error)return l`${this._header(void 0)}<div class="msg">${this._error}</div>`;if(this._grows===null)return l`${this._header(void 0)}<div class="msg">${s.loading}</div>`;let r=this._grow;if(!r)return l`${this._header(void 0)}<div class="msg">${s.no_grow}</div>`;let i=new tt(this.hass,r,s,this._history,this);return l`${this._header(r,i)}<div class="content">${this._body(i)}</div>`}};j.properties={hass:{attribute:!1},narrow:{type:Boolean},_grows:{state:!0},_selected:{state:!0},_tab:{state:!0},_error:{state:!0},_history:{state:!0}},j.styles=k`
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
    .tabs { display: flex; gap: 4px; padding: 0 12px; overflow-x: auto;
      background: var(--app-header-background-color, var(--primary-color));
      border-bottom: 1px solid var(--divider-color); }
    .tabs button { all: unset; cursor: pointer; padding: 10px 14px; font-size: 14px; white-space: nowrap;
      color: var(--app-header-text-color, var(--text-primary-color)); opacity: 0.7;
      border-bottom: 2px solid transparent; }
    .tabs button.active { opacity: 1; border-bottom-color: var(--primary-color); font-weight: 500; }
    .tabs button:focus-visible { outline: 2px solid var(--primary-color); }
    .summary { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; padding: 12px 16px 0;
      color: var(--secondary-text-color); font-size: 14px; }
    .phase { color: var(--primary-text-color); font-weight: 500; font-size: 16px; }
    .content { display: grid; gap: 16px; padding: 16px;
      grid-template-columns: repeat(auto-fill, minmax(min(100%, 420px), 1fr)); align-items: start; }
    .card { background: var(--card-background-color); border-radius: var(--ha-card-border-radius, 12px);
      box-shadow: var(--ha-card-box-shadow, none); border: 1px solid var(--divider-color); padding: 16px; }
    .card.wide { grid-column: 1 / -1; }
    h2 { margin: 0 0 12px; font-size: 16px; font-weight: 500; }
    h3 { margin: 16px 0 6px; font-size: 13px; font-weight: 500; color: var(--secondary-text-color); }
    .tiles { display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 8px; }
    .tile { all: unset; cursor: pointer; display: flex; flex-direction: column; gap: 2px; padding: 10px 12px;
      border-radius: 8px; background: var(--secondary-background-color); border-left: 3px solid transparent; }
    .tile.static { cursor: default; }
    .tile:focus-visible { outline: 2px solid var(--primary-color); }
    .tile.optimal { border-left-color: var(--success-color, #43a047); }
    .tile.high, .tile.low, .tile.warning { border-left-color: var(--warning-color, #ffa000); }
    .tile.critical { border-left-color: var(--error-color, #db4437); }
    .tlabel { font-size: 12px; color: var(--secondary-text-color); }
    .tval { font-size: 20px; font-variant-numeric: tabular-nums; }
    .tval.small { font-size: 15px; }
    .tsub { font-size: 11px; color: var(--secondary-text-color); }
    .muted { color: var(--secondary-text-color); font-size: 13px; }
    .small { font-size: 12px; }
    .progress { height: 6px; border-radius: 3px; background: var(--secondary-background-color);
      margin-top: 12px; overflow: hidden; }
    .progress div { height: 100%; background: var(--warning-color, #ffa000); }
    .row { display: flex; align-items: center; gap: 8px; margin-top: 12px; }
    .row span:first-child { flex: 1; }
    .badge { font-size: 12px; padding: 2px 8px; border-radius: 10px; background: var(--secondary-background-color); }
    .chip { all: unset; cursor: pointer; font-size: 12px; padding: 2px 10px; border-radius: 10px;
      background: var(--secondary-background-color); color: var(--primary-text-color); }
    .chip.warning, .badge.warning { background: var(--warning-color, #ffa000); color: #000; }
    .chip.critical, .badge.critical { background: var(--error-color, #db4437); color: #fff; }
    .alert { padding: 6px 10px; border-radius: 6px; margin-top: 6px; font-size: 14px;
      border-left: 3px solid var(--info-color, #039be5); background: var(--secondary-background-color); }
    .alert.warning { border-left-color: var(--warning-color, #ffa000); }
    .alert.critical { border-left-color: var(--error-color, #db4437); }
    form { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 10px; align-items: end; }
    label { display: flex; flex-direction: column; gap: 4px; font-size: 12px; color: var(--secondary-text-color); }
    label.wide { grid-column: 1 / -1; }
    input, textarea { font: inherit; font-size: 15px; color: var(--primary-text-color);
      background: var(--secondary-background-color); border: 1px solid var(--divider-color);
      border-radius: 6px; padding: 8px; box-sizing: border-box; width: 100%; }
    input:user-invalid { border-color: var(--error-color, #db4437); }
    form button { font: inherit; cursor: pointer; padding: 9px 16px; border: none; border-radius: 6px;
      background: var(--primary-color); color: var(--text-primary-color, #fff); justify-self: start; }
    form button:disabled { opacity: 0.5; cursor: default; }
    .bars { display: flex; flex-direction: column; gap: 6px; }
    .bar { all: unset; cursor: pointer; display: grid; grid-template-columns: minmax(80px, 30%) 1fr auto;
      gap: 8px; align-items: center; font-size: 13px; }
    .bname { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .btrack { height: 8px; border-radius: 4px; background: var(--secondary-background-color); overflow: hidden; }
    .btrack span { display: block; height: 100%; background: var(--pg-cost, #ffb74d); }
    .bval { font-variant-numeric: tabular-nums; }
    .list { list-style: none; margin: 0; padding: 0; font-size: 13px; }
    .list li { display: flex; gap: 10px; align-items: center; padding: 5px 0;
      border-bottom: 1px solid var(--divider-color); }
    .list li:last-child { border-bottom: none; }
    .list .grow { flex: 1; }
    .swatch { width: 10px; height: 10px; border-radius: 2px; }
    .timeline { display: flex; height: 14px; border-radius: 7px; overflow: hidden; margin-bottom: 8px; }
    .seg { min-width: 2px; }
    .diary { display: grid; gap: 12px; grid-template-columns: repeat(auto-fill, minmax(min(100%, 300px), 1fr)); }
    .entry { display: flex; gap: 10px; font-size: 14px; }
    .entry img, .noimg { width: 72px; height: 72px; object-fit: cover; border-radius: 6px; flex: none;
      background: var(--secondary-background-color); }
    .edate { font-weight: 500; }
    .msg { padding: 24px 16px; color: var(--secondary-text-color); }
    .fields { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 10px; }
    .field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 8px; }
    .hint { font-size: 11px; color: var(--secondary-text-color); }
    .actions { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; margin: 8px 0; }
    button.action { font: inherit; cursor: pointer; padding: 8px 14px; border-radius: 6px;
      border: 1px solid var(--divider-color); background: var(--secondary-background-color);
      color: var(--primary-text-color); }
    button.action:disabled { opacity: 0.5; cursor: default; }
    select.input { font: inherit; font-size: 15px; color: var(--primary-text-color);
      background: var(--secondary-background-color); border: 1px solid var(--divider-color);
      border-radius: 6px; padding: 8px; }
    .kv { display: grid; grid-template-columns: auto 1fr; gap: 4px 12px; font-size: 13px; margin: 6px 0; }
    .kv span { color: var(--secondary-text-color); }
    .kv b { font-weight: 500; font-variant-numeric: tabular-nums; }
  `;customElements.get("precision-grow-panel")||customElements.define("precision-grow-panel",j);
