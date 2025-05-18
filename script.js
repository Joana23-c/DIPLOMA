//krijoj yje duke perdorur shume div elements te shperdara randomly ne te gjithe web page.
function createStars(){
  const container = document.querySelector("body");
  for (let i=0; i<1000;i++){
    const stars = document.createElement("div");
    stars.className="stars";
    stars.style.width = ".1px";/* madhesia: 0.1px × 0.1px */
    stars.style.height=".1px";
    /*i vendos ne pozicione random
    nese i fshij keto te dyja nuk do te vendosen yjet random edhe do te gjenerohen te gjitha parane njeratjetres duke krijuar nje vize ne mes te body sepse e kam cilesuar qe cdo element i body duhet te vendoset ne mes te tij */
    stars.style.top = Math.random() * 100 + "%";
    stars.style.left = Math.random() * 100 + "%";
    
    container.appendChild(stars);/*e bej visible */
  }
}
createStars();