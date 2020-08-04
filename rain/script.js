"serviceWorker"in navigator&&window.addEventListener("load",()=>{navigator.serviceWorker.register("service-worker.js").catch(e=>{console.error("service-worker not installed")})});const minutesToMilliseconds=e=>6e4*e;class ScreenLock{constructor(){this.isLocked=!1,this.WakeLock=null,this.container=document.querySelector("html")}lock(){try{this.WakeLock=navigator.wakeLock.request("screen"),this.isLocked=!0,this.container.classList.add("powersave")}catch{}}unlock(){this.isLocked&&(this.wakeLock.release(),this.container.classList.remove("powersave"),this.isLocked=!1)}}class CallFunctionOnShake{constructor(e,t,i,s,o){this.deviceMoveHistory=[],this.threshold=o,this.timeframe=s,this.functionToCall=e,this.functionContext=i,this.functionArgumets=t,window.addEventListener("devicemotion",e=>{this.ifShakeCallFunction(e)})}ifShakeCallFunction(e){updateMoveHistory(e),checkIfShake(e)&&this.callFunction}invokeFunction(){this.functionToCall.apply(this.functionContext,this.functionArgumets)}checkIfShake(e){if(this.deviceMoveHistory.length<2)return;alert(this.deviceMoveHistory[1].x);const t=(e,i)=>{if(i||(i=0),!(i>this.deviceMoveHistory.length-2||Date.now()>this.deviceMoveHistory[i+1].timeOfMove+this.timeframe))return delta=Math.abs(this.deviceMoveHistory[i].axis-this.deviceMoveHistory[i+1].axis)+t(e,++i)};(t("x")>this.threshold||t("y")>this.threshold||t("z")>this.threshold)&&this.invokeFunction()}updateHistory(e){const t=e.accelerationIncludingGravity.x,i=e.accelerationIncludingGravity.y,s=e.accelerationIncludingGravity.z,o=Date.now();4===this.deviceMoveHistory.length&&this.deviceMoveHistory.pop(),this.deviceMoveHistory.unshift({x:t,y:i,z:s,timeOfMove:o})}}class RainSoundPlayer{constructor(){this.audio=document.querySelector("#rainAudio"),this.audio.volume=0,this.playBtn=document.querySelector("#playBtn"),this.playBtn.addEventListener("click",()=>{this.run("btn")}),"ondevicemotion"in window&&new CallFunctionOnShake(this.run,"shake",this,3e3,30),"wakeLock"in navigator&&(this.wakeLockInterface=new ScreenLock)}startPlayback(){this.playbackStatus="started",this.audio.play(),this.gradualVolumeChange("fadeIn"),this.stopPlaybackTime=Date.now()+minutesToMilliseconds(15),this.adjustRefreshTime(15),this.refreshTimeout=setTimeout(()=>{this.refresh()},this.refreshInterval),this.wakeLockInterface&&this.wakeLockInterface.lock()}stopPlayback(){this.playbackStatus="stopped",this.audio.pause(),this.audio.volume=0,this.wakeLockInterface&&this.wakeLockInterface.unlock(),setTimeout(()=>{this.blockPlayback()},minutesToMilliseconds(10))}restartTimer(){this.stopPlaybackTime=Date.now()+minutesToMilliseconds(15),this.audio.volume<1&&this.gradualVolumeChange("fadeIn"),this.adjustRefreshTime(15),this.refreshTimeout=setTimeout(()=>{this.refresh()},this.refreshInterval)}refresh(){console.log(this.stopPlaybackTime);const e=(this.stopPlaybackTime-Date.now())/minutesToMilliseconds(1);e<=2&&this.gradualVolumeChange("fadeOut"),e<=0?this.stopPlayback():(this.adjustRefreshTime(e),this.refreshTimeout=setTimeout(()=>{this.refresh()},this.refreshInterval))}adjustRefreshTime(e){e>=minutesToMilliseconds(5)?this.refreshInterval=minutesToMilliseconds(5):this.refreshInterval=minutesToMilliseconds(.5)}gradualVolumeChange(e){if("fadeIn"===e){if(this.audio.volume>=.95)return void(this.audio.volume=1);this.audio.volume+=.05}else{if(this.audio.volume<=.05)return void(this.audio.volume=0);this.audio.volume-=.05}let t;t="fadeIn"===e?1e3:6e3,clearTimeout(this.volumeChangeTimeout),this.volumeChangeTimeout=setTimeout(()=>{this.gradualVolumeChange(e)},t)}blockPlayback(){"stopped"===this.playbackStatus&&(this.playbackStatus="blocked")}run(e){switch(this.playbackStatus){case"started":this.restartTimer();break;case"blocked":"btn"===e&&this.startPlayback();break;default:this.startPlayback()}}}new RainSoundPlayer;