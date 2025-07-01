//krijoj yje duke perdorur shume div elements te shperdara randomly ne te gjithe web page.
function createStars(){
  const container = document.querySelector("body");
  for (let i=0; i<1000;i++){
    const stars = document.createElement("div");
    stars.className="stars";
    stars.style.width = ".1px";/* madhesia: 0.1px × 0.1px */
    stars.style.height=".1px";
    stars.style.top = Math.random() * 100 + "%";
    stars.style.left = Math.random() * 100 + "%";
    
    container.appendChild(stars);
  }
}
createStars();