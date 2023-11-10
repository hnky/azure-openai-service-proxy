"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[863],{4137:(e,t,n)=>{n.d(t,{Zo:()=>d,kt:()=>h});var r=n(7294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var c=r.createContext({}),p=function(e){var t=r.useContext(c),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},d=function(e){var t=p(e.components);return r.createElement(c.Provider,{value:t},e.children)},u="mdxType",s={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},m=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,o=e.originalType,c=e.parentName,d=l(e,["components","mdxType","originalType","parentName"]),u=p(n),m=a,h=u["".concat(c,".").concat(m)]||u[m]||s[m]||o;return n?r.createElement(h,i(i({ref:t},d),{},{components:n})):r.createElement(h,i({ref:t},d))}));function h(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=n.length,i=new Array(o);i[0]=m;var l={};for(var c in t)hasOwnProperty.call(t,c)&&(l[c]=t[c]);l.originalType=e,l[u]="string"==typeof e?e:a,i[1]=l;for(var p=2;p<o;p++)i[p]=n[p];return r.createElement.apply(null,i)}return r.createElement.apply(null,n)}m.displayName="MDXCreateElement"},5567:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>c,contentTitle:()=>i,default:()=>s,frontMatter:()=>o,metadata:()=>l,toc:()=>p});var r=n(7462),a=(n(7294),n(4137));const o={},i="Adding an event code",l={unversionedId:"Authorization/adding-event",id:"Authorization/adding-event",title:"Adding an event code",description:"For now, you add an event via the Azure Storage Account Storage browser. The Storage browser is available in the Azure Portal, under the Storage account resource.",source:"@site/docs/30-Authorization/20-adding-event.md",sourceDirName:"30-Authorization",slug:"/Authorization/adding-event",permalink:"/azure-openai-service-proxy/Authorization/adding-event",draft:!1,editUrl:"https://github.com/gloveboxes/azure-openai-service-proxy/tree/master/docs/docs/30-Authorization/20-adding-event.md",tags:[],version:"current",sidebarPosition:20,frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"Event authorization",permalink:"/azure-openai-service-proxy/Authorization/authorisation"},next:{title:"OpenAI model deployments",permalink:"/azure-openai-service-proxy/openai-deployments"}},c={},p=[{value:"UTC Time",id:"utc-time",level:2},{value:"Example",id:"example",level:2},{value:"Event Code Cache",id:"event-code-cache",level:2}],d={toc:p},u="wrapper";function s(e){let{components:t,...o}=e;return(0,a.kt)(u,(0,r.Z)({},d,o,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"adding-an-event-code"},"Adding an event code"),(0,a.kt)("p",null,"For now, you add an event via the Azure Storage Account ",(0,a.kt)("inlineCode",{parentName:"p"},"Storage browser"),". The ",(0,a.kt)("inlineCode",{parentName:"p"},"Storage browser")," is available in the Azure Portal, under the ",(0,a.kt)("inlineCode",{parentName:"p"},"Storage account")," resource."),(0,a.kt)("ol",null,(0,a.kt)("li",{parentName:"ol"},"Select the Azure Storage Account resource, then select ",(0,a.kt)("inlineCode",{parentName:"li"},"Storage explorer (preview)")," from the left-hand menu, then select ",(0,a.kt)("inlineCode",{parentName:"li"},"Tables")," from the left-hand menu."),(0,a.kt)("li",{parentName:"ol"},"Next, select the ",(0,a.kt)("inlineCode",{parentName:"li"},"playgroundauthorization")," table. "),(0,a.kt)("li",{parentName:"ol"},"Add an entry using the above schema, noting that the ",(0,a.kt)("inlineCode",{parentName:"li"},"PartitionKey")," must be set to ",(0,a.kt)("inlineCode",{parentName:"li"},"playground")," and the column names are case sensitive, and you must enter dates in ",(0,a.kt)("a",{parentName:"li",href:"https://en.wikipedia.org/wiki/ISO_8601"},"ISO 8601")," format in UTC. ")),(0,a.kt)("h2",{id:"utc-time"},"UTC Time"),(0,a.kt)("p",null,"The ",(0,a.kt)("a",{parentName:"p",href:"https://www.worldtimebuddy.com"},"worldtimebuddy")," is a great time resource to convert your local time to UTC."),(0,a.kt)("p",null,(0,a.kt)("img",{src:n(3319).Z,width:"1014",height:"158"})),(0,a.kt)("h2",{id:"example"},"Example"),(0,a.kt)("p",null,"Here is an example"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-text"},"PartitionKey: playground\nRowKey: myevent2022\nActive: true\nMaxTokenCap: 1024\nStartUTC: 2023-10-01T00:00:00Z\nEndUTC: 2023-10-02T00:00:00Z\nEventName: My Event 2023\nContactName: John Smith\nContactEmail: jsmith@example.com\n")),(0,a.kt)("h2",{id:"event-code-cache"},"Event Code Cache"),(0,a.kt)("p",null,"Event data, namely the ",(0,a.kt)("inlineCode",{parentName:"p"},"EventCode"),", ",(0,a.kt)("inlineCode",{parentName:"p"},"StartUTC"),", ",(0,a.kt)("inlineCode",{parentName:"p"},"EndUTC"),", and ",(0,a.kt)("inlineCode",{parentName:"p"},"MaxTokenCap")," are cached by the proxy service. The cache is refreshed every 10 minutes. Caching is implemented to improve performance by reducing the number of calls to the Azure Storage Account table. Because of caching, it may take up to 10 minutes for the changes to be reflected in the proxy service."))}s.isMDXComponent=!0},3319:(e,t,n)=>{n.d(t,{Z:()=>r});const r=n.p+"assets/images/world_time_buddy-cb051c158f79389a66c9d1781409624e.png"}}]);