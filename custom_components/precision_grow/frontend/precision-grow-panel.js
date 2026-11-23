var V=globalThis,W=V.ShadowRoot&&(V.ShadyCSS===void 0||V.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,J=Symbol(),mt=new WeakMap,P=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==J)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(W&&t===void 0){let s=e!==void 0&&e.length===1;s&&(t=mt.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&mt.set(e,t))}return t}toString(){return this.cssText}},ft=r=>new P(typeof r=="string"?r:r+"",void 0,J),H=(r,...t)=>{let e=r.length===1?r[0]:t.reduce((s,i,n)=>s+(a=>{if(a._$cssResult$===!0)return a.cssText;if(typeof a=="number")return a;throw Error("Value passed to 'css' function must be a 'css' function result: "+a+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+r[n+1],r[0]);return new P(e,r,J)},_t=(r,t)=>{if(W)r.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let s=document.createElement("style"),i=V.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=e.cssText,r.appendChild(s)}},X=W?r=>r:r=>r instanceof CSSStyleSheet?(t=>{let e="";for(let s of t.cssRules)e+=s.cssText;return ft(e)})(r):r;var{is:jt,defineProperty:Gt,getOwnPropertyDescriptor:Kt,getOwnPropertyNames:qt,getOwnPropertySymbols:Yt,getPrototypeOf:Zt}=Object,j=globalThis,vt=j.trustedTypes,Jt=vt?vt.emptyScript:"",Xt=j.reactiveElementPolyfillSupport,L=(r,t)=>r,Q={toAttribute(r,t){switch(t){case Boolean:r=r?Jt:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,t){let e=r;switch(t){case Boolean:e=r!==null;break;case Number:e=r===null?null:Number(r);break;case Object:case Array:try{e=JSON.parse(r)}catch{e=null}}return e}},yt=(r,t)=>!jt(r,t),bt={attribute:!0,type:String,converter:Q,reflect:!1,useDefault:!1,hasChanged:yt};Symbol.metadata??=Symbol("metadata"),j.litPropertyMetadata??=new WeakMap;var b=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=bt){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let s=Symbol(),i=this.getPropertyDescriptor(t,s,e);i!==void 0&&Gt(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){let{get:i,set:n}=Kt(this.prototype,t)??{get(){return this[e]},set(a){this[e]=a}};return{get:i,set(a){let c=i?.call(this);n?.call(this,a),this.requestUpdate(t,c,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??bt}static _$Ei(){if(this.hasOwnProperty(L("elementProperties")))return;let t=Zt(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(L("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(L("properties"))){let e=this.properties,s=[...qt(e),...Yt(e)];for(let i of s)this.createProperty(i,e[i])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[s,i]of e)this.elementProperties.set(s,i)}this._$Eh=new Map;for(let[e,s]of this.elementProperties){let i=this._$Eu(e,s);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let s=new Set(t.flat(1/0).reverse());for(let i of s)e.unshift(X(i))}else t!==void 0&&e.push(X(t));return e}static _$Eu(t,e){let s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return _t(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){let s=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,s);if(i!==void 0&&s.reflect===!0){let n=(s.converter?.toAttribute!==void 0?s.converter:Q).toAttribute(e,s.type);this._$Em=t,n==null?this.removeAttribute(i):this.setAttribute(i,n),this._$Em=null}}_$AK(t,e){let s=this.constructor,i=s._$Eh.get(t);if(i!==void 0&&this._$Em!==i){let n=s.getPropertyOptions(i),a=typeof n.converter=="function"?{fromAttribute:n.converter}:n.converter?.fromAttribute!==void 0?n.converter:Q;this._$Em=i;let c=a.fromAttribute(e,n.type);this[i]=c??this._$Ej?.get(i)??c,this._$Em=null}}requestUpdate(t,e,s,i=!1,n){if(t!==void 0){let a=this.constructor;if(i===!1&&(n=this[t]),s??=a.getPropertyOptions(t),!((s.hasChanged??yt)(n,e)||s.useDefault&&s.reflect&&n===this._$Ej?.get(t)&&!this.hasAttribute(a._$Eu(t,s))))return;this.C(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:i,wrapped:n},a){s&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,a??e??this[t]),n!==!0||a!==void 0)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),i===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[i,n]of this._$Ep)this[i]=n;this._$Ep=void 0}let s=this.constructor.elementProperties;if(s.size>0)for(let[i,n]of s){let{wrapped:a}=n,c=this[i];a!==!0||this._$AL.has(i)||c===void 0||this.C(i,void 0,n,c)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(s=>s.hostUpdate?.()),this.update(e)):this._$EM()}catch(s){throw t=!1,this._$EM(),s}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(t){}firstUpdated(t){}};b.elementStyles=[],b.shadowRootOptions={mode:"open"},b[L("elementProperties")]=new Map,b[L("finalized")]=new Map,Xt?.({ReactiveElement:b}),(j.reactiveElementVersions??=[]).push("2.1.2");var at=globalThis,$t=r=>r,G=at.trustedTypes,xt=G?G.createPolicy("lit-html",{createHTML:r=>r}):void 0,Tt="$lit$",y=`lit$${Math.random().toFixed(9).slice(2)}$`,Ct="?"+y,Qt=`<${Ct}>`,S=document,N=()=>S.createComment(""),M=r=>r===null||typeof r!="object"&&typeof r!="function",ot=Array.isArray,te=r=>ot(r)||typeof r?.[Symbol.iterator]=="function",tt=`[ 	
\f\r]`,O=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,wt=/-->/g,St=/>/g,x=RegExp(`>|${tt}(?:([^\\s"'>=/]+)(${tt}*=${tt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),kt=/'/g,Et=/"/g,Rt=/^(?:script|style|textarea|title)$/i,lt=r=>(t,...e)=>({_$litType$:r,strings:t,values:e}),l=lt(1),K=lt(2),we=lt(3),k=Symbol.for("lit-noChange"),d=Symbol.for("lit-nothing"),At=new WeakMap,w=S.createTreeWalker(S,129);function Dt(r,t){if(!ot(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return xt!==void 0?xt.createHTML(t):t}var ee=(r,t)=>{let e=r.length-1,s=[],i,n=t===2?"<svg>":t===3?"<math>":"",a=O;for(let c=0;c<e;c++){let o=r[c],p,h,u=-1,g=0;for(;g<o.length&&(a.lastIndex=g,h=a.exec(o),h!==null);)g=a.lastIndex,a===O?h[1]==="!--"?a=wt:h[1]!==void 0?a=St:h[2]!==void 0?(Rt.test(h[2])&&(i=RegExp("</"+h[2],"g")),a=x):h[3]!==void 0&&(a=x):a===x?h[0]===">"?(a=i??O,u=-1):h[1]===void 0?u=-2:(u=a.lastIndex-h[2].length,p=h[1],a=h[3]===void 0?x:h[3]==='"'?Et:kt):a===Et||a===kt?a=x:a===wt||a===St?a=O:(a=x,i=void 0);let m=a===x&&r[c+1].startsWith("/>")?" ":"";n+=a===O?o+Qt:u>=0?(s.push(p),o.slice(0,u)+Tt+o.slice(u)+y+m):o+y+(u===-2?c:m)}return[Dt(r,n+(r[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]},I=class r{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let n=0,a=0,c=t.length-1,o=this.parts,[p,h]=ee(t,e);if(this.el=r.createElement(p,s),w.currentNode=this.el.content,e===2||e===3){let u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(i=w.nextNode())!==null&&o.length<c;){if(i.nodeType===1){if(i.hasAttributes())for(let u of i.getAttributeNames())if(u.endsWith(Tt)){let g=h[a++],m=i.getAttribute(u).split(y),$=/([.?@])?(.*)/.exec(g);o.push({type:1,index:n,name:$[2],strings:m,ctor:$[1]==="."?st:$[1]==="?"?rt:$[1]==="@"?it:R}),i.removeAttribute(u)}else u.startsWith(y)&&(o.push({type:6,index:n}),i.removeAttribute(u));if(Rt.test(i.tagName)){let u=i.textContent.split(y),g=u.length-1;if(g>0){i.textContent=G?G.emptyScript:"";for(let m=0;m<g;m++)i.append(u[m],N()),w.nextNode(),o.push({type:2,index:++n});i.append(u[g],N())}}}else if(i.nodeType===8)if(i.data===Ct)o.push({type:2,index:n});else{let u=-1;for(;(u=i.data.indexOf(y,u+1))!==-1;)o.push({type:7,index:n}),u+=y.length-1}n++}}static createElement(t,e){let s=S.createElement("template");return s.innerHTML=t,s}};function C(r,t,e=r,s){if(t===k)return t;let i=s!==void 0?e._$Co?.[s]:e._$Cl,n=M(t)?void 0:t._$litDirective$;return i?.constructor!==n&&(i?._$AO?.(!1),n===void 0?i=void 0:(i=new n(r),i._$AT(r,e,s)),s!==void 0?(e._$Co??=[])[s]=i:e._$Cl=i),i!==void 0&&(t=C(r,i._$AS(r,t.values),i,s)),t}var et=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:e},parts:s}=this._$AD,i=(t?.creationScope??S).importNode(e,!0);w.currentNode=i;let n=w.nextNode(),a=0,c=0,o=s[0];for(;o!==void 0;){if(a===o.index){let p;o.type===2?p=new z(n,n.nextSibling,this,t):o.type===1?p=new o.ctor(n,o.name,o.strings,this,t):o.type===6&&(p=new nt(n,this,t)),this._$AV.push(p),o=s[++c]}a!==o?.index&&(n=w.nextNode(),a++)}return w.currentNode=S,i}p(t){let e=0;for(let s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}},z=class r{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,s,i){this.type=2,this._$AH=d,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=C(this,t,e),M(t)?t===d||t==null||t===""?(this._$AH!==d&&this._$AR(),this._$AH=d):t!==this._$AH&&t!==k&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):te(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==d&&M(this._$AH)?this._$AA.nextSibling.data=t:this.T(S.createTextNode(t)),this._$AH=t}$(t){let{values:e,_$litType$:s}=t,i=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=I.createElement(Dt(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(e);else{let n=new et(i,this),a=n.u(this.options);n.p(e),this.T(a),this._$AH=n}}_$AC(t){let e=At.get(t.strings);return e===void 0&&At.set(t.strings,e=new I(t)),e}k(t){ot(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,s,i=0;for(let n of t)i===e.length?e.push(s=new r(this.O(N()),this.O(N()),this,this.options)):s=e[i],s._$AI(n),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){let s=$t(t).nextSibling;$t(t).remove(),t=s}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},R=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,n){this.type=1,this._$AH=d,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=n,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=d}_$AI(t,e=this,s,i){let n=this.strings,a=!1;if(n===void 0)t=C(this,t,e,0),a=!M(t)||t!==this._$AH&&t!==k,a&&(this._$AH=t);else{let c=t,o,p;for(t=n[0],o=0;o<n.length-1;o++)p=C(this,c[s+o],e,o),p===k&&(p=this._$AH[o]),a||=!M(p)||p!==this._$AH[o],p===d?t=d:t!==d&&(t+=(p??"")+n[o+1]),this._$AH[o]=p}a&&!i&&this.j(t)}j(t){t===d?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},st=class extends R{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===d?void 0:t}},rt=class extends R{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==d)}},it=class extends R{constructor(t,e,s,i,n){super(t,e,s,i,n),this.type=5}_$AI(t,e=this){if((t=C(this,t,e,0)??d)===k)return;let s=this._$AH,i=t===d&&s!==d||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,n=t!==d&&(s===d||i);i&&this.element.removeEventListener(this.name,this,s),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},nt=class{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){C(this,t)}};var se=at.litHtmlPolyfillSupport;se?.(I,z),(at.litHtmlVersions??=[]).push("3.3.3");var Pt=(r,t,e)=>{let s=e?.renderBefore??t,i=s._$litPart$;if(i===void 0){let n=e?.renderBefore??null;s._$litPart$=i=new z(t.insertBefore(N(),n),n,void 0,e??{})}return i._$AI(r),i};var ct=globalThis,_=class extends b{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Pt(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return k}};_._$litElement$=!0,_.finalized=!0,ct.litElementHydrateSupport?.({LitElement:_});var re=ct.litElementPolyfillSupport;re?.({LitElement:_});(ct.litElementVersions??=[]).push("4.2.2");var q=600,E=56,Y=4,Ht=4,U=class extends _{constructor(){super(...arguments);this.series=[];this.start=0;this.end=0;this.noData="No data";this.lang="en";this._hover=null}_x(e){let s=Math.max(1,this.end-this.start);return Y+(e-this.start)/s*(q-Y-Ht)}_range(e){let s=1/0,i=-1/0;for(let[,a]of e.points)a<s&&(s=a),a>i&&(i=a);if(e.band&&(s=Math.min(s,e.band[0]),i=Math.max(i,e.band[1])),!isFinite(s))return[0,1];if(i-s<1e-6)return[s-1,i+1];let n=(i-s)*.08;return[s-n,i+n]}_valueAt(e,s){let i=null;for(let[n,a]of e.points){if(n>s)break;i=a}return i}_onMove(e){let s=e.currentTarget.getBoundingClientRect(),i=(e.clientX-s.left)/s.width;this._hover=this.start+Math.min(1,Math.max(0,i))*(this.end-this.start)}_lane(e,s){let[i,n]=this._range(e),a=h=>E-4-(h-i)/(n-i)*(E-8),c=s*E,o="";e.points.forEach(([h,u],g)=>{let m=this._x(h).toFixed(1),$=(c+a(u)).toFixed(1);if(g===0)o+=`M${m},${$}`;else{let Wt=(c+a(e.points[g-1][1])).toFixed(1);o+=`L${m},${Wt}L${m},${$}`}}),e.points.length&&(o+=`L${this._x(this.end).toFixed(1)},${(c+a(e.points[e.points.length-1][1])).toFixed(1)}`);let p=e.band?K`<rect class="band" x=${Y} width=${q-Y-Ht}
          y=${c+a(e.band[1])} height=${Math.max(0,a(e.band[0])-a(e.band[1]))}></rect>`:d;return K`
      <line class="sep" x1="0" x2=${q} y1=${c+E} y2=${c+E}></line>
      ${p}
      <path d=${o} stroke=${e.color} class="line"></path>`}render(){let e=this.series.filter(a=>a.points.length);if(!e.length)return l`<div class="empty">${this.noData}</div>`;let s=e.length*E,i=this._hover!==null?this._x(this._hover):null,n=a=>a.decimals??1;return l`
      <div class="wrap">
        <div class="labels">
          ${e.map(a=>{let c=this._hover!==null?this._valueAt(a,this._hover):a.points[a.points.length-1][1];return l`<div class="label" style="height:${E}px">
              <span class="dot" style="background:${a.color}"></span>
              <span class="name">${a.label}</span>
              <span class="val">${c===null?"\u2013":c.toLocaleString(this.lang,{minimumFractionDigits:n(a),maximumFractionDigits:n(a)})} ${a.unit}</span>
            </div>`})}
        </div>
        <svg viewBox="0 0 ${q} ${s}" preserveAspectRatio="none" style="height:${s}px"
          @pointermove=${this._onMove} @pointerleave=${()=>this._hover=null}>
          ${e.map((a,c)=>this._lane(a,c))}
          ${i!==null?K`<line class="hover" x1=${i} x2=${i} y1="0" y2=${s}></line>`:d}
        </svg>
      </div>
      <div class="axis">
        <span>${this._time(this.start)}</span>
        <span>${this._hover!==null?this._time(this._hover):""}</span>
        <span>${this._time(this.end)}</span>
      </div>`}_time(e){let s=new Date(e);return this.end-this.start>36*3600*1e3?s.toLocaleDateString(this.lang,{day:"2-digit",month:"2-digit"}):s.toLocaleTimeString(this.lang,{hour:"2-digit",minute:"2-digit"})}};U.properties={series:{attribute:!1},start:{type:Number},end:{type:Number},noData:{type:String,attribute:"no-data"},lang:{type:String},_hover:{state:!0}},U.styles=H`
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
  `;customElements.get("pg-chart")||customElements.define("pg-chart",U);var Z=class{constructor(t,e,s,i,n){this.hass=t;this.grow=e;this.t=s;this.history=i;this.host=n}get lang(){return this.hass.locale?.language??this.hass.language}state(t){let e=this.grow.entities[t];return e?this.hass.states[e]:void 0}has(t){return!!this.state(t)}num(t){let e=this.state(t);if(!e)return null;let s=parseFloat(e.state);return isFinite(s)?s:null}number(t,e=1){return t.toLocaleString(this.lang,{maximumFractionDigits:e})}fmt(t,e=1){let s=this.state(t);if(!s||s.state==="unknown"||s.state==="unavailable")return"\u2013";let i=parseFloat(s.state),n=s.attributes.unit_of_measurement??"";if(!isFinite(i))return s.state;let a=this.number(i,e);return n?`${a} ${n}`:a}status(t){return this.state(t)?.state}range(t,e){return!Array.isArray(t)||t[0]==null||t[1]==null?"":`${this.t.target} ${t[0]}\u2013${t[1]} ${e}`}band(t){let e=this.grow.targets[t];return Array.isArray(e)?[e[0],e[1]]:null}date(t){if(!t)return"\u2013";let e=new Date(t.length===10?`${t}T00:00:00`:t);return isNaN(e.getTime())?t:e.toLocaleDateString(this.lang,{day:"2-digit",month:"2-digit",year:"numeric"})}moreInfo(t){let e=this.grow.entities[t]??t;this.host.dispatchEvent(new CustomEvent("hass-more-info",{detail:{entityId:e},bubbles:!0,composed:!0}))}toast(t){this.host.dispatchEvent(new CustomEvent("hass-notification",{detail:{message:t},bubbles:!0,composed:!0}))}async service(t,e){try{return await this.hass.callService("precision_grow",t,{entry_id:this.grow.entry_id,...e}),this.toast(this.t.saved),!0}catch(s){return this.toast(`${this.t.save_failed}: ${s?.message??s}`),!1}}points(t,e=!0){let s=this.grow.entities[t],i=s?this.history[s]:void 0;if(!i)return[];let n=[];for(let c of i){let o=parseFloat(c.s);isFinite(o)&&n.push([c.lu*1e3,o])}let a=this.num(t);return e&&n.length&&a!==null&&n.push([Date.now(),a]),n}tile(t,e,s={}){return this.grow.entities[t]?l`
      <button class="tile ${s.status??""}" @click=${()=>this.moreInfo(t)}>
        <span class="tlabel">${e}</span>
        <span class="tval">${s.value??this.fmt(t,s.decimals)}</span>
        ${s.sub?l`<span class="tsub">${s.sub}</span>`:d}
      </button>`:d}};function A(r){let t={};return new FormData(r).forEach((e,s)=>{let i=String(e).trim();i!==""&&(t[s]=i)}),t}function v(r){if(r===void 0)return;let t=parseFloat(r.replace(",","."));return isFinite(t)?t:void 0}var ie={loading:"Loading\u2026",no_grow:"No grow configured. Add one under Settings \u2192 Devices & services \u2192 Precision Grow.",error:"Could not load grows",saved:"Saved",save_failed:"Saving failed",save:"Save",day:"Day",day_in_phase:"day in phase",tabs:{overview:"Overview",nutrients:"Nutrients",energy:"Energy & cost",log:"Grow log"},climate:"Climate",light:"Light",irrigation:"Irrigation",reservoir:"Reservoir",temperature:"Temperature",humidity:"Humidity",vpd:"VPD",lvpd:"Leaf VPD",dli:"DLI",brightness:"Brightness",remaining:"remaining",weight:"Pot weight",dryback:"Dryback",shots_today:"Shots today",p_phase:"Day phase",water_temp:"Water temp",level:"Level",liters:"Volume",target:"target",chart_climate:"Climate 24 h",chart_dryback:"Pot weight 24 h",alerts:"Alerts",no_alerts:"No alerts",irrigation_locked:"Irrigation locked",irrigation_enabled:"Irrigation enabled",no_data:"No data",feed:"Feed",ec:"EC",ph:"pH",recommendation:"Recommendation",last_runoff:"Last runoff",target_ec:"Target EC",log_runoff:"Log runoff",runoff_ec:"Runoff EC (mS/cm)",runoff_ph:"Runoff pH",volume_ml:"Volume (mL)",ppm:"PPM",note:"Note",chart_feed:"Feed EC / pH 7 days",trend:"Trend",ec_vs_feed:"Runoff vs. feed",recommendations:{increase_ec:"Increase EC",keep_ec:"Keep EC",reduce_ec:"Reduce EC",flush:"Flush",check_roots:"Check roots"},trends:{substrate_ec_falling:"substrate EC falling",balanced:"balanced",ec_stacking:"EC stacking",normal:"normal",check_rootzone:"check root zone",stable:"stable"},cost_today:"Per day",cost_total:"Energy cost",kwh_total:"Energy",cost_per_gram:"Cost per gram",extras:"Extra costs",kwh_per_device:"Energy per device",chart_cost:"Energy cost 30 days",log_cost:"Log extra cost",amount:"Amount (\u20AC)",recent_costs:"Recent extra costs",harvest:"Harvest",wet_g:"Wet weight (g)",dry_g:"Dry weight (g)",extra_cost:"Extra cost (\u20AC)",drying_loss:"Drying loss",phase_timeline:"Phase timeline",next_event:"Next training step",flower_day:"Flower day",in_days:"in {n} days",today:"today",diary:"Diary",diary_today:"Today's entry",comment:"Comment",image:"Image (path or URL)",no_entries:"No diary entries yet",since:"since",training:{lollipopping:"Lollipopping",defoliation_1:"Defoliation 1",defoliation_2:"Defoliation 2",flush:"Flush",harvest_check:"Harvest check"},phases:{clone:"Clone",veg:"Veg",stretch:"Stretch",bulk:"Bulk",ripen:"Ripen",drying:"Drying"},alert_text:{vpd_high:"VPD too high",vpd_low:"VPD too low",dli_high:"DLI too high",dli_low:"DLI too low",co2_high:"CO\u2082 too high",co2_low:"CO\u2082 too low",dryback_high:"Dryback too high",dryback_low:"Dryback too low",reservoir_low:"Reservoir low",reservoir_critical:"Reservoir critically low",irrigation_locked:"Irrigation locked ({reasons})",flower_switch_due:"12/12 flower switch due",phase_switch_due:"Phase switch due: {phase} \u2192 {to}"},lock_reasons:{kill_switch:"switched off",daily_shot_cap:"daily shot limit",daily_runtime_cap:"daily runtime limit",pot_saturated:"pot saturated",substrate_saturated:"substrate saturated",reservoir_critical:"reservoir empty"}},ne={loading:"Lade\u2026",no_grow:"Kein Grow eingerichtet. Unter Einstellungen \u2192 Ger\xE4te & Dienste \u2192 Precision Grow hinzuf\xFCgen.",error:"Grows konnten nicht geladen werden",saved:"Gespeichert",save_failed:"Speichern fehlgeschlagen",save:"Speichern",day:"Tag",day_in_phase:"Tag in der Phase",tabs:{overview:"\xDCbersicht",nutrients:"N\xE4hrstoffe",energy:"Energie & Kosten",log:"Grow-Log"},climate:"Klima",light:"Licht",irrigation:"Bew\xE4sserung",reservoir:"Tank",temperature:"Temperatur",humidity:"Luftfeuchte",vpd:"VPD",lvpd:"Blatt-VPD",dli:"DLI",brightness:"Helligkeit",remaining:"\xFCbrig",weight:"Topfgewicht",dryback:"Dryback",shots_today:"Shots heute",p_phase:"Tagesphase",water_temp:"Wassertemp.",level:"F\xFCllstand",liters:"Menge",target:"Ziel",chart_climate:"Klima 24 h",chart_dryback:"Topfgewicht 24 h",alerts:"Warnungen",no_alerts:"Keine Warnungen",irrigation_locked:"Bew\xE4sserung gesperrt",irrigation_enabled:"Bew\xE4sserung aktiv",no_data:"Keine Daten",feed:"N\xE4hrl\xF6sung",ec:"EC",ph:"pH",recommendation:"Empfehlung",last_runoff:"Letzter Runoff",target_ec:"Ziel-EC",log_runoff:"Runoff erfassen",runoff_ec:"Runoff-EC (mS/cm)",runoff_ph:"Runoff-pH",volume_ml:"Menge (mL)",ppm:"PPM",note:"Notiz",chart_feed:"EC / pH N\xE4hrl\xF6sung 7 Tage",trend:"Trend",ec_vs_feed:"Runoff vs. N\xE4hrl\xF6sung",recommendations:{increase_ec:"EC erh\xF6hen",keep_ec:"EC beibehalten",reduce_ec:"EC senken",flush:"Sp\xFClen",check_roots:"Wurzeln pr\xFCfen"},trends:{substrate_ec_falling:"Substrat-EC f\xE4llt",balanced:"ausgeglichen",ec_stacking:"EC staut sich",normal:"normal",check_rootzone:"Wurzelzone pr\xFCfen",stable:"stabil"},cost_today:"Pro Tag",cost_total:"Stromkosten",kwh_total:"Energie",cost_per_gram:"Kosten pro Gramm",extras:"Sonstige Kosten",kwh_per_device:"Energie pro Ger\xE4t",chart_cost:"Stromkosten 30 Tage",log_cost:"Kosten erfassen",amount:"Betrag (\u20AC)",recent_costs:"Letzte Kosten",harvest:"Ernte",wet_g:"Nassgewicht (g)",dry_g:"Trockengewicht (g)",extra_cost:"Zusatzkosten (\u20AC)",drying_loss:"Trocknungsverlust",phase_timeline:"Phasenverlauf",next_event:"N\xE4chster Trainingsschritt",flower_day:"Bl\xFCtetag",in_days:"in {n} Tagen",today:"heute",diary:"Tagebuch",diary_today:"Eintrag f\xFCr heute",comment:"Kommentar",image:"Bild (Pfad oder URL)",no_entries:"Noch keine Tagebucheintr\xE4ge",since:"seit",training:{lollipopping:"Lollipopping",defoliation_1:"Entlauben 1",defoliation_2:"Entlauben 2",flush:"Sp\xFClen",harvest_check:"Erntecheck"},phases:{clone:"Steckling",veg:"Wachstum",stretch:"Stretch",bulk:"Bl\xFCte",ripen:"Reife",drying:"Trocknung"},alert_text:{vpd_high:"VPD zu hoch",vpd_low:"VPD zu niedrig",dli_high:"DLI zu hoch",dli_low:"DLI zu niedrig",co2_high:"CO\u2082 zu hoch",co2_low:"CO\u2082 zu niedrig",dryback_high:"Dryback zu hoch",dryback_low:"Dryback zu niedrig",reservoir_low:"Tank fast leer",reservoir_critical:"Tank leer",irrigation_locked:"Bew\xE4sserung gesperrt ({reasons})",flower_switch_due:"Umstellung auf 12/12 f\xE4llig",phase_switch_due:"Phasenwechsel f\xE4llig: {phase} \u2192 {to}"},lock_reasons:{kill_switch:"ausgeschaltet",daily_shot_cap:"Tageslimit Shots",daily_runtime_cap:"Tageslimit Laufzeit",pot_saturated:"Topf ges\xE4ttigt",substrate_saturated:"Substrat ges\xE4ttigt",reservoir_critical:"Tank leer"}};function Lt(r){return(r||"en").split("-")[0]==="de"?ne:ie}function dt(r,t){return r.replace(/\{(\w+)\}/g,(e,s)=>String(t[s]??""))}function Ot(r,t){let e=t.key?r.alert_text[t.key]:void 0;if(!e)return t.message;let s=t.params??{};return dt(e,{reasons:(s.reasons??[]).map(i=>r.lock_reasons[i]??i).join(", "),phase:r.phases[s.phase]??s.phase??"",to:s.to?r.phases[s.to]??s.to:"\u2013"})}var f={temp:"var(--pg-temp, #e57373)",rh:"var(--pg-rh, #4fc3f7)",vpd:"var(--pg-vpd, #81c784)",weight:"var(--pg-weight, #ba68c8)",dryback:"var(--pg-dryback, #ffb74d)",ec:"var(--pg-ec, #9575cd)",ph:"var(--pg-ph, #4db6ac)",cost:"var(--pg-cost, #ffb74d)"};function D(r,t){let e=Date.now(),s=e-t*3600*1e3,i=Math.min(...r.map(n=>n.points[0]?.[0]??1/0));return[isFinite(i)?Math.max(s,i):s,e]}function T(r){return async t=>{t.preventDefault();let e=t.target,s=e.querySelector("button[type=submit]");s&&(s.disabled=!0);try{await r(e)&&e.reset()}finally{s&&(s.disabled=!1)}}}var pt={keys:["energy_cost_eur"],hours:720};function ae(r){let t=r.state("energy_total_kwh")?.attributes??{},e=Object.entries(t).filter(([i,n])=>i.includes(".")&&typeof n=="number").map(([i,n])=>({id:i,name:r.hass.states[i]?.attributes.friendly_name??i,kwh:n})).sort((i,n)=>n.kwh-i.kwh);if(!e.length)return l`<p class="muted">${r.t.no_data}</p>`;let s=e[0].kwh||1;return l`<div class="bars">
    ${e.map(i=>l`
      <button class="bar" @click=${()=>r.moreInfo(i.id)}>
        <span class="bname">${i.name}</span>
        <span class="btrack"><span style="width:${i.kwh/s*100}%"></span></span>
        <span class="bval">${r.number(i.kwh,2)} kWh</span>
      </button>`)}
  </div>`}function oe(r){let t=r.state("extra_costs_total")?.attributes.entries??[];return t.length?l`<h3>${r.t.recent_costs}</h3>
    <ul class="list">
      ${[...t].reverse().slice(0,8).map(e=>l`
        <li><span>${r.date(e.date)}</span><span class="grow">${e.note||"\u2013"}</span>
          <span>${r.number(e.amount,2)} €</span></li>`)}
    </ul>`:d}function le(r){let t=r.state("cost_per_gram")?.attributes??{};return t.dry_g==null?d:l`<div class="tiles">
    <div class="tile static"><span class="tlabel">${r.t.wet_g}</span><span class="tval">${r.number(t.wet_g,0)} g</span></div>
    <div class="tile static"><span class="tlabel">${r.t.dry_g}</span><span class="tval">${r.number(t.dry_g,0)} g</span></div>
    ${t.drying_loss_pct!=null?l`<div class="tile static"><span class="tlabel">${r.t.drying_loss}</span>
      <span class="tval">${r.number(t.drying_loss_pct,1)} %</span></div>`:d}
  </div>`}function Nt(r){let t=r.t,e=[{label:t.cost_total,unit:"\u20AC",color:f.cost,points:r.points("energy_cost_eur"),decimals:2}],[s,i]=D(e,pt.hours),n=T(async c=>{let o=A(c),p=v(o.amount);return p===void 0?!1:r.service("add_extra_cost",{amount:p,note:o.note??""})}),a=T(async c=>{let o=A(c),p=v(o.wet_g),h=v(o.dry_g);return p===void 0||h===void 0?!1:r.service("set_harvest",{wet_g:p,dry_g:h,extra_cost:v(o.extra_cost)??0})});return l`
    <div class="card">
      <h2>${t.tabs.energy}</h2>
      <div class="tiles">
        ${r.tile("daily_cost_eur",t.cost_today,{decimals:2})}
        ${r.tile("energy_cost_eur",t.cost_total,{decimals:2})}
        ${r.tile("energy_total_kwh",t.kwh_total,{decimals:1})}
        ${r.tile("extra_costs_total",t.extras,{decimals:2})}
        ${r.tile("cost_per_gram",t.cost_per_gram,{decimals:2})}
      </div>
      <h3>${t.chart_cost}</h3>
      <pg-chart .series=${e} .start=${s} .end=${i} .lang=${r.lang} no-data=${t.no_data}></pg-chart>
    </div>

    <div class="card">
      <h2>${t.kwh_per_device}</h2>
      ${ae(r)}
    </div>

    <div class="card">
      <h2>${t.log_cost}</h2>
      <form @submit=${n}>
        <label>${t.amount}<input name="amount" inputmode="decimal" required pattern="-?[0-9]+([.,][0-9]+)?"></label>
        <label class="wide">${t.note}<input name="note" maxlength="200"></label>
        <button type="submit">${t.save}</button>
      </form>
      ${oe(r)}
    </div>

    <div class="card">
      <h2>${t.harvest}</h2>
      ${le(r)}
      <form @submit=${a}>
        <label>${t.wet_g}<input name="wet_g" inputmode="decimal" required pattern="[0-9]+([.,][0-9]+)?"></label>
        <label>${t.dry_g}<input name="dry_g" inputmode="decimal" required pattern="[0-9]+([.,][0-9]+)?"></label>
        <label>${t.extra_cost}<input name="extra_cost" inputmode="decimal" pattern="[0-9]+([.,][0-9]+)?"></label>
        <button type="submit">${t.save}</button>
      </form>
    </div>`}var Mt=86400*1e3,It={clone:"#90caf9",veg:"#81c784",stretch:"#fff176",bulk:"#ffb74d",ripen:"#e57373",drying:"#a1887f"};function B(r){return new Date(`${r}T00:00:00`).getTime()}function ce(r){let t=r.grow.phase_timeline??[];if(!t.length)return d;let e=r.grow.start_date&&r.grow.start_date<t[0].date?r.grow.start_date:t[0].date,s=B(e),i=Math.max(Date.now(),s+Mt),n=i-s,a=[];B(t[0].date)>s&&a.push({phase:null,from:s,to:B(t[0].date)}),t.forEach((o,p)=>{let h=p+1<t.length?B(t[p+1].date):i;a.push({phase:o.phase,from:B(o.date),to:h})});let c=o=>Math.max(1,Math.round(o/Mt));return l`
    <div class="timeline">
      ${a.map(o=>l`<div class="seg" title=${o.phase?r.t.phases[o.phase]??o.phase:"?"}
        style="flex:${(o.to-o.from)/n};background:${o.phase?It[o.phase]??"#bdbdbd":"var(--divider-color)"}"></div>`)}
    </div>
    <ul class="list">
      ${a.filter(o=>o.phase).map(o=>l`<li>
        <span class="swatch" style="background:${It[o.phase]??"#bdbdbd"}"></span>
        <span class="grow">${r.t.phases[o.phase]??o.phase}</span>
        <span>${r.t.since} ${r.date(new Date(o.from).toISOString())}</span>
        <span>${c(o.to-o.from)} d</span></li>`)}
    </ul>`}function de(r){let t=r.state("next_training_event");if(!t||t.state==="unknown"||t.state==="unavailable")return d;let e=t.attributes.in_days,s=e==null?"":e<=0?r.t.today:dt(r.t.in_days,{n:e});return r.tile("next_training_event",r.t.next_event,{value:r.t.training[t.state]??t.state,sub:s})}function pe(r,t){if(!t)return"";let e=[];return t.phase&&e.push(r.t.phases[t.phase]??String(t.phase)),t.day_total!=null&&e.push(`${r.t.day} ${t.day_total}`),typeof t.temp=="number"&&e.push(`${r.number(t.temp,1)} \xB0C`),typeof t.humidity=="number"&&e.push(`${r.number(t.humidity,0)} %`),typeof t.vpd=="number"&&e.push(`VPD ${r.number(t.vpd,2)}`),typeof t.dryback_pct=="number"&&e.push(`${r.t.dryback} ${r.number(t.dryback_pct,1)} %`),e.join(" \xB7 ")}function he(r){let t=r.state("diary_count")?.attributes.entries??[];return t.length?l`<div class="diary">
    ${t.map(e=>l`<div class="entry">
      ${e.thumb?l`<img src=${e.thumb} alt="" loading="lazy">`:l`<div class="noimg"></div>`}
      <div>
        <div class="edate">${r.date(e.date)}</div>
        ${e.comment?l`<div>${e.comment}</div>`:d}
        <div class="muted small">${pe(r,e.snapshot)}</div>
      </div>
    </div>`)}
  </div>`:l`<p class="muted">${r.t.no_entries}</p>`}function zt(r){let t=r.t,e=T(async s=>{let i=A(s);return!i.comment&&!i.image?!1:r.service("add_diary_entry",{comment:i.comment??"",image:i.image??""})});return l`
    <div class="card">
      <h2>${t.phase_timeline}</h2>
      ${ce(r)}
      <div class="tiles" style="margin-top:12px">
        ${de(r)}
        ${r.tile("flower_day",r.t.flower_day,{decimals:0})}
      </div>
    </div>

    <div class="card">
      <h2>${t.diary_today}</h2>
      <form @submit=${e}>
        <label class="wide">${t.comment}<textarea name="comment" rows="3" maxlength="1000"></textarea></label>
        <label class="wide">${t.image}<input name="image" maxlength="500" placeholder="/media/..."></label>
        <button type="submit">${t.save}</button>
      </form>
    </div>

    <div class="card wide">
      <h2>${t.diary}</h2>
      ${he(r)}
    </div>`}var ht={keys:["ec","ph"],hours:168},ue={keep_ec:"optimal",increase_ec:"warning",reduce_ec:"warning",flush:"critical",check_roots:"critical"};function ge(r){let t=r.t,e=r.state("nutrient_recommendation"),s=e?.attributes??{};if(!e||s.runoff_ec==null)return l`<p class="muted">${t.no_data}</p>`;let i=e.state;return l`
    <div class="tiles">
      ${r.tile("nutrient_recommendation",t.recommendation,{value:t.recommendations[i]??i,status:ue[i],sub:r.date(s.ts)})}
      <div class="tile static"><span class="tlabel">${t.runoff_ec}</span>
        <span class="tval">${r.number(s.runoff_ec,2)}</span>
        <span class="tsub">${t.target_ec} ${r.number(s.target_ec,2)}</span></div>
      <div class="tile static"><span class="tlabel">${t.runoff_ph}</span>
        <span class="tval">${r.number(s.runoff_ph,2)}</span>
        <span class="tsub">${t.trend}: ${t.trends[s.ph_trend]??s.ph_trend??"\u2013"}</span></div>
      <div class="tile static"><span class="tlabel">${t.ec_vs_feed}</span>
        <span class="tval small">${t.trends[s.ec_trend]??s.ec_trend??"\u2013"}</span></div>
    </div>
    ${s.note?l`<p class="muted">${t.note}: ${s.note}</p>`:d}`}function Ut(r){let t=r.t,e=[{label:t.ec,unit:"mS/cm",color:f.ec,points:r.points("ec"),decimals:2},{label:t.ph,unit:"",color:f.ph,points:r.points("ph"),decimals:2}],[s,i]=D(e,ht.hours),n=T(async a=>{let c=A(a),o=v(c.runoff_ec),p=v(c.runoff_ph);if(o===void 0||p===void 0)return!1;let h={runoff_ec:o,runoff_ph:p,note:c.note??""},u=v(c.volume_ml),g=v(c.ppm);return u!==void 0&&(h.volume_ml=u),g!==void 0&&(h.ppm=g),r.service("log_runoff",h)});return l`
    <div class="card">
      <h2>${t.feed}</h2>
      <div class="tiles">
        ${r.tile("ec",t.ec,{decimals:2})}
        ${r.tile("ph",t.ph,{decimals:2})}
      </div>
      <h3>${t.chart_feed}</h3>
      <pg-chart .series=${e} .start=${s} .end=${i} .lang=${r.lang} no-data=${t.no_data}></pg-chart>
    </div>

    <div class="card">
      <h2>${t.last_runoff}</h2>
      ${ge(r)}
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
    </div>`}var ut={keys:["temperature","humidity","vpd","weight","dryback_pct"],hours:24};function me(r){let t=r.status("reservoir_status");if(t==="critical")return"critical";if(t==="low"||t==="warning")return"warning"}function fe(r){let t=r.grow.entities.irrigation_enabled,e=t?r.hass.states[t]:void 0;if(!t||!e)return d;let s=r.state("irrigation_locked")?.state==="on";return l`<div class="row">
    <span>${r.t.irrigation_enabled}</span>
    ${s?l`<span class="badge critical">${r.t.irrigation_locked}</span>`:d}
    <ha-switch .checked=${e.state==="on"}
      @change=${()=>r.hass.callService("switch","toggle",{entity_id:t})}></ha-switch>
  </div>`}function Bt(r){let t=r.t,e=r.grow.targets,s=[{label:t.temperature,unit:"\xB0C",color:f.temp,points:r.points("temperature"),band:r.band("temp_day")},{label:t.humidity,unit:"%",color:f.rh,points:r.points("humidity"),band:r.band("rh"),decimals:0},{label:t.vpd,unit:"kPa",color:f.vpd,points:r.points("vpd"),band:r.band("vpd"),decimals:2}],i=[{label:t.weight,unit:"g",color:f.weight,points:r.points("weight"),decimals:0},{label:t.dryback,unit:"%",color:f.dryback,points:r.points("dryback_pct"),band:r.band("dryback_p3")}],[n,a]=D([...s,...i],ut.hours),c=r.num("light_elapsed_pct");return l`
    <div class="card">
      <h2>${t.climate}</h2>
      <div class="tiles">
        ${r.tile("temperature",t.temperature,{sub:r.range(e.temp_day,"\xB0C")})}
        ${r.tile("humidity",t.humidity,{decimals:0,sub:r.range(e.rh,"%")})}
        ${r.tile("vpd",t.vpd,{decimals:2,sub:r.range(e.vpd,"kPa"),status:r.status("vpd_status")})}
        ${r.tile("lvpd",t.lvpd,{decimals:2})}
      </div>
      <h3>${t.chart_climate}</h3>
      <pg-chart .series=${s} .start=${n} .end=${a} .lang=${r.lang} no-data=${t.no_data}></pg-chart>
    </div>

    <div class="card">
      <h2>${t.light}</h2>
      <div class="tiles">
        ${r.tile("brightness_pct",t.brightness,{decimals:0,sub:r.grow.brightness_target!=null?`${t.target} ${r.grow.brightness_target} %`:""})}
        ${r.tile("dli",t.dli,{sub:r.range(r.grow.dli_target,"mol/m\xB2/d"),status:r.status("dli_status")})}
        ${r.tile("light_remaining",t.remaining,{decimals:1})}
      </div>
      ${c!==null?l`<div class="progress"><div style="width:${Math.min(100,c)}%"></div></div>`:d}
    </div>

    <div class="card">
      <h2>${t.irrigation}</h2>
      <div class="tiles">
        ${r.tile("weight",t.weight,{decimals:0})}
        ${r.tile("dryback_pct",t.dryback,{sub:r.range(e.dryback_p3,"%"),status:r.status("dryback_status")})}
        ${r.tile("p_phase",t.p_phase)}
        ${r.tile("irrigation_shots_today",t.shots_today,{decimals:0})}
      </div>
      ${fe(r)}
      <h3>${t.chart_dryback}</h3>
      <pg-chart .series=${i} .start=${n} .end=${a} .lang=${r.lang} no-data=${t.no_data}></pg-chart>
    </div>

    <div class="card">
      <h2>${t.reservoir}</h2>
      <div class="tiles">
        ${r.tile("reservoir_pct",t.level,{decimals:0,status:me(r)})}
        ${r.tile("reservoir_liters",t.liters,{decimals:1})}
        ${r.tile("water_temp",t.water_temp)}
      </div>
    </div>`}var _e=300*1e3,Ft="precision_grow_panel_grow",gt="precision_grow_panel_tab",Vt=["overview","nutrients","energy","log"],ve={overview:ut,nutrients:ht,energy:pt,log:null},F=class extends _{constructor(){super(...arguments);this.narrow=!1;this._grows=null;this._selected=localStorage.getItem(Ft);this._tab=Vt.includes(localStorage.getItem(gt)??"")?localStorage.getItem(gt):"overview";this._error=null;this._history={}}connectedCallback(){super.connectedCallback(),this._timer=window.setInterval(()=>this._refresh(),_e)}disconnectedCallback(){super.disconnectedCallback(),this._timer&&window.clearInterval(this._timer)}firstUpdated(){this._refresh()}get _t(){return Lt(this.hass?.locale?.language??this.hass?.language)}get _grow(){if(this._grows?.length)return this._grows.find(e=>e.entry_id===this._selected)??this._grows[0]}async _refresh(){if(this.hass){try{let e=await this.hass.callWS({type:"precision_grow/grows"});this._grows=e.grows,this._error=null}catch(e){this._error=`${this._t.error}: ${e?.message??e}`;return}await this._loadHistory()}}async _loadHistory(){let e=this._grow,s=ve[this._tab];if(!e||!s)return;let i=s.keys.map(c=>e.entities[c]).filter(Boolean);if(!i.length){this._history={};return}let n=Date.now(),a=n-s.hours*3600*1e3;try{this._history=await this.hass.callWS({type:"history/history_during_period",start_time:new Date(a).toISOString(),end_time:new Date(n).toISOString(),entity_ids:i,minimal_response:!0,no_attributes:!0,significant_changes_only:!1})}catch{this._history={}}}_select(e){this._selected=e.target.value,localStorage.setItem(Ft,this._selected),this._refresh()}_setTab(e){e!==this._tab&&(this._tab=e,localStorage.setItem(gt,e),this._history={},this._refresh())}_header(e,s){let i=this._t;return l`
      <div class="toolbar">
        <ha-menu-button .hass=${this.hass} .narrow=${this.narrow}></ha-menu-button>
        <div class="title">Precision Grow</div>
        ${this._grows&&this._grows.length>1?l`<select @change=${this._select} aria-label="Grow">
              ${this._grows.map(n=>l`<option value=${n.entry_id}
                ?selected=${n.entry_id===e?.entry_id}>${n.title}</option>`)}
            </select>`:e?l`<div class="growname">${e.title}</div>`:d}
      </div>
      ${e&&s?l`
        <div class="tabs" role="tablist">
          ${Vt.map(n=>l`<button role="tab" aria-selected=${n===this._tab}
            class=${n===this._tab?"active":""} @click=${()=>this._setTab(n)}>${i.tabs[n]}</button>`)}
        </div>
        <div class="summary">
          <span class="phase">${i.phases[e.phase]??e.phase}</span>
          ${s.num("day_total")!==null?l`<span>${i.day} ${s.num("day_total")}</span>`:d}
          ${s.num("day_in_phase")!==null?l`<span>${s.num("day_in_phase")}. ${i.day_in_phase}</span>`:d}
          ${this._alertChip(s)}
        </div>`:d}`}_alertChip(e){let s=e.state("alert_level");if(!s)return d;let i=s.attributes.count??0;return l`<button class="chip ${s.state}" @click=${()=>e.moreInfo("alert_level")}>
      ${i?`${this._t.alerts}: ${i}`:this._t.no_alerts}</button>`}_alerts(e){let s=e.state("alert_level")?.attributes.items;return s?.length?l`<div class="card wide">
      <h2>${this._t.alerts}</h2>
      ${s.map(i=>l`<div class="alert ${i.severity}">${Ot(this._t,i)}</div>`)}
    </div>`:d}_body(e){switch(this._tab){case"nutrients":return Ut(e);case"energy":return Nt(e);case"log":return zt(e);default:return l`${this._alerts(e)}${Bt(e)}`}}render(){let e=this._t;if(this._error)return l`${this._header(void 0)}<div class="msg">${this._error}</div>`;if(this._grows===null)return l`${this._header(void 0)}<div class="msg">${e.loading}</div>`;let s=this._grow;if(!s)return l`${this._header(void 0)}<div class="msg">${e.no_grow}</div>`;let i=new Z(this.hass,s,e,this._history,this);return l`${this._header(s,i)}<div class="content">${this._body(i)}</div>`}};F.properties={hass:{attribute:!1},narrow:{type:Boolean},_grows:{state:!0},_selected:{state:!0},_tab:{state:!0},_error:{state:!0},_history:{state:!0}},F.styles=H`
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
  `;customElements.get("precision-grow-panel")||customElements.define("precision-grow-panel",F);
