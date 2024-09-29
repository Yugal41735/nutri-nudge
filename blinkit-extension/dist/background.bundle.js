/*! For license information please see background.bundle.js.LICENSE.txt */
(()=>{var t={445:(t,e)=>{"use strict";var n,o,s;e.SchemaType=void 0,(n=e.SchemaType||(e.SchemaType={})).STRING="string",n.NUMBER="number",n.INTEGER="integer",n.BOOLEAN="boolean",n.ARRAY="array",n.OBJECT="object",e.ExecutableCodeLanguage=void 0,(o=e.ExecutableCodeLanguage||(e.ExecutableCodeLanguage={})).LANGUAGE_UNSPECIFIED="language_unspecified",o.PYTHON="python",e.Outcome=void 0,(s=e.Outcome||(e.Outcome={})).OUTCOME_UNSPECIFIED="outcome_unspecified",s.OUTCOME_OK="outcome_ok",s.OUTCOME_FAILED="outcome_failed",s.OUTCOME_DEADLINE_EXCEEDED="outcome_deadline_exceeded";const r=["user","model","function","system"];var i,a,c,l,u,d,h,f;e.HarmCategory=void 0,(i=e.HarmCategory||(e.HarmCategory={})).HARM_CATEGORY_UNSPECIFIED="HARM_CATEGORY_UNSPECIFIED",i.HARM_CATEGORY_HATE_SPEECH="HARM_CATEGORY_HATE_SPEECH",i.HARM_CATEGORY_SEXUALLY_EXPLICIT="HARM_CATEGORY_SEXUALLY_EXPLICIT",i.HARM_CATEGORY_HARASSMENT="HARM_CATEGORY_HARASSMENT",i.HARM_CATEGORY_DANGEROUS_CONTENT="HARM_CATEGORY_DANGEROUS_CONTENT",e.HarmBlockThreshold=void 0,(a=e.HarmBlockThreshold||(e.HarmBlockThreshold={})).HARM_BLOCK_THRESHOLD_UNSPECIFIED="HARM_BLOCK_THRESHOLD_UNSPECIFIED",a.BLOCK_LOW_AND_ABOVE="BLOCK_LOW_AND_ABOVE",a.BLOCK_MEDIUM_AND_ABOVE="BLOCK_MEDIUM_AND_ABOVE",a.BLOCK_ONLY_HIGH="BLOCK_ONLY_HIGH",a.BLOCK_NONE="BLOCK_NONE",e.HarmProbability=void 0,(c=e.HarmProbability||(e.HarmProbability={})).HARM_PROBABILITY_UNSPECIFIED="HARM_PROBABILITY_UNSPECIFIED",c.NEGLIGIBLE="NEGLIGIBLE",c.LOW="LOW",c.MEDIUM="MEDIUM",c.HIGH="HIGH",e.BlockReason=void 0,(l=e.BlockReason||(e.BlockReason={})).BLOCKED_REASON_UNSPECIFIED="BLOCKED_REASON_UNSPECIFIED",l.SAFETY="SAFETY",l.OTHER="OTHER",e.FinishReason=void 0,(u=e.FinishReason||(e.FinishReason={})).FINISH_REASON_UNSPECIFIED="FINISH_REASON_UNSPECIFIED",u.STOP="STOP",u.MAX_TOKENS="MAX_TOKENS",u.SAFETY="SAFETY",u.RECITATION="RECITATION",u.LANGUAGE="LANGUAGE",u.OTHER="OTHER",e.TaskType=void 0,(d=e.TaskType||(e.TaskType={})).TASK_TYPE_UNSPECIFIED="TASK_TYPE_UNSPECIFIED",d.RETRIEVAL_QUERY="RETRIEVAL_QUERY",d.RETRIEVAL_DOCUMENT="RETRIEVAL_DOCUMENT",d.SEMANTIC_SIMILARITY="SEMANTIC_SIMILARITY",d.CLASSIFICATION="CLASSIFICATION",d.CLUSTERING="CLUSTERING",e.FunctionCallingMode=void 0,(h=e.FunctionCallingMode||(e.FunctionCallingMode={})).MODE_UNSPECIFIED="MODE_UNSPECIFIED",h.AUTO="AUTO",h.ANY="ANY",h.NONE="NONE";class p extends Error{constructor(t){super(`[GoogleGenerativeAI Error]: ${t}`)}}class g extends p{constructor(t,e){super(t),this.response=e}}class m extends p{constructor(t,e,n,o){super(t),this.status=e,this.statusText=n,this.errorDetails=o}}class y extends p{}!function(t){t.GENERATE_CONTENT="generateContent",t.STREAM_GENERATE_CONTENT="streamGenerateContent",t.COUNT_TOKENS="countTokens",t.EMBED_CONTENT="embedContent",t.BATCH_EMBED_CONTENTS="batchEmbedContents"}(f||(f={}));class v{constructor(t,e,n,o,s){this.model=t,this.task=e,this.apiKey=n,this.stream=o,this.requestOptions=s}toString(){var t,e;const n=(null===(t=this.requestOptions)||void 0===t?void 0:t.apiVersion)||"v1beta";let o=`${(null===(e=this.requestOptions)||void 0===e?void 0:e.baseUrl)||"https://generativelanguage.googleapis.com"}/${n}/${this.model}:${this.task}`;return this.stream&&(o+="?alt=sse"),o}}async function E(t){var e;const n=new Headers;n.append("Content-Type","application/json"),n.append("x-goog-api-client",function(t){const e=[];return(null==t?void 0:t.apiClient)&&e.push(t.apiClient),e.push("genai-js/0.20.0"),e.join(" ")}(t.requestOptions)),n.append("x-goog-api-key",t.apiKey);let o=null===(e=t.requestOptions)||void 0===e?void 0:e.customHeaders;if(o){if(!(o instanceof Headers))try{o=new Headers(o)}catch(t){throw new y(`unable to convert customHeaders value ${JSON.stringify(o)} to Headers: ${t.message}`)}for(const[t,e]of o.entries()){if("x-goog-api-key"===t)throw new y(`Cannot set reserved header name ${t}`);if("x-goog-api-client"===t)throw new y(`Header name ${t} can only be set using the apiClient field`);n.append(t,e)}}return n}async function C(t,e,n,o,s,r={},i=fetch){const{url:a,fetchOptions:c}=await async function(t,e,n,o,s,r){const i=new v(t,e,n,o,r);return{url:i.toString(),fetchOptions:Object.assign(Object.assign({},O(r)),{method:"POST",headers:await E(i),body:s})}}(t,e,n,o,s,r);return async function(t,e,n=fetch){let o;try{o=await n(t,e)}catch(e){!function(t,e){let n=t;throw t instanceof m||t instanceof y||(n=new p(`Error fetching from ${e.toString()}: ${t.message}`),n.stack=t.stack),n}(e,t)}return o.ok||await async function(t,e){let n,o="";try{const e=await t.json();o=e.error.message,e.error.details&&(o+=` ${JSON.stringify(e.error.details)}`,n=e.error.details)}catch(t){}throw new m(`Error fetching from ${e.toString()}: [${t.status} ${t.statusText}] ${o}`,t.status,t.statusText,n)}(o,t),o}(a,c,i)}function O(t){const e={};if(void 0!==(null==t?void 0:t.signal)||(null==t?void 0:t.timeout)>=0){const n=new AbortController;(null==t?void 0:t.timeout)>=0&&setTimeout((()=>n.abort()),t.timeout),(null==t?void 0:t.signal)&&t.signal.addEventListener("abort",(()=>{n.abort()})),e.signal=n.signal}return e}function _(t){return t.text=()=>{if(t.candidates&&t.candidates.length>0){if(t.candidates.length>1&&console.warn(`This response had ${t.candidates.length} candidates. Returning text from the first candidate only. Access response.candidates directly to use the other candidates.`),I(t.candidates[0]))throw new g(`${b(t)}`,t);return function(t){var e,n,o,s;const r=[];if(null===(n=null===(e=t.candidates)||void 0===e?void 0:e[0].content)||void 0===n?void 0:n.parts)for(const e of null===(s=null===(o=t.candidates)||void 0===o?void 0:o[0].content)||void 0===s?void 0:s.parts)e.text&&r.push(e.text),e.executableCode&&r.push("\n```"+e.executableCode.language+"\n"+e.executableCode.code+"\n```\n"),e.codeExecutionResult&&r.push("\n```\n"+e.codeExecutionResult.output+"\n```\n");return r.length>0?r.join(""):""}(t)}if(t.promptFeedback)throw new g(`Text not available. ${b(t)}`,t);return""},t.functionCall=()=>{if(t.candidates&&t.candidates.length>0){if(t.candidates.length>1&&console.warn(`This response had ${t.candidates.length} candidates. Returning function calls from the first candidate only. Access response.candidates directly to use the other candidates.`),I(t.candidates[0]))throw new g(`${b(t)}`,t);return console.warn("response.functionCall() is deprecated. Use response.functionCalls() instead."),w(t)[0]}if(t.promptFeedback)throw new g(`Function call not available. ${b(t)}`,t)},t.functionCalls=()=>{if(t.candidates&&t.candidates.length>0){if(t.candidates.length>1&&console.warn(`This response had ${t.candidates.length} candidates. Returning function calls from the first candidate only. Access response.candidates directly to use the other candidates.`),I(t.candidates[0]))throw new g(`${b(t)}`,t);return w(t)}if(t.promptFeedback)throw new g(`Function call not available. ${b(t)}`,t)},t}function w(t){var e,n,o,s;const r=[];if(null===(n=null===(e=t.candidates)||void 0===e?void 0:e[0].content)||void 0===n?void 0:n.parts)for(const e of null===(s=null===(o=t.candidates)||void 0===o?void 0:o[0].content)||void 0===s?void 0:s.parts)e.functionCall&&r.push(e.functionCall);return r.length>0?r:void 0}const T=[e.FinishReason.RECITATION,e.FinishReason.SAFETY,e.FinishReason.LANGUAGE];function I(t){return!!t.finishReason&&T.includes(t.finishReason)}function b(t){var e,n,o;let s="";if(t.candidates&&0!==t.candidates.length||!t.promptFeedback){if(null===(o=t.candidates)||void 0===o?void 0:o[0]){const e=t.candidates[0];I(e)&&(s+=`Candidate was blocked due to ${e.finishReason}`,e.finishMessage&&(s+=`: ${e.finishMessage}`))}}else s+="Response was blocked",(null===(e=t.promptFeedback)||void 0===e?void 0:e.blockReason)&&(s+=` due to ${t.promptFeedback.blockReason}`),(null===(n=t.promptFeedback)||void 0===n?void 0:n.blockReasonMessage)&&(s+=`: ${t.promptFeedback.blockReasonMessage}`);return s}function R(t){return this instanceof R?(this.v=t,this):new R(t)}"function"==typeof SuppressedError&&SuppressedError;const S=/^data\: (.*)(?:\n\n|\r\r|\r\n\r\n)/;async function N(t){const e=[],n=t.getReader();for(;;){const{done:t,value:o}=await n.read();if(t)return _(x(e));e.push(o)}}function A(t){return function(t,e,n){if(!Symbol.asyncIterator)throw new TypeError("Symbol.asyncIterator is not defined.");var o,s=n.apply(t,e||[]),r=[];return o={},i("next"),i("throw"),i("return"),o[Symbol.asyncIterator]=function(){return this},o;function i(t){s[t]&&(o[t]=function(e){return new Promise((function(n,o){r.push([t,e,n,o])>1||a(t,e)}))})}function a(t,e){try{(n=s[t](e)).value instanceof R?Promise.resolve(n.value.v).then(c,l):u(r[0][2],n)}catch(t){u(r[0][3],t)}var n}function c(t){a("next",t)}function l(t){a("throw",t)}function u(t,e){t(e),r.shift(),r.length&&a(r[0][0],r[0][1])}}(this,arguments,(function*(){const e=t.getReader();for(;;){const{value:t,done:n}=yield R(e.read());if(n)break;yield yield R(_(t))}}))}function x(t){const e=t[t.length-1],n={promptFeedback:null==e?void 0:e.promptFeedback};for(const e of t){if(e.candidates)for(const t of e.candidates){const e=t.index;if(n.candidates||(n.candidates=[]),n.candidates[e]||(n.candidates[e]={index:t.index}),n.candidates[e].citationMetadata=t.citationMetadata,n.candidates[e].finishReason=t.finishReason,n.candidates[e].finishMessage=t.finishMessage,n.candidates[e].safetyRatings=t.safetyRatings,t.content&&t.content.parts){n.candidates[e].content||(n.candidates[e].content={role:t.content.role||"user",parts:[]});const o={};for(const s of t.content.parts)s.text&&(o.text=s.text),s.functionCall&&(o.functionCall=s.functionCall),s.executableCode&&(o.executableCode=s.executableCode),s.codeExecutionResult&&(o.codeExecutionResult=s.codeExecutionResult),0===Object.keys(o).length&&(o.text=""),n.candidates[e].content.parts.push(o)}}e.usageMetadata&&(n.usageMetadata=e.usageMetadata)}return n}async function L(t,e,n,o){return function(t){const e=function(t){const e=t.getReader();return new ReadableStream({start(t){let n="";return function o(){return e.read().then((({value:e,done:s})=>{if(s)return n.trim()?void t.error(new p("Failed to parse stream")):void t.close();n+=e;let r,i=n.match(S);for(;i;){try{r=JSON.parse(i[1])}catch(e){return void t.error(new p(`Error parsing JSON response: "${i[1]}"`))}t.enqueue(r),n=n.substring(i[0].length),i=n.match(S)}return o()}))}()}})}(t.body.pipeThrough(new TextDecoderStream("utf8",{fatal:!0}))),[n,o]=e.tee();return{stream:A(n),response:N(o)}}(await C(e,f.STREAM_GENERATE_CONTENT,t,!0,JSON.stringify(n),o))}async function M(t,e,n,o){const s=await C(e,f.GENERATE_CONTENT,t,!1,JSON.stringify(n),o);return{response:_(await s.json())}}function G(t){if(null!=t)return"string"==typeof t?{role:"system",parts:[{text:t}]}:t.text?{role:"system",parts:[t]}:t.parts?t.role?t:{role:"system",parts:t.parts}:void 0}function F(t){let e=[];if("string"==typeof t)e=[{text:t}];else for(const n of t)"string"==typeof n?e.push({text:n}):e.push(n);return function(t){const e={role:"user",parts:[]},n={role:"function",parts:[]};let o=!1,s=!1;for(const r of t)"functionResponse"in r?(n.parts.push(r),s=!0):(e.parts.push(r),o=!0);if(o&&s)throw new p("Within a single message, FunctionResponse cannot be mixed with other type of part in the request for sending chat message.");if(!o&&!s)throw new p("No content is provided for sending chat message.");return o?e:n}(e)}function H(t){let e;return e=t.contents?t:{contents:[F(t)]},t.systemInstruction&&(e.systemInstruction=G(t.systemInstruction)),e}const P=["text","inlineData","functionCall","functionResponse","executableCode","codeExecutionResult"],j={user:["text","inlineData"],function:["functionResponse"],model:["text","functionCall","executableCode","codeExecutionResult"],system:["text"]},D="SILENT_ERROR";class k{constructor(t,e,n,o={}){this.model=e,this.params=n,this._requestOptions=o,this._history=[],this._sendPromise=Promise.resolve(),this._apiKey=t,(null==n?void 0:n.history)&&(function(t){let e=!1;for(const n of t){const{role:t,parts:o}=n;if(!e&&"user"!==t)throw new p(`First content should be with role 'user', got ${t}`);if(!r.includes(t))throw new p(`Each item should include role field. Got ${t} but valid roles are: ${JSON.stringify(r)}`);if(!Array.isArray(o))throw new p("Content should have 'parts' property with an array of Parts");if(0===o.length)throw new p("Each Content should have at least one part");const s={text:0,inlineData:0,functionCall:0,functionResponse:0,fileData:0,executableCode:0,codeExecutionResult:0};for(const t of o)for(const e of P)e in t&&(s[e]+=1);const i=j[t];for(const e of P)if(!i.includes(e)&&s[e]>0)throw new p(`Content with role '${t}' can't contain '${e}' part`);e=!0}}(n.history),this._history=n.history)}async getHistory(){return await this._sendPromise,this._history}async sendMessage(t,e={}){var n,o,s,r,i,a;await this._sendPromise;const c=F(t),l={safetySettings:null===(n=this.params)||void 0===n?void 0:n.safetySettings,generationConfig:null===(o=this.params)||void 0===o?void 0:o.generationConfig,tools:null===(s=this.params)||void 0===s?void 0:s.tools,toolConfig:null===(r=this.params)||void 0===r?void 0:r.toolConfig,systemInstruction:null===(i=this.params)||void 0===i?void 0:i.systemInstruction,cachedContent:null===(a=this.params)||void 0===a?void 0:a.cachedContent,contents:[...this._history,c]},u=Object.assign(Object.assign({},this._requestOptions),e);let d;return this._sendPromise=this._sendPromise.then((()=>M(this._apiKey,this.model,l,u))).then((t=>{var e;if(t.response.candidates&&t.response.candidates.length>0){this._history.push(c);const n=Object.assign({parts:[],role:"model"},null===(e=t.response.candidates)||void 0===e?void 0:e[0].content);this._history.push(n)}else{const e=b(t.response);e&&console.warn(`sendMessage() was unsuccessful. ${e}. Inspect response object for details.`)}d=t})),await this._sendPromise,d}async sendMessageStream(t,e={}){var n,o,s,r,i,a;await this._sendPromise;const c=F(t),l={safetySettings:null===(n=this.params)||void 0===n?void 0:n.safetySettings,generationConfig:null===(o=this.params)||void 0===o?void 0:o.generationConfig,tools:null===(s=this.params)||void 0===s?void 0:s.tools,toolConfig:null===(r=this.params)||void 0===r?void 0:r.toolConfig,systemInstruction:null===(i=this.params)||void 0===i?void 0:i.systemInstruction,cachedContent:null===(a=this.params)||void 0===a?void 0:a.cachedContent,contents:[...this._history,c]},u=Object.assign(Object.assign({},this._requestOptions),e),d=L(this._apiKey,this.model,l,u);return this._sendPromise=this._sendPromise.then((()=>d)).catch((t=>{throw new Error(D)})).then((t=>t.response)).then((t=>{if(t.candidates&&t.candidates.length>0){this._history.push(c);const e=Object.assign({},t.candidates[0].content);e.role||(e.role="model"),this._history.push(e)}else{const e=b(t);e&&console.warn(`sendMessageStream() was unsuccessful. ${e}. Inspect response object for details.`)}})).catch((t=>{t.message!==D&&console.error(t)})),d}}class U{constructor(t,e,n={}){this.apiKey=t,this._requestOptions=n,e.model.includes("/")?this.model=e.model:this.model=`models/${e.model}`,this.generationConfig=e.generationConfig||{},this.safetySettings=e.safetySettings||[],this.tools=e.tools,this.toolConfig=e.toolConfig,this.systemInstruction=G(e.systemInstruction),this.cachedContent=e.cachedContent}async generateContent(t,e={}){var n;const o=H(t),s=Object.assign(Object.assign({},this._requestOptions),e);return M(this.apiKey,this.model,Object.assign({generationConfig:this.generationConfig,safetySettings:this.safetySettings,tools:this.tools,toolConfig:this.toolConfig,systemInstruction:this.systemInstruction,cachedContent:null===(n=this.cachedContent)||void 0===n?void 0:n.name},o),s)}async generateContentStream(t,e={}){var n;const o=H(t),s=Object.assign(Object.assign({},this._requestOptions),e);return L(this.apiKey,this.model,Object.assign({generationConfig:this.generationConfig,safetySettings:this.safetySettings,tools:this.tools,toolConfig:this.toolConfig,systemInstruction:this.systemInstruction,cachedContent:null===(n=this.cachedContent)||void 0===n?void 0:n.name},o),s)}startChat(t){var e;return new k(this.apiKey,this.model,Object.assign({generationConfig:this.generationConfig,safetySettings:this.safetySettings,tools:this.tools,toolConfig:this.toolConfig,systemInstruction:this.systemInstruction,cachedContent:null===(e=this.cachedContent)||void 0===e?void 0:e.name},t),this._requestOptions)}async countTokens(t,e={}){const n=function(t,e){var n;let o={model:null==e?void 0:e.model,generationConfig:null==e?void 0:e.generationConfig,safetySettings:null==e?void 0:e.safetySettings,tools:null==e?void 0:e.tools,toolConfig:null==e?void 0:e.toolConfig,systemInstruction:null==e?void 0:e.systemInstruction,cachedContent:null===(n=null==e?void 0:e.cachedContent)||void 0===n?void 0:n.name,contents:[]};const s=null!=t.generateContentRequest;if(t.contents){if(s)throw new y("CountTokensRequest must have one of contents or generateContentRequest, not both.");o.contents=t.contents}else if(s)o=Object.assign(Object.assign({},o),t.generateContentRequest);else{const e=F(t);o.contents=[e]}return{generateContentRequest:o}}(t,{model:this.model,generationConfig:this.generationConfig,safetySettings:this.safetySettings,tools:this.tools,toolConfig:this.toolConfig,systemInstruction:this.systemInstruction,cachedContent:this.cachedContent}),o=Object.assign(Object.assign({},this._requestOptions),e);return async function(t,e,n,o){return(await C(e,f.COUNT_TOKENS,t,!1,JSON.stringify(n),o)).json()}(this.apiKey,this.model,n,o)}async embedContent(t,e={}){const n="string"==typeof(s=t)||Array.isArray(s)?{content:F(s)}:s,o=Object.assign(Object.assign({},this._requestOptions),e);var s;return async function(t,e,n,o){return(await C(e,f.EMBED_CONTENT,t,!1,JSON.stringify(n),o)).json()}(this.apiKey,this.model,n,o)}async batchEmbedContents(t,e={}){const n=Object.assign(Object.assign({},this._requestOptions),e);return async function(t,e,n,o){const s=n.requests.map((t=>Object.assign(Object.assign({},t),{model:e})));return(await C(e,f.BATCH_EMBED_CONTENTS,t,!1,JSON.stringify({requests:s}),o)).json()}(this.apiKey,this.model,t,n)}}e.ChatSession=k,e.GenerativeModel=U,e.GoogleGenerativeAI=class{constructor(t){this.apiKey=t}getGenerativeModel(t,e){if(!t.model)throw new p("Must provide a model name. Example: genai.getGenerativeModel({ model: 'my-model-name' })");return new U(this.apiKey,t,e)}getGenerativeModelFromCachedContent(t,e,n){if(!t.name)throw new y("Cached content must contain a `name` field.");if(!t.model)throw new y("Cached content must contain a `model` field.");const o=["model","systemInstruction"];for(const n of o)if((null==e?void 0:e[n])&&t[n]&&(null==e?void 0:e[n])!==t[n]){if("model"===n&&(e.model.startsWith("models/")?e.model.replace("models/",""):e.model)===(t.model.startsWith("models/")?t.model.replace("models/",""):t.model))continue;throw new y(`Different value for "${n}" specified in modelParams (${e[n]}) and cachedContent (${t[n]})`)}const s=Object.assign(Object.assign({},e),{model:t.model,tools:t.tools,toolConfig:t.toolConfig,systemInstruction:t.systemInstruction,cachedContent:t});return new U(this.apiKey,s,n)}},e.GoogleGenerativeAIError=p,e.GoogleGenerativeAIFetchError=m,e.GoogleGenerativeAIRequestInputError=y,e.GoogleGenerativeAIResponseError=g,e.POSSIBLE_ROLES=r}},e={};function n(o){var s=e[o];if(void 0!==s)return s.exports;var r=e[o]={exports:{}};return t[o](r,r.exports,n),r.exports}function o(t){return o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},o(t)}function s(){"use strict";s=function(){return e};var t,e={},n=Object.prototype,r=n.hasOwnProperty,i=Object.defineProperty||function(t,e,n){t[e]=n.value},a="function"==typeof Symbol?Symbol:{},c=a.iterator||"@@iterator",l=a.asyncIterator||"@@asyncIterator",u=a.toStringTag||"@@toStringTag";function d(t,e,n){return Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}),t[e]}try{d({},"")}catch(t){d=function(t,e,n){return t[e]=n}}function h(t,e,n,o){var s=e&&e.prototype instanceof E?e:E,r=Object.create(s.prototype),a=new L(o||[]);return i(r,"_invoke",{value:S(t,n,a)}),r}function f(t,e,n){try{return{type:"normal",arg:t.call(e,n)}}catch(t){return{type:"throw",arg:t}}}e.wrap=h;var p="suspendedStart",g="suspendedYield",m="executing",y="completed",v={};function E(){}function C(){}function O(){}var _={};d(_,c,(function(){return this}));var w=Object.getPrototypeOf,T=w&&w(w(M([])));T&&T!==n&&r.call(T,c)&&(_=T);var I=O.prototype=E.prototype=Object.create(_);function b(t){["next","throw","return"].forEach((function(e){d(t,e,(function(t){return this._invoke(e,t)}))}))}function R(t,e){function n(s,i,a,c){var l=f(t[s],t,i);if("throw"!==l.type){var u=l.arg,d=u.value;return d&&"object"==o(d)&&r.call(d,"__await")?e.resolve(d.__await).then((function(t){n("next",t,a,c)}),(function(t){n("throw",t,a,c)})):e.resolve(d).then((function(t){u.value=t,a(u)}),(function(t){return n("throw",t,a,c)}))}c(l.arg)}var s;i(this,"_invoke",{value:function(t,o){function r(){return new e((function(e,s){n(t,o,e,s)}))}return s=s?s.then(r,r):r()}})}function S(e,n,o){var s=p;return function(r,i){if(s===m)throw Error("Generator is already running");if(s===y){if("throw"===r)throw i;return{value:t,done:!0}}for(o.method=r,o.arg=i;;){var a=o.delegate;if(a){var c=N(a,o);if(c){if(c===v)continue;return c}}if("next"===o.method)o.sent=o._sent=o.arg;else if("throw"===o.method){if(s===p)throw s=y,o.arg;o.dispatchException(o.arg)}else"return"===o.method&&o.abrupt("return",o.arg);s=m;var l=f(e,n,o);if("normal"===l.type){if(s=o.done?y:g,l.arg===v)continue;return{value:l.arg,done:o.done}}"throw"===l.type&&(s=y,o.method="throw",o.arg=l.arg)}}}function N(e,n){var o=n.method,s=e.iterator[o];if(s===t)return n.delegate=null,"throw"===o&&e.iterator.return&&(n.method="return",n.arg=t,N(e,n),"throw"===n.method)||"return"!==o&&(n.method="throw",n.arg=new TypeError("The iterator does not provide a '"+o+"' method")),v;var r=f(s,e.iterator,n.arg);if("throw"===r.type)return n.method="throw",n.arg=r.arg,n.delegate=null,v;var i=r.arg;return i?i.done?(n[e.resultName]=i.value,n.next=e.nextLoc,"return"!==n.method&&(n.method="next",n.arg=t),n.delegate=null,v):i:(n.method="throw",n.arg=new TypeError("iterator result is not an object"),n.delegate=null,v)}function A(t){var e={tryLoc:t[0]};1 in t&&(e.catchLoc=t[1]),2 in t&&(e.finallyLoc=t[2],e.afterLoc=t[3]),this.tryEntries.push(e)}function x(t){var e=t.completion||{};e.type="normal",delete e.arg,t.completion=e}function L(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(A,this),this.reset(!0)}function M(e){if(e||""===e){var n=e[c];if(n)return n.call(e);if("function"==typeof e.next)return e;if(!isNaN(e.length)){var s=-1,i=function n(){for(;++s<e.length;)if(r.call(e,s))return n.value=e[s],n.done=!1,n;return n.value=t,n.done=!0,n};return i.next=i}}throw new TypeError(o(e)+" is not iterable")}return C.prototype=O,i(I,"constructor",{value:O,configurable:!0}),i(O,"constructor",{value:C,configurable:!0}),C.displayName=d(O,u,"GeneratorFunction"),e.isGeneratorFunction=function(t){var e="function"==typeof t&&t.constructor;return!!e&&(e===C||"GeneratorFunction"===(e.displayName||e.name))},e.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,O):(t.__proto__=O,d(t,u,"GeneratorFunction")),t.prototype=Object.create(I),t},e.awrap=function(t){return{__await:t}},b(R.prototype),d(R.prototype,l,(function(){return this})),e.AsyncIterator=R,e.async=function(t,n,o,s,r){void 0===r&&(r=Promise);var i=new R(h(t,n,o,s),r);return e.isGeneratorFunction(n)?i:i.next().then((function(t){return t.done?t.value:i.next()}))},b(I),d(I,u,"Generator"),d(I,c,(function(){return this})),d(I,"toString",(function(){return"[object Generator]"})),e.keys=function(t){var e=Object(t),n=[];for(var o in e)n.push(o);return n.reverse(),function t(){for(;n.length;){var o=n.pop();if(o in e)return t.value=o,t.done=!1,t}return t.done=!0,t}},e.values=M,L.prototype={constructor:L,reset:function(e){if(this.prev=0,this.next=0,this.sent=this._sent=t,this.done=!1,this.delegate=null,this.method="next",this.arg=t,this.tryEntries.forEach(x),!e)for(var n in this)"t"===n.charAt(0)&&r.call(this,n)&&!isNaN(+n.slice(1))&&(this[n]=t)},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(e){if(this.done)throw e;var n=this;function o(o,s){return a.type="throw",a.arg=e,n.next=o,s&&(n.method="next",n.arg=t),!!s}for(var s=this.tryEntries.length-1;s>=0;--s){var i=this.tryEntries[s],a=i.completion;if("root"===i.tryLoc)return o("end");if(i.tryLoc<=this.prev){var c=r.call(i,"catchLoc"),l=r.call(i,"finallyLoc");if(c&&l){if(this.prev<i.catchLoc)return o(i.catchLoc,!0);if(this.prev<i.finallyLoc)return o(i.finallyLoc)}else if(c){if(this.prev<i.catchLoc)return o(i.catchLoc,!0)}else{if(!l)throw Error("try statement without catch or finally");if(this.prev<i.finallyLoc)return o(i.finallyLoc)}}}},abrupt:function(t,e){for(var n=this.tryEntries.length-1;n>=0;--n){var o=this.tryEntries[n];if(o.tryLoc<=this.prev&&r.call(o,"finallyLoc")&&this.prev<o.finallyLoc){var s=o;break}}s&&("break"===t||"continue"===t)&&s.tryLoc<=e&&e<=s.finallyLoc&&(s=null);var i=s?s.completion:{};return i.type=t,i.arg=e,s?(this.method="next",this.next=s.finallyLoc,v):this.complete(i)},complete:function(t,e){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&e&&(this.next=e),v},finish:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var n=this.tryEntries[e];if(n.finallyLoc===t)return this.complete(n.completion,n.afterLoc),x(n),v}},catch:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var n=this.tryEntries[e];if(n.tryLoc===t){var o=n.completion;if("throw"===o.type){var s=o.arg;x(n)}return s}}throw Error("illegal catch attempt")},delegateYield:function(e,n,o){return this.delegate={iterator:M(e),resultName:n,nextLoc:o},"next"===this.method&&(this.arg=t),v}},e}function r(t,e,n,o,s,r,i){try{var a=t[r](i),c=a.value}catch(t){return void n(t)}a.done?e(c):Promise.resolve(c).then(o,s)}function i(t){return function(){var e=this,n=arguments;return new Promise((function(o,s){var i=t.apply(e,n);function a(t){r(i,o,s,a,c,"next",t)}function c(t){r(i,o,s,a,c,"throw",t)}a(void 0)}))}}function a(t){return c.apply(this,arguments)}function c(){return(c=i(s().mark((function t(e){var o,r,i,a,c,l,u,d,h,f,p,g,m;return s().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return o=n(445),r=o.GoogleGenerativeAI,i=o.GoogleAIFileManager,a=new r("YOUR_GEMINI_API_KEY"),c=new i("YOUR_GEMINI_API_KEY"),t.next=5,fetch(e);case 5:return l=t.sent,t.next=8,l.blob();case 8:return u=t.sent,d=new File([u],"downloaded_image.jpg",{type:u.type}),t.next=12,c.uploadFile(d,{mimeType:d.type,displayName:d.name});case 12:return h=t.sent,f=h.file,p=a.getGenerativeModel({model:"gemini-1.5-flash"}),g=[{text:"Retrieve nutritional information from the image"},{fileData:{mimeType:f.mimeType,fileUri:f.uri}}],t.next=18,p.generateContent({contents:[{role:"user",parts:g}]});case 18:return m=t.sent,t.abrupt("return",m.response.text());case 20:case"end":return t.stop()}}),t)})))).apply(this,arguments)}chrome.runtime.onMessage.addListener(function(){var t=i(s().mark((function t(e,n,o){var r;return s().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if("processImage"!==e.action){t.next=5;break}return t.next=3,a(e.imageUrl);case 3:r=t.sent,o({nutritionalInfo:r});case 5:case"end":return t.stop()}}),t)})));return function(e,n,o){return t.apply(this,arguments)}}())})();